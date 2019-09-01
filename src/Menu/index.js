import AriaComponent from '../AriaComponent';
import keyCodes from '../lib/keyCodes';
import instanceOf from '../lib/instanceOf';
import { nextPreviousFromUpDown } from '../lib/nextPrevious';
import {
  missingDescribedByWarning,
} from '../lib/checkForAriaDescribedbyElements';

/**
 * Class to set up an interactive Menu element.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#menu
 */
export default class Menu extends AriaComponent {
  /**
   * HTML IDs for elements containing help text
   *
   * @return {array}
   */
  static getHelpIds() {
    return [
      '#ac-describe-submenu-help',
      '#ac-describe-esc-help',
      '#ac-describe-submenu-explore',
      '#ac-describe-submenu-back',
    ];
  }

  /**
   * Test for a list as the next sibling element.
   *
   * @param {HTMLElement} element The element for which we're looking for a sibling.
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
   * @param {object} config The config object.
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     *
     * @type {string}
     */
    this.componentName = 'menuItem';

    /**
     * Options shape.
     *
     * @type {object}
     */
    const options = {
      /**
       * The menu element.
       *
       * @type {HTMLElement}
       */
      menu: null,
      /**
       * Callback to run after the component initializes.
       * @callback initCallback
       */
      onInit: () => {},
      /**
       * Callback to run after the component is destroyed.
       * @callback destroyCallback
       */
      onDestroy: () => {},
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    // Bind class methods
    this.handleListKeydown = this.handleListKeydown.bind(this);
    this.destroy = this.destroy.bind(this);

    // Only initialize if we passed in a <ul>.
    if (null !== this.menu || 'UL' !== this.menu.nodeName) {
      this.init();
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
    this.setSelfReference([this.menu]);

    /**
     * The list's child elements.
     *
     * @type {array}
     */
    this.listItems = Array.prototype.slice.call(this.menu.children);

    /**
     * Collected menu links.
     *
     * @type {array}
     */
    this.menuItems = this.listItems.reduce((acc, item) => {
      const itemLink = item.firstElementChild;

      if (null !== itemLink && 'A' === itemLink.nodeName) {
        return [...acc, itemLink];
      }

      return acc;
    }, []);

    /**
     * The number of menu items.
     *
     * @type {number}
     */
    this.menuItemsLength = this.menuItems.length;

    /**
     * Listen for keydown events on the menu.
     */
    this.menu.addEventListener('keydown', this.handleListKeydown);

    /*
     * Warn if aria-decribedby elements are not found.
     * Without these elements, the references will be broken and potentially
     * confusing to users.
     */
    missingDescribedByWarning(Menu.getHelpIds());

    /*
     * Set menu item attributes and instantiate submenus.
     */
    this.menuItems.forEach((link, index) => {
      link.setAttribute(
        'aria-describedby',
        // eslint-disable-next-line max-len
        'menu-class-submenu-explore menu-class-submenu-help menu-class-submenu-back menu-class-esc-help'
      );

      // Add size and position attributes.
      link.setAttribute('aria-setsize', this.menuItemsLength);
      link.setAttribute('aria-posinset', index + 1);

      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList) {
        const subList = new Menu({ menu: siblingList });
        // Save the list's previous sibling.
        subList.previousSibling = link;
      }
    });

    // Save the menu's first item.
    const [firstItem] = this.menuItems;
    Object.assign(this, { firstItem });

    // Run {initCallback}
    this.onInit.call(this);
  }

  /**
   * Handle keydown events on menu items.
   *
   * @param {Event} event The event object.
   */
  handleListKeydown(event) {
    const { keyCode } = event;
    const {
      UP,
      DOWN,
      LEFT,
      RIGHT,
    } = keyCodes;
    const { activeElement } = document;
    const activeDescendant = (this.menu.contains(activeElement)
      ? activeElement
      : this.menuItems[0]);

    if ([UP, DOWN].includes(keyCode)) {
      // Move through sibling list items.
      const nextItem = nextPreviousFromUpDown(
        keyCode,
        activeDescendant,
        this.menuItems
      );

      if (nextItem) {
        event.stopPropagation();
        event.preventDefault();

        nextItem.focus();
      }
    } else if (RIGHT === keyCode) {
      // Drill down into a nested list, if present.
      const siblingElement = this.constructor.nextElementIsUl(activeDescendant);

      if (siblingElement && instanceOf(siblingElement.menuItem, Menu)) {
        event.stopPropagation();
        event.preventDefault();

        const { menuItem } = siblingElement;
        menuItem.firstItem.focus();
      }
    } else if (LEFT === keyCode) {
      // Move up to the list's previous sibling, if present.
      if (undefined !== this.previousSibling) {
        event.stopPropagation();
        event.preventDefault();

        this.previousSibling.focus();
      }
    }
  }

  /**
   * Destroy the Menu and any submenus.
   */
  destroy() {
    this.menu.menuItem = null;

    this.menuItems.forEach((link) => {
      link.removeAttribute('aria-describedby');

      // Add size and position attributes.
      link.removeAttribute('aria-setsize');
      link.removeAttribute('aria-posinset');

      link.removeEventListener('keydown', this.handleListKeydown);

      // Destroy nested Menus.
      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList && instanceOf(siblingList.menuItem, Menu)) {
        siblingList.menuItem.destroy();
      }
    });

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
