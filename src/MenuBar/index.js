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
    return isInstanceOf('Popup', menubarItem.popup)
      ? menubarItem.popup
      : false;
  }

  /**
   * Create a MenuBar.
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
    this[Symbol.toStringTag] = 'MenuBar';

    this.list = list;

    /**
     * Options shape.
     *
     * @type {object}
     */
    const defaultOptions = {
      /**
       * Selector used to validate menu items.
       *
       * This can also be used to exclude items that would otherwise be given a
       * "menuitem" role; e.g., `:not(.hidden)`.
       *
       * @type {string}
       */
      itemMatches: '*',
    };

    // Merge remaining options with defaults and save all as instance properties.
    Object.assign(this, defaultOptions, options);

    // Bind class methods.
    this.menubarHandleKeydown = this.menubarHandleKeydown.bind(this);
    this.menubarHandleClick = this.menubarHandleClick.bind(this);
    this.menuItemHandleKeydown = this.menuItemHandleKeydown.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Collect top-level menu items and set up event handlers.
   */
  init() {
    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.list]);

    // Set the menu role.
    this.list.setAttribute('role', 'menubar');

    /**
     * The menubar's child elements.
     *
     * @type {array}
     */
    this.menuBarChildren = Array.from(this.list.children);

    /**
     * Collected menubar links.
     *
     * @type {array}
     */
    this.menuBarItems = this.menuBarChildren.reduce((acc, item) => {
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

    /**
     * The number of menubar items.
     *
     * @type {number}
     */
    this.menuLength = this.menuBarItems.length;

    /*
     * Set menubar link attributes.
     */
    this.menuBarItems.forEach((link, index) => {
      // Set the item's role.
      link.setAttribute('role', 'menuitem');

      // Add size and position attributes.
      link.setAttribute('aria-setsize', this.menuLength);
      link.setAttribute('aria-posinset', index + 1);

      // Set menubar item role.
      link.parentElement.setAttribute('role', 'presentation');

      link.parentElement.addEventListener('keydown', this.menubarHandleKeydown);
      link.addEventListener('click', this.menubarHandleClick);
    });

    // Collect first and last MenuBar items and merge them in as instance properties.
    const [firstItem, lastItem] = getFirstAndLastItems(this.menuBarItems);
    Object.assign(this, { firstItem, lastItem });

    /**
     * A mouse 'click' event.
     *
     * @type {MouseEvent}
     */
    this.clickEvent = new MouseEvent(
      'click',
      {
        view: window,
        bubbles: true,
        cancelable: true,
      }
    );

    // Initialize popups for nested lists.
    const { popups, subMenus } = this.menuBarItems.reduce((acc, controller) => {
      // Bail if there's no target attribute.
      if (! controller.hasAttribute('target')) {
        return acc;
      }

      const popup = new Popup(
        controller,
        { type: 'menu' }
      );

      // Popup has to be instantiated.
      popup.init();

      acc.popups.push(popup);

      const { target } = popup;

      // Set Popup self-references.
      Object.getPrototypeOf(popup).setSelfReference
        .call(popup, [controller, target], 'popup');

      // If target isn't a UL, find the UL in target and use it.
      const list = ('UL' === target.nodeName)
        ? target
        : target.querySelector('ul');

      // Bail if there's no list.
      if (null === list) {
        return acc;
      }

      // Initialize submenu Menus.
      const subMenu = new Menu(
        list,
        {
          itemMatches: this.itemMatches,
          _stateDispatchesOnly: true,
        }
      );
      target.addEventListener('keydown', this.menuItemHandleKeydown);

      // Save the list's previous sibling.
      subMenu.previousSibling = controller;
      acc.subMenus.push(subMenu);

      return acc;
    }, { popups: [], subMenus: [] });

    // Save components as instance properties.
    Object.assign(this, { popups, subMenus });

    /**
     * Set initial state.
     *
     * @type {object}
     */
    this.state = {
      menubarItem: this.firstItem,
      popup: this.constructor.getPopupFromMenubarItem(this.firstItem),
    };

    // Set up initial tabindex.
    rovingTabIndex(this.menuBarItems, this.firstItem);

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Manage menubar state.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated() {
    const { menubarItem } = this.state;

    // Update the Popup tracked by state.
    this.state.popup = this.constructor.getPopupFromMenubarItem(menubarItem);

    // Prevent tabbing to all but the currently-active menubar item.
    rovingTabIndex(this.menuBarItems, menubarItem);

    menubarItem.focus();
  }

  /**
   * Handle keydown events on the menuList element.
   *
   * @param {Object} event The event object.
   */
  menubarHandleKeydown(event) {
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
    const { menubarItem, popup } = this.state;

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
          if (popup && popup.getState().expanded) {
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
        if (popup) {
          event.stopPropagation();
          event.preventDefault();

          if (! popup.getState().expanded) {
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
  menubarHandleClick(event) {
    this.setState({
      menubarItem: event.target,
    });
  }

  /**
   * Handle keydown events on sublist menuitems.
   *
   * @param {Object} event The event object.
   */
  menuItemHandleKeydown(event) {
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
        this.menubarHandleKeydown
      );
      link.removeEventListener('click', this.menubarHandleClick);
    });

    // Remove tabindex attribute.
    tabIndexAllow(this.menuBarItems);

    // Destroy popups.
    this.popups.forEach((popup) => {
      popup.target.removeEventListener('keydown', this.menuItemHandleKeydown);

      popup.destroy();
    });

    // Destroy subMenus.
    this.subMenus.forEach((submenu) => {
      submenu.destroy();
    });

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
