import Popup from './Popup';
import MenuItem from './MenuItem';
import keyCodes from './lib/keyCodes';
import rovingTabIndex from './lib/rovingTabIndex';
import createScreenReaderText from './lib/createScreenReaderText';
import instanceOf from './lib/instanceOf';

/**
 * Menu class for managing a menu's top-level keyboard interactions.
 *
 * @param {HTMLElement} menu The menu <ul>
 */
export default class Menu {
  /**
   * Start the component
   */
  constructor(menu) {
    /**
     * The menu <ul>
     * @type {HTMLElement}
     */
    this.menu = menu;

    // Bind class methods.
    this.addHelpText = this.addHelpText.bind(this);
    this.manageState = this.manageState.bind(this);
    this.handleMenuBarKeydown = this.handleMenuBarKeydown.bind(this);
    this.handleMenuBarClick = this.handleMenuBarClick.bind(this);

    this.init();
  }

  /**
   * Manage menu activeDescendant state.
   *
   * @param {Object} newState The new state.
   */
  manageState(newState) {
    this.state = Object.assign(this.state, newState);

    if (Object.prototype.hasOwnProperty.call(newState, 'activeDescendant')) {
      const { activeDescendant } = this.state;

      rovingTabIndex(this.menuBarItems, activeDescendant);
      activeDescendant.focus();
    }
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
    this.state = {
      activeDescendant: this.menuBarItems[0],
    };

    // Initialize popups for nested lists.
    this.popups = this.menuBarItems.map((controller) => {
      const target = controller.nextElementSibling;

      if (null !== target && 'UL' === target.nodeName) {
        const popup = new Popup({ controller, target });

        target.addEventListener('keydown', this.handleListKeydown);
        const subList = new MenuItem(target);
        // Save the list's previous sibling.
        subList.previousSibling = controller;

        return popup;
      }

      return false;
    });

    // Set up initial tabindex.
    rovingTabIndex(
      this.menuBarItems,
      this.state.activeDescendant
    );
  }

  /**
   * Handle keydown events on the menuList element.
   *
   * @param {Object} event The event object.
   */
  handleMenuBarKeydown(event) {
    const { LEFT, RIGHT, DOWN } = keyCodes;
    const { keyCode } = event;
    const { activeDescendant } = this.state;
    const activeIndex = this.menuBarItems.indexOf(activeDescendant);

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

      this.manageState({
        activeDescendant: this.menuBarItems[nextIndex],
      });
    } else if (DOWN === keyCode) {
      // Open the popup if it exists and is not expanded.
      if (instanceOf(activeDescendant, Popup)) {
        event.stopPropagation();
        event.preventDefault();

        const { popup } = activeDescendant;

        if (! popup.state.expanded) {
          popup.setExpandedState(true);
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
    this.manageState({
      activeDescendant: event.target,
    });
  }
}
