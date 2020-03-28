import AriaComponent from '../AriaComponent';
import keyCodes from '../lib/keyCodes';
import isInstanceOf from '../lib/isInstanceOf';
import { nextPreviousFromUpDown } from '../lib/nextPrevious';
import { missingDescribedByWarning } from '../lib/ariaDescribedbyElementsFound';
import Search from '../lib/Search';

/**
 * Class to set up an vertically oriented interactive Menu element.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#menu
 */
export default class Menu extends AriaComponent {
  /**
   * HTML IDs for elements containing help text.
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
   * @param {object} config The config object.
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     *
     * @type {string}
     */
    this.componentName = 'Menu';

    // Warn about deprecated config value.
    if (config.menu) {
      const { menu } = config;
      Object.assign(config, { list: menu, menu: undefined });

      this.warnDeprecated('config.menu', 'config.list');
    }

    /**
     * Options shape.
     *
     * @type {object}
     */
    const options = {
      /**
       * The menu's list element.
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
       * Callback to run after the component is destroyed.
       *
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
    if (null !== this.list && 'UL' === this.list.nodeName) {
      this.init();
    }
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
    this.listItems = Array.prototype.slice.call(this.list.children);

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
    this.list.addEventListener('keydown', this.handleListKeydown);

    /*
     * Warn if aria-decribedby elements are not found.
     * Without these elements, the references will be broken and potentially
     * confusing to users.
     */
    missingDescribedByWarning(Menu.getHelpIds());

    /*
     * Set menu link attributes and instantiate submenus.
     */
    this.menuItems.forEach((link, index) => {
      // Remove semantics from list items.
      link.parentElement.setAttribute('role', 'presentation');

      // Set the menuitem role.
      link.setAttribute('role', 'menuitem');

      link.setAttribute(
        'aria-describedby',
        // eslint-disable-next-line max-len
        'ac-describe-submenu-explore ac-describe-submenu-help ac-describe-submenu-back ac-describe-esc-help'
      );

      // Add size and position attributes.
      link.setAttribute('aria-setsize', this.menuItemsLength);
      link.setAttribute('aria-posinset', index + 1);

      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList) {
        const subList = new Menu({ list: siblingList });
        // Save the list's previous sibling.
        subList.previousSibling = link;
      }
    });

    // Save the menu's first and last items.
    const [firstItem] = this.menuItems;
    const lastItem = this.menuItems[this.menuItems.length - 1];
    Object.assign(this, { firstItem, lastItem });

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

        if (siblingElement && isInstanceOf(siblingElement.menu, Menu)) {
          event.stopPropagation();
          event.preventDefault();

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
    this.list.removeEventListener('keydown', this.handleListKeydown);

    this.menuItems.forEach((link) => {
      // Remove list item role.
      link.parentElement.removeAttribute('role');

      // Remove menuitem attributes.
      link.removeAttribute('role');
      link.removeAttribute('aria-describedby');
      link.removeAttribute('aria-setsize');
      link.removeAttribute('aria-posinset');

      // Destroy nested Menus.
      const siblingList = this.constructor.nextElementIsUl(link);
      if (siblingList && isInstanceOf(siblingList.menu, Menu)) {
        siblingList.menu.destroy();
      }
    });

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
