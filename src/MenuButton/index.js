import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import Menu from '../Menu';
import keyCodes from '../lib/keyCodes';

/**
 * Class to set up an interactive Menu Button element.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/menu-button/menu-button-links.html
 */
export default class MenuButton extends AriaComponent {
  /**
   * Create a ListBox.
   * @constructor
   *
   * @param {HTMLElement} controller The activating element.
   * @param {object}      options    The options object.
   */
  constructor(controller, options = {}) {
    super(controller);

    this.controller = controller;
    this.target = super.constructor.getTargetElement(controller);

    /**
     * The component name.
     *
     * @type {string}
     */
    this.componentName = 'MenuButton';

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
    Object.assign(this, { ...defaultOptions, ...options });

    // Bind class methods.
    this.controllerHandleKeydown = this.controllerHandleKeydown.bind(this);
    this.onPopupStateChange = this.onPopupStateChange.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    /**
     * The MenuButton is basically a Popup to present a Menu, so we instantiate
     * a Popup and subscribe to state changes to act on the MenuButton when the
     * Popup is shown and hidden.
     *
     * @type {Popup}
     */
    this.popup = new Popup(
      this.controller,
      {
        type: 'menu',
        onStateChange: this.onPopupStateChange,
      }
    );

    // Initialize the Menu if we passed one in.
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

    /**
     * Set initial state.
     *
     * @type {object}
     */
    this.state = { expanded: false };

    // Run {initCallback}
    this.onInit.call(this);
  }

  /**
   * Keep this component's state synced with the Popup's state.
   *
   * @param {Object} state The Popup state.
   */
  onPopupStateChange(state) {
    this.setState(state);

    // Run {stateChangeCallback}
    this.onStateChange.call(this, this.state);
  }

  /**
   * Handle keydown events on the MenuButton controller.
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

    switch (keyCode) {
      /*
       * Open the menu and move focus to the first menu item.
       */
      case RETURN:
      case SPACE:
      case DOWN: {
        event.preventDefault();
        this.show();

        // Move focus to the first menu item.
        if (this.menu.firstItem) {
          this.menu.firstItem.focus();
        }

        break;
      }

      /*
       * Opens the menu and move focus to the last menu item.
       */
      case UP: {
        event.preventDefault();
        this.show();

        // Move focus to the last menu item.
        if (this.menu.lastItem) {
          this.menu.lastItem.focus();
        }

        break;
      }

      default:
        break;
    }
  }

  /**
   * Destroy the Popup and Menu.
   */
  destroy() {
    // Destroy the MenuButton Popup.
    this.popup.destroy();

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

  /**
   * Show the menu Popup.
   */
  show() {
    this.popup.show();
  }

  /**
   * Hide the menu Popup.
   */
  hide() {
    this.popup.hide();
  }
}
