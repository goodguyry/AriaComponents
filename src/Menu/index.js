import AriaComponent from '../AriaComponent';
import Disclosure from '../Disclosure';
import keyCodes from '../lib/keyCodes';
import isInstanceOf from '../lib/isInstanceOf';

/**
 * Class to set up an vertically oriented interactive Menu element.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#menu
 */
export default class Menu extends AriaComponent {
  /**
   * Test for a list as the next sibling element.
   *
   * @param {HTMLElement} element The element whose sibling we're testing.
   * @return {HTMLElement|boolean}
   */
  static nextElementIsUl(element) {
    const next = element.nextElementSibling;
    return (null !== next && 'UL' === next.nodeName) ? next : false;
  }

  /**
   * Create a Menu.
   * @constructor
   *
   * @param {HTMLUListElement} element The menu list element.
   * @param {object}           options The options object.
   */
  constructor(list, options = {}) {
    super(list);

    // Make sure the component element is an unordered list.
    if ('UL' !== list.nodeName) {
      AriaComponent.configurationError(
        'Expected component element nodeName to be `UL`'
      );
    }

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Menu';

    this.list = list;

    // Merge options.
    const {
      collapse,
      autoClose,
      _stateDispatchesOnly,
    } = {
      /**
       * Defaults.
       *
       * @type {object}
       */
      collapse: true,
      autoClose: true,
      _stateDispatchesOnly: false,

      ...options,
    };

    /**
     * Instantiate submenus as Disclosures.
     *
     * @type {Boolean}
     */
    this.collapse = collapse;

    /**
     * Close submenu Disclosures when they lose focus.
     *
     * @type {Boolean}
     */
    this.autoClose = (collapse && autoClose);

    /**
     * Whether to suppress Disclosure init and destroy events.
     *
     * @type {Boolean}
     */
    this._stateDispatchesOnly = _stateDispatchesOnly;

    // Bind class methods
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Update the auto-close option.
   *
   * @param {bool} autoClose Whether submenu Disclosures close on their own.
   */
  set autoClose(autoClose) {
    this.handleKeydown = autoClose;

    if (this.handleKeydown) {
      this.on('keydown', this.listHandleKeydown);
    } else {
      this.off('keydown', this.listHandleKeydown);
    }
  }

  /**
   * Collect menu links and recursively instantiate sublist menu items.
   */
  init() {
    /*
     * Add a reference to the class instance to enable external interactions
     * with this instance.
     */
    super.setSelfReference(this.list);

    /**
     * The list's child elements.
     *
     * @type {array}
     */
    this.listItems = Array.from(this.list.children);

    /**
     * Collected menu links.
     *
     * @type {array}
     */
    this.menuItems = this.listItems.reduce((acc, item) => {
      const [firstChild, ...theRest] = Array.from(item.children);

      // Try to use the first child of the menu item.
      let itemLink = firstChild;

      // If the first child isn't a link or button, find the first instance of either.
      if (null === itemLink || ! itemLink.matches('a,button')) {
        [itemLink] = Array.from(theRest)
          .filter((child) => child.matches('a,button'));

        // No filter match.
        if (undefined === itemLink) {
          return acc;
        }
      }

      return [...acc, itemLink];
    }, []);

    /**
     * The number of menu items.
     *
     * @type {number}
     */
    this.menuItemsLength = this.menuItems.length;

    /**
     * The submenu Disclosures.
     *
     * @type {array}
     */
    this.disclosures = [];

    /*
     * Set menu link attributes and instantiate submenus.
     */
    this.menuItems.forEach((link) => {
      // Instantiate submenu Disclosures
      if (this.collapse && link.hasAttribute('aria-controls')) {
        const disclosure = new Disclosure(
          link,
          { _stateDispatchesOnly: true }
        );

        this.disclosures.push(disclosure);
      }

      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList) {
        // Instantiate sub-Menus.
        const subList = new Menu(siblingList, { _stateDispatchesOnly: true });

        // Save the list's previous sibling.
        subList.previousSibling = link;
      }
    });

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Handle keydown events on menu items.
   *
   * @param {Event} event The event object.
   */
  listHandleKeydown(event) {
    const { keyCode } = event;
    const { TAB } = keyCodes;
    const { activeElement } = document;
    const activeDescendant = (this.list.contains(activeElement)
      ? activeElement
      : this.menuItems[0]);

    if (TAB === keyCode) {
      // etc.
      console.log(this); // eslint-disable-line
      console.log(activeDescendant); // eslint-disable-line
    }
  }

  /**
   * Destroy the Menu and any submenus.
   */
  destroy() {
    // Remove the reference to the class instance.
    this.deleteSelfReferences();

    // Remove the list attritbutes.
    this.removeAttributes(this.list);

    // Remove event listener.
    this.list.removeEventListener('keydown', this.listHandleKeydown);

    /*
     * Destroy inner Disclosure(s).
     *
     * Inner instances of aria-components must be destroyed before the outer
     * component so the id attribute persists, otherwise the attribute tracking is broken.
     */
    this.disclosures.forEach((disclosure) => disclosure.destroy());

    this.menuItems.forEach((link) => {
      // Remove list item attributes.
      this.removeAttributes(link.parentElement);

      // Remove menuitem attributes.
      this.removeAttributes(link);

      // Destroy nested Menus.
      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList && isInstanceOf('Menu', siblingList.menu)) {
        siblingList.menu.destroy();
      }
    });

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
