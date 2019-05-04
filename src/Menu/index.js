import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import MenuItem from '../MenuItem';
import keyCodes from '../lib/keyCodes';
import { rovingTabIndex, tabIndexAllow } from '../lib/rovingTabIndex';
import createScreenReaderText from '../lib/createScreenReaderText';
import instanceOf from '../lib/instanceOf';

/**
 * Menu class for managing a menu's top-level keyboard interactions.
 *
 * @param {HTMLElement} menu The menu <ul>
 */
export default class Menu extends AriaComponent {
  /**
   * Start the component
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     * @type {String}
     */
    this.componentName = 'menu';

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
    this.addHelpText = this.addHelpText.bind(this);
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
    this.menu.setAttribute('role', 'menu');

    this.addHelpText();

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

      link.addEventListener('keydown', this.handleMenuBarKeydown);
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

        target.addEventListener('keydown', this.handleListKeydown);
        const subList = new MenuItem({ menu: target });
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
    rovingTabIndex(this.menuBarItems, menubarItem);
    menubarItem.focus();
  }

  /**
   * Adds screen reader help text for use in aria-describedby attributes.
   */
  addHelpText() {
    const helpTextItems = [
      {
        id: 'menu-class-top-level-help',
        text: 'Use left and right arrow keys to navigate between menu items.',
      },
      {
        id: 'menu-class-submenu-help',
        text: 'Use right arrow key to move into submenus.',
      },
      {
        id: 'menu-class-esc-help',
        text: 'Use escape to exit the menu.',
      },
      {
        id: 'menu-class-submenu-explore',
        text: 'Use up and down arrow keys to explore.',
      },
      {
        id: 'menu-class-submenu-back',
        text: 'Use left arrow key to move back to the parent list.',
      },
    ];

    helpTextItems.forEach(({ id, text }) => {
      if (null === this.menu.parentElement.querySelector(`#${id}`)) {
        const helpSpan = createScreenReaderText(id, text);
        this.menu.parentElement.appendChild(helpSpan);
      }
    });
  }

  /**
   * Handle keydown events on the menuList element.
   *
   * @param {Object} event The event object.
   */
  handleMenuBarKeydown(event) {
    const { LEFT, RIGHT, DOWN } = keyCodes;
    const { keyCode } = event;
    const { menubarItem } = this.state;
    const activeIndex = this.menuBarItems.indexOf(menubarItem);

    if ([LEFT, RIGHT].includes(keyCode)) {
      event.stopPropagation();
      event.preventDefault();

      // Determine the direction.
      let nextIndex = (keyCode === LEFT)
        ? activeIndex - 1
        : activeIndex + 1;

      // Move to the end if we're moving to the previous child from the first child.
      if (LEFT === keyCode && 0 > nextIndex) {
        nextIndex = this.lastIndex;
      }

      // Move to first child if we're at the end.
      if (RIGHT === keyCode && this.lastIndex < nextIndex) {
        nextIndex = 0;
      }

      this.setState({
        menubarItem: this.menuBarItems[nextIndex],
      });
    } else if (DOWN === keyCode) {
      // Open the popup if it exists and is not expanded.
      if (instanceOf(menubarItem.popup, Popup)) {
        event.stopPropagation();
        event.preventDefault();

        const { popup } = menubarItem;

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
      if (instanceOf(popup.target.menuItem, MenuItem)) {
        popup.target.menuItem.destroy();
      }
      popup.destroy();
    });

    tabIndexAllow(this.menuBarItems);

    this.onDestroy.call(this);
  }
}
