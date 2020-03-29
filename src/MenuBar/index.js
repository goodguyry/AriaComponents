import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import Menu from '../Menu';
import keyCodes from '../lib/keyCodes';
import { rovingTabIndex, tabIndexAllow } from '../lib/rovingTabIndex';
import { nextPreviousFromLeftRight } from '../lib/nextPrevious';
import isInstanceOf from '../lib/isInstanceOf';
import { missingDescribedByWarning } from '../lib/ariaDescribedbyElementsFound';
import Search from '../lib/Search';

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
   * HTML IDs for elements containing help text
   *
   * @return {array}
   */
  static getHelpIds() {
    return [
      '#ac-describe-top-level-help',
      '#ac-describe-submenu-help',
      '#ac-describe-esc-help',
    ];
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
    this.handleMenuBarKeydown = this.handleMenuBarKeydown.bind(this);
    this.handleMenuBarClick = this.handleMenuBarClick.bind(this);
    this.handleMenuItemKeydown = this.handleMenuItemKeydown.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);
    this.trackPopupState = this.trackPopupState.bind(this);
    this.destroy = this.destroy.bind(this);

    // Only initialize if we passed in a <ul>.
    if (null !== this.list && 'UL' === this.list.nodeName) {
      this.init();
    }
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
    this.menuBarChildren = Array.prototype.slice.call(this.list.children);

    /**
     * Collected menubar links.
     *
     * @type {array}
     */
    this.menuBarItems = this.menuBarChildren.reduce((acc, item) => {
      const itemLink = item.firstElementChild;

      if (null !== itemLink && 'A' === itemLink.nodeName) {
        return [...acc, itemLink];
      }

      return acc;
    }, []);

    /**
     * Initialize search.
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
     * Warn if aria-decribedby elements are not found.
     * Without these elements, the references will be broken and potentially
     * confusing to users.
     */
    missingDescribedByWarning(MenuBar.getHelpIds());

    /*
     * Set menubar link attributes.
     */
    this.menuBarItems.forEach((link, index) => {
      // Set the item's role.
      link.setAttribute('role', 'menuitem');

      // Add a reference to the help text.
      link.setAttribute(
        'aria-describedby',
        // eslint-disable-next-line max-len
        'ac-describe-top-level-help ac-describe-submenu-help ac-describe-esc-help'
      );

      // Add size and position attributes.
      link.setAttribute('aria-setsize', this.menuLength);
      link.setAttribute('aria-posinset', index + 1);

      // Set menubar item role.
      link.parentElement.setAttribute('role', 'presentation');

      link.parentElement.addEventListener('keydown', this.handleMenuBarKeydown);
      link.addEventListener('click', this.handleMenuBarClick);
    });

    /**
     * The index of the last menubar item
     *
     * @type {number}
     */
    this.lastIndex = (this.menuLength - 1);

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

    // Initialize popups for nested lists.
    this.popups = this.menuBarItems.reduce((acc, controller) => {
      const target = controller.nextElementSibling;

      if (null !== target && 'UL' === target.nodeName) {
        const popup = new Popup({
          controller,
          target,
          onInit: this.onPopupInit,
          onStateChange: this.trackPopupState,
          type: 'menu',
        });

        // Initialize submenu Menus.
        const subList = new Menu({ list: target });
        target.addEventListener('keydown', this.handleMenuItemKeydown);

        // Save the list's previous sibling.
        subList.previousSibling = controller;

        return [...acc, popup];
      }

      return acc;
    }, []);

    /**
     * Set initial state.
     *
     * @type {object}
     */
    const [menubarItem] = this.menuBarItems;
    this.state = {
      menubarItem,
      popup: this.constructor.getPopupFromMenubarItem(menubarItem),
      expanded: false,
    };

    // Set up initial tabindex.
    rovingTabIndex(this.menuBarItems, menubarItem);

    // Run {initCallback}
    this.onInit.call(this);
  }

  /**
   * Refresh component state when Popup state is updated.
   *
   * @param {object} state The Popup state.
   */
  trackPopupState(state = {}) {
    const { menubarItem } = this.state;
    const popup = this.constructor.getPopupFromMenubarItem(menubarItem);
    /*
     * Use the current MenuBar state if there's no popup or if an expanded state
     * was passed in, otherwise make sure to use the current popup's state.
     */
    const expanded = (
      false === popup
      || Object.prototype.hasOwnProperty.call(state, 'expanded')
    ) ? state.expanded : popup.getState();

    // Add the Popup state to this component's state.
    this.state = Object.assign({ menubarItem, popup, expanded });
  }

  /**
   * Manage menubar state.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated() {
    const { menubarItem } = this.state;

    // Make sure we're tracking the Popup state along with this.
    this.trackPopupState();

    // Prevent tabbing to all but the currently-active menubar item.
    rovingTabIndex(this.menuBarItems, menubarItem);

    menubarItem.focus();

    // Run {stateChangeCallback}
    this.onStateChange.call(this, this.state);
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
          if (popup) {
            popup.setState({ expanded: false });
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

          if (! popup.state.expanded) {
            popup.setState({ expanded: true });
          }

          popup.firstChild.focus();
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
          menubarItem: this.menuBarItems[this.lastIndex],
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

      // Remove reference to the help text.
      link.removeAttribute('aria-describedby');

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

    // Destroy nested components.
    this.popups.forEach((popup) => {
      if (isInstanceOf(popup.target.menu, Menu)) {
        popup.target.menu.destroy();
      }
      popup.target.removeEventListener('keydown', this.handleMenuItemKeydown);

      popup.destroy();
    });

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
