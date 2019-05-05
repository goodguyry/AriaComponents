import AriaComponent from '../AriaComponent';
import keyCodes from '../lib/keyCodes';
import interactiveChildren from '../lib/interactiveChildren';

/**
 * Popup class.
 * Sets up an interactive popup element, such as menu or dialog, that can be
 * triggered by a controlling element.
 */
export default class Popup extends AriaComponent {
  /**
   * Start the component
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     * @type {String}
     */
    this.componentName = 'popup';

    /**
     * Component configuration options.
     * @type {Object}
     */
    const options = {
      /**
       * The element used to trigger the popup element.
       * @type {HTMLElement}
       */
      controller: null,
      /**
       * The popup element.
       * @type {HTMLElement}
       */
      target: null,
      /**
       * The value of aria-haspopup must match the role of the popup container.
       * Options: menu, listbox, tree, grid, or dialog,
       * @type {String}
       */
      type: 'true', // 'true' === 'menu' in UAs that don't support WAI-ARIA 1.1
      /**
       * Callback to run after the component initializes.
       * @type {Function}
       */
      onInit: () => {},
      /**
       * Callback to run after component state is updated.
       * @type {Function}
       */
      onStateChange: () => {},
      /**
       * Callback to run after the component is destroyed.
       * @type {Function}
       */
      onDestroy: () => {},
    };

    // Save references to the controller and target.
    Object.assign(this, options, config);

    // Intial component state.
    this.state.expanded = false;

    // Bind class methods.
    this.init = this.init.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.controllerClickHandler = this.controllerClickHandler.bind(this);
    this.controllerKeyDownHandler = this.controllerKeyDownHandler.bind(this);
    this.targetKeyDownHandler = this.targetKeyDownHandler.bind(this);
    this.hideOnTabOut = this.hideOnTabOut.bind(this);
    this.hideOnOutsideClick = this.hideOnOutsideClick.bind(this);
    this.destroy = this.destroy.bind(this);

    // Check for a valid controller and target before initializing.
    if (null !== this.controller && null !== this.target) {
      this.init();
    }
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    /**
     * Collect the target element's interactive child elements.
     * @type {Array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    /**
     * Collect first and last interactive child elements from target and merge
     * them in as instance properties.
     */
    if (0 < this.interactiveChildElements.length) {
      const [firstChild] = this.interactiveChildElements;
      const lastChild = (
        this.interactiveChildElements[this.interactiveChildElements.length - 1]
      );

      Object.assign(this, { firstChild, lastChild });
    }

    /**
     * Add a reference to the class instance to enable external interactions
     * with this instance.
     */
    super.setSelfReference([this.controller, this.target]);

    // Add controller attributes
    this.controller.setAttribute('aria-haspopup', this.type);
    this.controller.setAttribute('aria-expanded', 'false');
    this.controller.setAttribute('aria-controls', this.target.id);

    /**
     * Establishes a relationship when the DOM heirarchy doesn't represent that
     * a relationship exists.
     */
    if (this.target !== this.controller.nextElementSibling) {
      this.controller.setAttribute('aria-owns', this.target.id);
    }

    /**
     * Set the taget as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    this.target.setAttribute('aria-hidden', 'true');

    // Add event listeners
    this.controller.addEventListener('click', this.controllerClickHandler);
    this.controller.addEventListener('keydown', this.controllerKeyDownHandler);
    this.target.addEventListener('keydown', this.targetKeyDownHandler);
    document.body.addEventListener('click', this.hideOnOutsideClick);

    // Call the onInit callback.
    this.onInit.call(this);
  }

  /**
   * Act upon the new component state.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated({ expanded }) {
    this.controller.setAttribute('aria-expanded', `${expanded}`);
    this.target.setAttribute('aria-hidden', `${! expanded}`);

    this.onStateChange.call(this, this.state);
  }

  /**
   * Handle keydown events on the popup controller.
   *
   * @param {Object} event The event object.
   */
  controllerKeyDownHandler(event) {
    const { expanded } = this.state;

    if (expanded) {
      const { ESC, TAB } = keyCodes;
      const { keyCode } = event;

      if (ESC === keyCode) {
        event.preventDefault();

        /**
         * Close the popup when the Escape key is pressed. Because focus is not
         * inside the target (based on the fact that the event was fired on the
         * controller), there's no need to move focus.
         */
        this.hide();
      } else if (TAB === keyCode) {
        event.preventDefault();

        /**
         * When the Popup is open, pressing the TAB key should move focus to the
         * first interctive child of the target element. This would likely be
         * the default behavior in most cases, but this patches the behavior in
         * cases where the markup is disconnected or out-of-order.
         */
        this.firstChild.focus();
      }
    }
  }

  /**
   * Handle keydown events on the popup target.
   *
   * @param {Object} event The event object.
   */
  targetKeyDownHandler(event) {
    const { ESC, TAB } = keyCodes;
    const { keyCode, shiftKey } = event;
    const { expanded } = this.state;
    const { activeElement } = document;

    if (ESC === keyCode && expanded) {
      event.preventDefault();

      /**
       * Close the popup when the Escape key is pressed.
       */
      this.hide();

      /**
       * Because the activeElement is within the popup, move focus to the popup
       * controller to avoid the confusion of focus being within a hidden
       * element.
       */
      this.controller.focus();
    } else if (TAB === keyCode) {
      if (
        shiftKey
        && ([this.firstChild, this.target].includes(activeElement))
      ) {
        event.preventDefault();
        /**
         * Move focus back to the controller if the Shift key is pressed with
         * the Tab key, but only if the event target is the popup's first
         * interactive child or the popup itself.
         */
        this.controller.focus();
      } else if (this.lastChild === activeElement) {
        /**
         * Close the popup when tabbing from the last child.
         * @todo Is this correct behavior?
         */
        this.hide();
      }
    }
  }

  /**
   * Toggle the popup state.
   *
   * @param {Object} event The event object.
   */
  controllerClickHandler(event) {
    event.preventDefault();
    const { expanded } = this.state;

    this.setState({ expanded: ! expanded });
  }

  /**
   * Close the list if the Tab key is pressed if the last interactive child of
   * the popup is the event target.
   *
   * @param {Object} event The event object.
   */
  hideOnTabOut(event) {
    const { expanded } = this.state;
    const { TAB } = keyCodes;
    const { keyCode, shiftKey } = event;

    if (TAB === keyCode && ! shiftKey && expanded) {
      this.hide();
    }
  }

  /**
   * Close the popup when clicking anywhere outsideof the target or controller
   * elements.
   *
   * @param {Object} event The event object.
   */
  hideOnOutsideClick(event) {
    const { expanded } = this.state;
    const { target: clicked } = event;

    if (
      expanded
      && clicked !== this.controller
      && ! this.target.contains(clicked)
    ) {
      this.hide();
    }
  }

  /**
   * Remove all attributes and event listeners added by this class.
   */
  destroy() {
    // Remove the reference to the class instance.
    this.controller.popup = null;
    this.target.popup = null;

    // Remove controller attributes.
    this.controller.removeAttribute('aria-haspopup');
    this.controller.removeAttribute('aria-expanded');
    this.controller.removeAttribute('aria-controls');
    this.controller.removeAttribute('aria-owns');

    // Remove target attributes.
    this.target.removeAttribute('aria-hidden');

    // Remove event listeners.
    this.controller.removeEventListener('click', this.controllerClickHandler);
    this.controller.removeEventListener(
      'keydown',
      this.controllerKeyDownHandler
    );
    this.target.removeEventListener('keydown', this.targetKeyDownHandler);
    document.body.removeEventListener('click', this.hideOnOutsideClick);

    // Reset initial state.
    this.state.expanded = false;

    // Run the onDestroy callback.
    this.onDestroy.call(this);
  }

  /**
   * Show the target element.
   */
  show() {
    this.setState({ expanded: true });
  }

  /**
   * Hide the target element.
   */
  hide() {
    this.setState({ expanded: false });
  }
}
