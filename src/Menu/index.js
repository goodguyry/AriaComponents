import AriaComponent from '../AriaComponent';
import Disclosure from '../Disclosure';
import keyCodes from '../lib/keyCodes';
import isInstanceOf from '../lib/isInstanceOf';
import { nextPreviousFromUpDown } from '../lib/nextPrevious';
import Search from '../lib/Search';
import getFirstAndLastItems from '../lib/getFirstAndLastItems';

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

    /**
     * Options shape.
     *
     * @type {object}
     */
    const defaultOptions = {
      /**
       * Instantiate submenus as Disclosures.
       *
       * @type {Boolean}
       */
      collapse: false,

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

    // Bind class methods
    this.listHandleKeydown = this.listHandleKeydown.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Collect menu links and recursively instantiate sublist menu items.
   */
  init() {
    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.list]);

    /*
     * Add the 'menu' role to signify a widget that offers a list of choices to
     * the user, such as a set of actions or functions.
     */
    this.list.setAttribute('role', 'menu');

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
      }

      if (undefined !== itemLink && itemLink.matches(this.itemMatches)) {
        return [...acc, itemLink];
      }

      return acc;
    }, []);

    /**
     * Initialize search.
     * @type {Search}
     */
    this.search = new Search(this.menuItems);

    /**
     * The number of menu items.
     *
     * @type {number}
     */
    this.menuItemsLength = this.menuItems.length;

    /**
     * Listen for keydown events on the menu.
     */
    this.list.addEventListener('keydown', this.listHandleKeydown);

    /**
     * The submenu Disclosures.
     *
     * @type {array}
     */
    this.disclosures = [];

    /*
     * Set menu link attributes and instantiate submenus.
     */
    this.menuItems.forEach((link, index) => {
      // Remove semantics from list items.
      link.parentElement.setAttribute('role', 'presentation');

      // Set the menuitem role.
      link.setAttribute('role', 'menuitem');

      // Add size and position attributes.
      link.setAttribute('aria-setsize', this.menuItemsLength);
      link.setAttribute('aria-posinset', index + 1);

      // Instantiate submenu Disclosures
      if (this.collapse && link.hasAttribute('target')) {
        const disclosure = new Disclosure(
          link,
          { _stateDispatchesOnly: true }
        );

        this.disclosures.push(disclosure);
      }

      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList) {
        // Instantiate sub-Menus.
        const subList = new Menu(
          siblingList,
          { _stateDispatchesOnly: true }
        );

        // Save the list's previous sibling.
        subList.previousSibling = link;
      }
    });

    // Save the menu's first and last items.
    const [firstItem, lastItem] = getFirstAndLastItems(this.menuItems);
    Object.assign(this, { firstItem, lastItem });

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
    const {
      UP,
      DOWN,
      LEFT,
      RIGHT,
      HOME,
      END,
      ESC,
    } = keyCodes;
    const { activeElement } = document;
    const activeDescendant = (this.list.contains(activeElement)
      ? activeElement
      : this.menuItems[0]);

    switch (keyCode) {
      /*
       * Move through sibling list items.
       */
      case UP:
      case DOWN: {
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

        break;
      }

      /*
       * Select the first Menu item.
       */
      case HOME: {
        event.preventDefault();

        this.firstItem.focus();

        break;
      }

      /*
       * Select the last Menu item.
       */
      case END: {
        event.preventDefault();

        this.lastItem.focus();

        break;
      }

      /*
       * Drill down into a nested list, if present.
       */
      case RIGHT: {
        const siblingElement = this.constructor.nextElementIsUl(activeDescendant); // eslint-disable-line max-len

        if (siblingElement && isInstanceOf('Menu', siblingElement.menu)) {
          event.stopPropagation();
          event.preventDefault();

          // Open the submenu Disclosure.
          if (isInstanceOf('Disclosure', activeDescendant.disclosure)) {
            activeDescendant.disclosure.open();
          }

          const { menu } = siblingElement;
          menu.firstItem.focus();
        }

        break;
      }

      /*
       * Move up to the list's previous sibling, if present.
       */
      case LEFT: {
        if (
          undefined !== this.previousSibling
          && ! this.previousSibling.hasAttribute('aria-haspopup')
        ) {
          // The previous sibling is not a Popup.
          event.preventDefault();
          event.stopPropagation();

          // Close the submenu Disclosure.
          if (isInstanceOf('Disclosure', this.previousSibling.disclosure)) {
            this.previousSibling.disclosure.close();
          }

          this.previousSibling.focus();
        }

        break;
      }

      /*
       * Listen for the ESC key to prevent it from being caught as a search
       * string. Otherwise the MenuButton won't close as expected.
       */
      case ESC: {
        // do nothing.
        break;
      }

      /*
       * Select the Menu item based on a search string created by
       * collecting key presses.
       */
      default: {
        event.stopPropagation();
        const itemToFocus = this.search.getItem(keyCode);
        if (null !== itemToFocus) {
          itemToFocus.focus();
        }

        break;
      }
    }
  }

  /**
   * Destroy the Menu and any submenus.
   */
  destroy() {
    // Remove the reference to the class instance.
    this.deleteSelfReferences();

    // Remove the list's role attritbute.
    this.list.removeAttribute('role');

    // Remove event listener.
    this.list.removeEventListener('keydown', this.listHandleKeydown);

    this.menuItems.forEach((link) => {
      // Remove list item role.
      link.parentElement.removeAttribute('role');

      // Remove menuitem attributes.
      link.removeAttribute('role');
      link.removeAttribute('aria-setsize');
      link.removeAttribute('aria-posinset');

      // Destroy nested Menus.
      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList && isInstanceOf('Menu', siblingList.menu)) {
        siblingList.menu.destroy();
      }
    });

    // Destroy inner Disclosure(s).
    this.disclosures.forEach((disclosure) => {
      disclosure.destroy();
    });

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
