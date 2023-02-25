import AriaComponent from '../AriaComponent';

/**
 * Class to set up an vertically oriented interactive Menu element.
 *
 * https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
 */
export default class Menu extends AriaComponent {
  /**
   * Tracks the active Disclosure.
   * @private
   *
   * @type {object}
   */
  #activeDisclosure = undefined;

  /**
   * Prevent focusout from propagating from the controller.
   *
   * @param {Event} event The Event object.
   */
  static controllerHandleFocusout = (event) => event.stopPropagation();

  /**
   * Create a Menu.
   * @constructor
   *
   * @param {HTMLUListElement} list The menu list element.
   */
  constructor(list) {
    super(list);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Menu';

    /**
     * Submenu Disclosures.
     *
     * @type {array}
     */
    this.disclosures = [];

    // Make sure the component element is a list.
    if (['UL', 'OL'].includes(list.nodeName)) {
      this.init();
    } else {
      AriaComponent.configurationError(
        'Expected component element nodeName to be `UL` or `OL`'
      );
    }
  }

  /**
   * Set the active Disclosure ID, which conditionally sets the active Disclosure.
   *
   * @param {string} disclosureId The Disclosure ID.
   */
  set activeDisclosureId(disclosureId) {
    // Find the Disclosure by ID.
    const disclosure = this.disclosures.find((obj) => obj.id === disclosureId);

    // Get the Disclosure's current state.
    const isActiveId = (
      undefined !== this.activeDisclosureId
      && this.activeDisclosureId === disclosureId
    );

    // Toggle the Disclosure's state.
    if (undefined !== disclosure) {
      this.updateAttribute(disclosure.controller, 'aria-expanded', ! isActiveId);
      this.updateAttribute(disclosure.target, 'aria-hidden', isActiveId);
    }

    // Deactivate the currently-active disclosure, if any.
    if (undefined !== this.activeDisclosureId) {
      this.updateAttribute(this.activeDisclosure.controller, 'aria-expanded', false);
      this.updateAttribute(this.activeDisclosure.target, 'aria-hidden', true);
    }

    // If `disclosureId` was the active ID, then it is no longer active.
    this.#activeDisclosure = isActiveId ? undefined : disclosure;

    this.dispatch(
      'stateChange',
      {
        instance: this,
        activeDisclosure: this.activeDisclosure,
      }
    );
  }

  /**
   * Returns the active Disclosure ID.
   *
   * @return {string|undefined}
   */
  get activeDisclosureId() {
    return this.activeDisclosure?.id;
  }

  /**
   * Returns the active Disclosure.
   *
   * @return {object|undefined}
   */
  get activeDisclosure() {
    return this.#activeDisclosure;
  }

  /**
   * Initialize and save a submenu Disclosure.
   *
   * @param  {array}         disclosures The array of previous disclosures.
   * @param  {HTMLLIElement} menuChild   The menu item.
   * @return {array} A collection of submenu Disclosures.
   */
  initSubmenuDisclosure = (disclosures, menuChild) => {
    let controller = menuChild.querySelector(':scope > [aria-controls]');

    if (null === controller) {
      const [firstChild, ...theRest] = Array.from(menuChild.children);

      // Try to use the first child of the menu item.
      controller = firstChild;

      if (null == controller || ! controller.matches('a,button')) {
        // The first child isn't a link or button, so find the first instance of either.
        [controller] = Array.from(theRest).filter((child) => child.matches('a,button'));
      }
    }

    if (null == controller) {
      return disclosures;
    }

    const target = controller.parentElement.querySelector('ul');
    if (null == target) {
      return disclosures;
    }

    this.addAttribute(controller, 'aria-expanded', false);
    this.addAttribute(target, 'aria-hidden', true);

    controller.addEventListener('click', this.controllerHandleClick);
    controller.addEventListener('focusout', this.constructor.controllerHandleFocusout);
    document.body.addEventListener('keydown', this.bodyHandleKeydown);

    const disclosure = {
      id: controller.id,
      controller,
      target,
    };

    return [...disclosures, disclosure];
  };

  /**
   * Collect menu links and recursively instantiate sublist menu items.
   */
  init = () => {
    // Set and collect submenu Disclosures.
    this.disclosures = Array.from(this.element.children)
      .reduce(this.initSubmenuDisclosure, []);

    if (0 < this.disclosures.length) {
      this.on('focusout', this.menuHandleFocusout);
    }

    // Fire the init event.
    this.dispatchEventInit();
  };

  /**
   * Handle Disclosure controller clicks.
   *
   * @param {Event} event The Event object.
   */
  controllerHandleClick = (event) => {
    event.preventDefault();

    this.activeDisclosureId = event.target.id;
  };

  /**
   * Handle menu focusout events.
   *
   * @param {Event} event The Event object.
   */
  menuHandleFocusout = (event) => {
    if (! this.element.contains(event.relatedTarget)) {
      // Close any active submenu Disclosure.
      this.activeDisclosureId = undefined;
    }
  };

  /**
   * Handle Escape key.
   *
   * @param {Event} event The Event object.
   */
  bodyHandleKeydown = (event) => {
    if ('Escape' === event.key) {
      this.activeDisclosureId = undefined;
    }
  };

  /**
   * Destroy the Menu and any submenus.
   */
  destroy = () => {
    // Clear submenu Disclosure attributes.
    this.disclosures.forEach((disclosure) => {
      this.removeAttributes(disclosure.controller);
      this.removeAttributes(disclosure.target);
    });

    controller.removeEventListener('click', this.controllerHandleClick);
    controller.removeEventListener('focusout', this.constructor.controllerHandleFocusout);
    document.body.removeEventListener('keydown', this.bodyHandleKeydown);
    this.off('focusout', this.menuHandleFocusout);

    this.disclosures = [];

    // Remove the list attritbutes.
    this.removeAttributes(this.element);

    // Fire the destroy event.
    this.dispatchEventDestroy();
  };
}
