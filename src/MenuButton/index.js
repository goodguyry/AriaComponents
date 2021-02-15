import Popup from '../Popup';
import Menu from '../Menu';
import keyCodes from '../lib/keyCodes';

/**
 * Class to set up an interactive Menu Button element.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/menu-button/menu-button-links.html
 */
export default class MenuButton extends Popup {
  /**
   * Create a MenuButton.
   * @constructor
   *
   * @param {HTMLElement} controller The activating element.
   * @param {object}      options    The options object.
   */
  constructor(controller, options = {}) {
    // Pass in the `menu` type.
    super(controller, { type: 'menu' });

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'MenuButton';

    /**
     * Options shape.
     *
     * @type {object}
     */
    const defaultOptions = {
      /**
       * The Menu element.
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
    };

    // Merge remaining options with defaults and save all as instance properties.
    Object.assign(this, defaultOptions, options);

    // Bind class methods.
    this.controllerHandleKeydown = this.controllerHandleKeydown.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    // Initialize Popup.
    super.init();

    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.controller, this.target]);

    /**
     * The MenuButton is a Popup to present a Menu. The element used as the Menu
     * is determined by the following "logic":
     * 1. An HTMLUListElement was passed in as the `list` option
     * 2. The Popup target is an HTMLUListElement
     * 3. The first HTMLUListElement we inside the target
     *
     * @type {Menu}
     */
    if (null != this.list && 'UL' === this.list.nodeName) {
      this.menu = new Menu(this.list);
    } else if ('UL' === this.target.nodeName) {
      // Fallback to the target if it's a UL.
      this.menu = new Menu(this.target);
    } else {
      const list = this.target.querySelector('ul');
      this.menu = new Menu(list);
    }

    // Additional event listener(s).
    this.controller.addEventListener('keydown', this.controllerHandleKeydown);

    // Run {initCallback}
    this.onInit.call(this);
  }

  /**
   * Handle additional keydown events on the MenuButton controller.
   *
   * @param {Event} event The event object.
   */
  controllerHandleKeydown(event) {
    const { keyCode } = event;
    const {
      RETURN,
      UP,
      DOWN,
      SPACE,
    } = keyCodes;

    if ([RETURN, SPACE, UP, DOWN].includes(keyCode)) {
      event.preventDefault();

      // RETURN and SPACE are handled in the parent class.
      if ([UP, DOWN].includes(keyCode)) {
        this.toggle();
      }

      // Get fresh state.
      const { expanded } = this.state;

      /*
       * UP moves to last menu item, the rest move to first menu item.
       */
      if (expanded) {
        if (
          [RETURN, SPACE, DOWN].includes(keyCode)
          && null != this.menu.firstItem
        ) {
          this.menu.firstItem.focus();
        }

        if (keyCode === UP && null != this.menu.lastItem) {
          this.menu.lastItem.focus();
        }
      }
    }
  }

  /**
   * Destroy the Popup and Menu.
   */
  destroy() {
    // Destroy the Popup.
    super.destroy();

    // Destroy the Menu.
    this.menu.destroy();

    // Remove event listener.
    this.controller.removeEventListener(
      'keydown',
      this.controllerHandleKeydown
    );

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
