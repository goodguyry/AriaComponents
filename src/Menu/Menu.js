import AriaComponent from '../AriaComponent';
import Disclosure, { UseButtonRole } from '../Disclosure';

/**
 * Class to set up an vertically oriented interactive Menu element.
 *
 * https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
 */
export default class Menu extends AriaComponent {
  /**
   * Initial `autoClose` option value.
   * @private
   *
   * @type {Boolean}
   */
  #optionAutoClose = false;

  /**
   * Create a Menu.
   * @constructor
   *
   * @param {HTMLUListElement} list    The menu list element.
   * @param {object}           options The options object.
   */
  constructor(list, options = {}) {
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

    // Merge options.
    const {
      autoClose,
    } = {
      autoClose: this.#optionAutoClose,

      ...options,
    };

    /**
     * Close submenu Disclosures when they lose focus.
     *
     * @type {Boolean}
     */
    this.autoClose = autoClose;

    // Bind class methods
    this.handleDisclosureStateChange = this.handleDisclosureStateChange.bind(this);
    this.destroy = this.destroy.bind(this);

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
   * Enables the Disclosures' `autoClose` option.
   *
   * @param {bool} shouldAutoClose Whether the Disclosure should close automatically.
   */
  set autoClose(shouldAutoClose) {
    if (shouldAutoClose) {
      this.on('disclosure.stateChange', this.handleDisclosureStateChange);
    } else {
      this.off('disclosure.stateChange', this.handleDisclosureStateChange);
    }
  }

  /**
   * Collect menu links and recursively instantiate sublist menu items.
   */
  init() {
    // Set and collect submenu Disclosures.
    Array.from(this.element.children).forEach((item) => {
      const [firstChild, ...theRest] = Array.from(item.children);

      // Try to use the first child of the menu item.
      let itemLink = firstChild;

      // If the first child isn't a link or button, find the first instance of either.
      if (null === itemLink || ! itemLink.matches('a,button')) {
        [itemLink] = Array.from(theRest).filter((child) => child.matches('a,button'));
      }

      if (undefined !== itemLink && itemLink.hasAttribute('aria-controls')) {
        const disclosure = new Disclosure(
          itemLink,
          {
            autoClose: this.#optionAutoClose,
            allowOutsideClick: ! this.#optionAutoClose,
            modules: UseButtonRole,
          }
        );

        this.disclosures.push(disclosure);
      }
    });

    if (this.autoClose) {
      this.on('disclosure.stateChange', this.handleDisclosureStateChange);
    }

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Close any open Disclosure(s) when another is opened.
   *
   * @param {Event} event The Event object.
   */
  handleDisclosureStateChange(event) {
    const { detail: { instance } } = event;

    if (instance.expanded) {
      // There should only be one /shrug.
      const open = this.disclosures.find((disclosure) => (
        disclosure.expanded && instance.id !== disclosure.id
      ));

      open?.close();
    }
  }

  /**
   * Destroy the Menu and any submenus.
   */
  destroy() {
    /*
     * Destroy inner Disclosure(s).
     *
     * Inner instances of aria-components must be destroyed before the outer
     * component so the id attribute persists, otherwise the attribute tracking is broken.
     */
    this.disclosures.forEach((disclosure) => disclosure.destroy());

    // Remove the list attritbutes.
    this.removeAttributes(this.element);

    this.off('stateChange', this.handleDisclosureStateChange);

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
