import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import Menu from '../Menu';
import keyCodes from '../lib/keyCodes';
import { rovingTabIndex, tabIndexAllow } from '../lib/rovingTabIndex';
import { nextPreviousFromLeftRight } from '../lib/nextPrevious';
import instanceOf from '../lib/instanceOf';
import {
  missingDescribedByWarning,
} from '../lib/checkForAriaDescribedbyElements';

/**
 * MenuBar class for managing a visually persistent menu.
 *
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#menu
 * @see https://www.w3.org/TR/wai-aria-1.1/#menubar
 *
 * @param {HTMLElement} menu The menu <ul>
 */
export default class MenuBar extends AriaComponent {
  /**
   * HTML IDs for elements containing help text
   *
   * @return {Array}
   */
  static getHelpIds() {
    return [
      '#ac-describe-top-level-help',
      '#ac-describe-submenu-help',
      '#ac-describe-esc-help',
    ];
  }

  /**
   * Start the component
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     * @type {String}
     */
    this.componentName = 'menuBar';

    /**
     * Options shape.
     * @type {Object}
     */
    const options = {
      menu: null,
      onInit: () => {},
      onDestroy: () => {},
      onPopupStateChange: () => {},
      onPopupInit: () => {},
      onPopupDestroy: () => {},
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    // Bind class methods.
    this.handleMenuBarKeydown = this.handleMenuBarKeydown.bind(this);
    this.handleMenuBarClick = this.handleMenuBarClick.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);
    this.destroy = this.destroy.bind(this);

    if (null !== this.menu && 'UL' === this.menu.nodeName) {
      this.init();
    }
  }

  /**
   * Collect top-level menu items and set up event handlers.
   */
  init() {
    // Set the menu role.
    this.menu.setAttribute('role', 'menubar');

    this.menuItemsCollection = this.menu.children;
    this.menuItemsArray = Array.prototype.slice.call(this.menuItemsCollection);

    // Collect menu links.
    this.menuBarItems = this.menuItemsArray.reduce((acc, item) => {
      const itemLink = item.firstElementChild;

      if (null !== itemLink && 'A' === itemLink.nodeName) {
        return [...acc, itemLink];
      }

      return acc;
    }, []);

    /**
     * The number of menu items.
     * @type {Number}
     */
    this.menuLength = this.menuBarItems.length;

    // Warn if aria-decribedby elements are not found.
    missingDescribedByWarning(Menu.getHelpIds());

    // Set menu link attributes and event listeners.
    this.menuBarItems.forEach((link, index) => {
      // Add a reference to the help text.
      link.setAttribute(
        'aria-describedby',
        // eslint-disable-next-line max-len
        'menu-class-top-level-help menu-class-submenu-help menu-class-esc-help'
      );

      // Add size and position attributes.
      link.setAttribute('aria-setsize', this.menuLength);
      link.setAttribute('aria-posinset', index + 1);

      link.parentElement.addEventListener('keydown', this.handleMenuBarKeydown);
      link.addEventListener('click', this.handleMenuBarClick);
    });

    /**
     * The index of the last menubar item
     * @type {Number}
     */
    this.lastIndex = (this.menuLength - 1);

    /**
     * Set initial state.
     * @type {Object}
     */
    [this.state.menubarItem] = this.menuBarItems;

    // Initialize popups for nested lists.
    this.popups = this.menuBarItems.reduce((acc, controller) => {
      const target = controller.nextElementSibling;

      if (null !== target && 'UL' === target.nodeName) {
        const popup = new Popup({
          controller,
          target,
          onStateChange: this.onPopupStateChange,
          onInit: this.onPopupInit,
          onDestroy: this.onPopupDestroy,
        });

        const subList = new Menu({ menu: target });
        // Save the list's previous sibling.
        subList.previousSibling = controller;

        return [...acc, popup];
      }

      return acc;
    }, []);

    // Set up initial tabindex.
    rovingTabIndex(this.menuBarItems, this.state.menubarItem);

    this.onInit.call(this);
  }

  /**
   * Manage menu menubarItem state.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated({ menubarItem }) {
    // Add the current popup (or false) to state.
    this.state.popup = instanceOf(menubarItem.popup, Popup)
      ? menubarItem.popup
      : false;
    rovingTabIndex(this.menuBarItems, menubarItem);
    menubarItem.focus();
  }

  /**
   * Handle keydown events on the menuList element.
   *
   * @param {Object} event The event object.
   */
  handleMenuBarKeydown(event) {
    const { LEFT, RIGHT, DOWN } = keyCodes;
    const { keyCode } = event;
    const { menubarItem, popup } = this.state;

    if ([LEFT, RIGHT].includes(keyCode)) {
      // Move through sibling list items.
      const nextItem = nextPreviousFromLeftRight(
        keyCode,
        menubarItem,
        this.menuBarItems
      );

      if (nextItem) {
        event.stopPropagation();
        event.preventDefault();

        this.setState({
          menubarItem: nextItem,
        });
      }
    } else if (DOWN === keyCode) {
      // Open the popup if it exists and is not expanded.
      if (popup) {
        event.stopPropagation();
        event.preventDefault();

        if (! popup.state.expanded) {
          popup.setState({ expanded: true });
        }

        popup.firstChild.focus();
      }
    }
  }

  /**
   * Update the active descendant when the item is clicked.
   *
   * @param  {Object} event The event object.
   */
  handleMenuBarClick(event) {
    this.setState({
      menubarItem: event.target,
    });
  }

  /**
   * Recursively destroy Menu, MenuItems, and Popups.
   */
  destroy() {
    // Remove the menu role.
    this.menu.removeAttribute('role');

    this.menuBarItems.forEach((link) => {
      // Remove reference to the help text.
      link.removeAttribute('aria-describedby');

      // Remove size and position attributes.
      link.removeAttribute('aria-setsize');
      link.removeAttribute('aria-posinset');

      link.removeEventListener('keydown', this.handleMenuBarKeydown);
      link.removeEventListener('click', this.handleMenuBarClick);
    });

    // Destroy nested components.
    this.popups.forEach((popup) => {
      if (instanceOf(popup.target.menuItem, Menu)) {
        popup.target.menuItem.destroy();
      }
      popup.destroy();
    });

    tabIndexAllow(this.menuBarItems);

    this.onDestroy.call(this);
  }
}
