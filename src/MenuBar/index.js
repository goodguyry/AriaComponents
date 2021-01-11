import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import Menu from '../Menu';
import keyCodes from '../lib/keyCodes';
import { rovingTabIndex, tabIndexAllow } from '../lib/rovingTabIndex';
import { nextPreviousFromLeftRight } from '../lib/nextPrevious';
import isInstanceOf from '../lib/isInstanceOf';
import Search from '../lib/Search';
import getFirstAndLastItems from '../lib/getFirstAndLastItems';

/**
 * Class for managing a visually persistent (horizontally-oriented) menubar,
 * with each submenu item is instantiated as a Popup.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#menu
 * https://www.w3.org/TR/wai-aria-1.1/#menubar
 */
export default class MenuBar extends AriaComponent {
  /**
   * Save the menuBar item's popup, if it exists.
   *
   * @param {HTMLElement} menubarItem The current menubarItem from state.
   * @return {Popup|Boolean} The menubarItem's popup, or false if none.
   */
  static getPopupFromMenubarItem(menubarItem) {
    return isInstanceOf(menubarItem.popup, Popup)
      ? menubarItem.popup
      : false;
  }

  /**
   * Create a MenuBar.
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
    this.componentName = 'MenuBar';

    // Warn about deprecated config values.
    Object.keys(config).forEach((prop) => {
      if ('menu' === prop) {
        const { menu } = config;
        // Correct the config property.
        Object.assign(config, { list: menu, menu: undefined });

        this.warnDeprecated('config.menu', 'config.list');
      }

      // Deprecated callbacks.
      if (['onPopupDestroy', 'onPopupStateChange'].includes(prop)) {
        this.warnDeprecated(`config.${prop}`);
      }
    });

    /**
     * Options shape.
     *
     * @type {object}
     */
    const options = {
      /**
       * The menubar list element.
       *
       * @type {HTMLUListElement}
       */
      list: null,

      /**
       * Selector used to validate menu items.
       *
       * This can also be used to exclude items that would otherwise be given a
       * "menuitem" role; e.g., `:not(.hidden)`.
       *
       * @type {string}
       */
      itemMatches: '*',

      /**
       * Callback to run after the component initializes.
       *
       * @callback initCallback
       */
      onInit: () => {},

      /**
       * Callback to run after component state is updated.
       *
       * @callback stateChangeCallback
       */
      onStateChange: () => {},

      /**
       * Callback to run after the component is destroyed.
       *
       * @callback destroyCallback
       */
      onDestroy: () => {},

      /**
       * Callback to run after Popup initializes.
       *
       * @callback popupInitCallback
       */
      onPopupInit: () => {},
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    // Bind class methods.
    this.setMenuBarItems = this.setMenuBarItems.bind(this);
    this.setMenuBarSubMenuItems = this.setMenuBarSubMenuItems.bind(this);
    this.handleMenuBarKeydown = this.handleMenuBarKeydown.bind(this);
    this.handleMenuBarClick = this.handleMenuBarClick.bind(this);
    this.handleMenuItemKeydown = this.handleMenuItemKeydown.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);
    this.onPopupStateChange = this.onPopupStateChange.bind(this);
    this.destroy = this.destroy.bind(this);

    // Only initialize if we passed in a <ul>.
    if (null !== this.list && 'UL' === this.list.nodeName) {
      this.init();
    }
  }

  /**
   * Collect top-level menu items and set up event handlers.
   */
  setMenuBarItems() {
    /**
     * Collected menubar links.
     *
     * @type {array}
     */
    this.menuBarItems = Array.from(this.list.children).reduce((acc, item) => {
      const [firstChild, ...theRest] = Array.from(item.children);

      // Try to use the first child of the menu item.
      let itemLink = firstChild;

      // If the first child isn't a link or button, find the first instance of either.
      if (null === itemLink || ! itemLink.matches('a,button')) {
        [itemLink] = Array.from(theRest)
          .filter((child) => child.matches('a,button'));
      }

      if (undefined !== itemLink && itemLink.matches(this.itemMatches)) {
        return [...acc, itemLink];
      }

      return acc;
    }, []);

    /**
     * Initialize search.
     *
     * @type {Search}
     */
    this.search = new Search(this.menuBarItems);

    /*
     * Set menubar link attributes.
     */
    this.menuBarItems.forEach((link, index) => {
      // Set the item's role.
      link.setAttribute('role', 'menuitem');

      // Add size and position attributes.
      link.setAttribute('aria-setsize', this.menuBarItems.length);
      link.setAttribute('aria-posinset', index + 1);

      // Set menubar item role.
      link.parentElement.setAttribute('role', 'presentation');

      link.parentElement.addEventListener('keydown', this.handleMenuBarKeydown);
      link.addEventListener('click', this.handleMenuBarClick);
    });

    // Collect first and last MenuBar items and merge them in as instance properties.
    const [firstItem, lastItem] = getFirstAndLastItems(this.menuBarItems);
    Object.assign(this, { firstItem, lastItem });

    /*
     * Set up tabindex.
     * The first item, by default, is "allowed", but if any of the menu items is
     * active, it should be allowed.
     */
    const allowedItem = this.menuBarItems.includes(document.activeElement)
      ? document.activeElement
      : this.firstItem;
    rovingTabIndex(this.menuBarItems, allowedItem);
  }

  /**
   * Initialize Menus and Popups for nested lists.
   */
  setMenuBarSubMenuItems() {
    const { popups, subMenus } = this.menuBarItems.reduce((acc, controller) => {
      const target = controller.nextElementSibling;

      // Bail if there's no target.
      if (null === target) {
        return acc;
      }

      const popup = new Popup({
        controller,
        target,
        onInit: this.onPopupInit,
        onStateChange: this.onPopupStateChange,
        type: 'menu',
      });

      acc.popups.push(popup);

      // If target isn't a UL, find the UL in target and use it.
      const list = ('UL' === target.nodeName)
        ? target
        : target.querySelector('ul');

      // Bail if there's no list.
      if (null === list) {
        return acc;
      }

      // Initialize submenu Menus.
      const subMenu = new Menu({ list, itemMatches: this.itemMatches });
      target.addEventListener('keydown', this.handleMenuItemKeydown);

      // Save the list's previous sibling.
      subMenu.previousSibling = controller;
      acc.subMenus.push(subMenu);

      return acc;
    }, { popups: [], subMenus: [] });

    // Save components as instance properties.
    Object.assign(this, { popups, subMenus });
  }

  /**
   * Initialize the Menu.
   */
  init() {
    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.list]);

    // Set the menu role.
    this.list.setAttribute('role', 'menubar');

    // Set menuitem roles and attributes.
    this.setMenuBarItems();

    /**
     * A mouse 'click' event.
     *
     * @type {MouseEvent}
     */
    this.clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    // Initialize Menus and Popups for nested lists.
    this.setMenuBarSubMenuItems();

    /**
     * Set initial state.
     *
     * @type {object}
     */
    this.state = {
      menubarItem: this.firstItem,
      popup: this.constructor.getPopupFromMenubarItem(this.firstItem),
      expanded: false,
    };

    // Run {initCallback}
    this.onInit.call(this);
  }

  /**
   * Manage menubar state.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated() {
    const { menubarItem } = this.state;

    // Prevent tabbing to all but the currently-active menubar item.
    rovingTabIndex(this.menuBarItems, menubarItem);

    menubarItem.focus();

    // Run {stateChangeCallback}
    this.onStateChange.call(this, this.state);
  }

  /**
   * Track Popup state changes.
   *
   * @param  {boolean} options.expanded The Popup state,
   */
  onPopupStateChange({ expanded }) {
    this.setState({ expanded });
  }

  /**
   * Handle keydown events on the menuList element.
   *
   * @param {Object} event The event object.
   */
  handleMenuBarKeydown(event) {
    const {
      LEFT,
      RIGHT,
      DOWN,
      HOME,
      END,
      SPACE,
      RETURN,
    } = keyCodes;
    const { keyCode } = event;
    const { menubarItem } = this.state;
    const popup = this.constructor.getPopupFromMenubarItem(menubarItem);

    switch (keyCode) {
      /*
       * Move through sibling list items.
       */
      case LEFT:
      case RIGHT: {
        const nextItem = nextPreviousFromLeftRight(
          keyCode,
          menubarItem,
          this.menuBarItems
        );

        if (nextItem) {
          event.stopPropagation();
          event.preventDefault();

          // Close the popup.
          if (false !== popup) {
            popup.hide();
          }

          this.setState({
            menubarItem: nextItem,
          });
        }

        break;
      }

      /*
       * Open the popup if it exists and is not expanded.
       */
      case SPACE:
      case RETURN:
      case DOWN: {
        if (false !== popup && event.target === popup.controller) {
          event.stopPropagation();
          event.preventDefault();

          if (! popup.state.expanded) {
            popup.show();
          }

          popup.firstInteractiveChild.focus();
        }

        break;
      }

      /*
       * Select the first MenuBar item.
       */
      case HOME: {
        event.preventDefault();
        const [firstItem] = this.menuBarItems;
        this.setState({
          menubarItem: firstItem,
        });

        break;
      }

      /*
       * Select the last MenuBar item.
       */
      case END: {
        event.preventDefault();
        this.setState({
          menubarItem: this.lastItem,
        });

        break;
      }

      /*
       * Select the MenuBar item based on a search string created by
       * collecting key presses.
       */
      default: {
        const itemToFocus = this.search.getItem(keyCode);
        if (null !== itemToFocus) {
          this.setState({ menubarItem: itemToFocus });
        }

        break;
      }
    }
  }

  /**
   * Update the active descendant when the item is clicked.
   *
   * @param {Object} event The event object.
   */
  handleMenuBarClick(event) {
    this.setState({
      menubarItem: event.target,
    });
  }

  /**
   * Handle keydown events on sublist menuitems.
   *
   * @param {Object} event The event object.
   */
  handleMenuItemKeydown(event) {
    const { SPACE, RETURN } = keyCodes;
    const { keyCode, target } = event;

    if ([SPACE, RETURN].includes(keyCode) && 'A' === target.nodeName) {
      event.stopPropagation();
      event.preventDefault();

      // Simulate a mouse event to activate the menuitem.
      target.dispatchEvent(this.clickEvent);
    }
  }

  /**
   * Recursively destroy MenuBar and Popups.
   */
  destroy() {
    // Remove the reference to the class instance.
    this.deleteSelfReferences();

    // Remove the menu role.
    this.list.removeAttribute('role');

    this.menuBarItems.forEach((link) => {
      // Remove list item role.
      link.parentElement.removeAttribute('role');

      // Remove size and position attributes.
      link.removeAttribute('aria-setsize');
      link.removeAttribute('aria-posinset');
      link.removeAttribute('role');

      // Remove event listeners.
      link.parentElement.removeEventListener(
        'keydown',
        this.handleMenuBarKeydown
      );
      link.removeEventListener('click', this.handleMenuBarClick);
    });

    // Remove tabindex attribute.
    tabIndexAllow(this.menuBarItems);

    // Destroy popups.
    this.popups.forEach((popup) => {
      popup.target.removeEventListener('keydown', this.handleMenuItemKeydown);

      popup.destroy();
    });

    // Destroy subMenus.
    this.subMenus.forEach((submenu) => {
      submenu.destroy();
    });

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
