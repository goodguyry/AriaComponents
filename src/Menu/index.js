import AriaComponent from '../AriaComponent';
import Disclosure from '../Disclosure';

/**
 * Class to set up an vertically oriented interactive Menu element.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#menu
 */
export default class Menu extends AriaComponent {
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

    /**
     * The menu list element.
     *
     * @type {HTMLUListElement}
     */
    this.list = list;

    /**
     * Submenu Disclosures.
     *
     * @type {array}
     */
    this.disclosures = [];

    // Merge options.
    const {
      _stateDispatchesOnly,
      autoClose,
    } = {
      autoClose: false,
      _stateDispatchesOnly: false,

      ...options,
    };

    /**
     * Whether to suppress Disclosure init and destroy events.
     *
     * @type {Boolean}
     */
    this._stateDispatchesOnly = _stateDispatchesOnly;

    /**
     * Close submenu Disclosures when they lose focus.
     *
     * @type {Boolean}
     */
    this.autoClose = autoClose;

    // Bind class methods
    this.destroy = this.destroy.bind(this);

    this.init();
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

    // Set and collect submenu Disclosures.
    Array.from(this.list.children).forEach((item) => {
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
            autoClose: this.autoClose,
            _stateDispatchesOnly: true,
          }
        );

        this.disclosures.push(disclosure);
      }
    });

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Destroy the Menu and any submenus.
   */
  destroy() {
    // Remove the reference to the class instance.
    this.deleteSelfReferences();

    /*
     * Destroy inner Disclosure(s).
     *
     * Inner instances of aria-components must be destroyed before the outer
     * component so the id attribute persists, otherwise the attribute tracking is broken.
     */
    this.disclosures.forEach((disclosure) => disclosure.destroy());

    // Remove the list attritbutes.
    this.removeAttributes(this.list);

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
