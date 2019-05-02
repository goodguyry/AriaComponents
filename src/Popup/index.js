import AriaComponent from '../AriaComponent';
import keyCodes from '../lib/keyCodes';
import interactiveChildren from '../lib/interactiveChildren';

/**
 * Sets up a controller-target relationship with appropriate aria-attributes and event handling.
 *
 * @param {Object} config {
 *   And object denoting the Popup's controller and target elements
 *
 *   @type {HTMLElement} controller The controlling element.
 *   @type {HTMLElement} target     The target popup element.
 * }
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
     * Options shape.
     * @type {Object}
     */
    const options = {
      controller: null,
      target: null,
      type: 'true', // 'true' === 'menu' in UAs that don't support WAI-ARIA 1.1
    };

    // Save references to the controller and target.
    Object.assign(this, options, config);

    // Intial state.
    this.state.expanded = false;

    // Bind class methods.
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.controllerKeyDownHandler = this.controllerKeyDownHandler.bind(this);
    this.targetKeyDownHandler = this.targetKeyDownHandler.bind(this);
    this.closeOnTabOut = this.closeOnTabOut.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);

    // Conditionally initialize.
    if (null !== this.controller && null !== this.target) {
      this.init();
    }
  }

  /**
   * Add initial attributes, establish relationships, and listen for events
   */
  init() {
    /**
     * The target element's interactive child elements.
     * @type {Array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Collect first and last interactive child elements from target.
    if (0 < this.interactiveChildElements.length) {
      const [firstChild] = this.interactiveChildElements;
      this.firstChild = firstChild;
      this.lastChild = (
        this.interactiveChildElements[this.interactiveChildElements.length - 1]
      );
    }

    // Add a reference to the class instance
    super.setSelfReference([this.controller, this.target]);

    // Add controller attributes
    this.controller.setAttribute('aria-haspopup', this.type);
    this.controller.setAttribute('aria-expanded', 'false');
    this.controller.setAttribute('aria-controls', this.target.id);

    // If the markup is disconnected, establish a relationship.
    if (this.target !== this.controller.nextElementSibling) {
      this.controller.setAttribute('aria-owns', this.target.id);
    }

    // Add target attributes
    this.target.setAttribute('aria-hidden', 'true');

    // Add event listeners
    this.controller.addEventListener('click', this.toggleState);
    this.controller.addEventListener('keydown', this.controllerKeyDownHandler);
    this.target.addEventListener('keydown', this.targetKeyDownHandler);
    document.body.addEventListener('click', this.closeOnOutsideClick);
  }

  /**
   * Expand or collapse the popup
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated({ expanded }) {
    this.controller.setAttribute('aria-expanded', `${expanded}`);
    this.target.setAttribute('aria-hidden', `${! expanded}`);
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
        // Close the popup.
        event.stopPropagation();
        event.preventDefault();

        this.setState({ expanded: false });
      } else if (TAB === keyCode) {
        // Move to the first interactive child.
        event.preventDefault();

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
      // Close the popup.
      event.stopPropagation();
      event.preventDefault();

      this.setState({ expanded: false });
      this.controller.focus();
    } else if (TAB === keyCode) {
      if (
        shiftKey
        && (this.firstChild === activeElement || this.target === activeElement)
      ) {
        // Tab back from the first interactive child to the controller.
        event.preventDefault();
        this.controller.focus();
      } else if (this.lastChild === activeElement) {
        // Close the popup when tabbing from the last child.
        // TODO: Is this correct behavior?
        this.setState({ expanded: false });
      }
    }
  }

  /**
   * Toggle the popup state.
   *
   * @param {Object} event The event object.
   */
  toggleState(event) {
    event.preventDefault();
    const { expanded } = this.state;

    this.setState({ expanded: ! expanded });
  }

  /**
   * Tab from the last item and close the menu.
   *
   * @param {Object} event The event object.
   */
  closeOnTabOut(event) {
    const { expanded } = this.state;
    const { TAB } = keyCodes;
    const { keyCode, shiftKey } = event;

    if (TAB === keyCode && ! shiftKey && expanded) {
      this.setState({ expanded: false });
    }
  }

  /**
   * Close the popup when clicking anywhere outside.
   *
   * @param  {Object} event The event object.
   */
  closeOnOutsideClick(event) {
    const { expanded } = this.state;
    const { target: clicked } = event;

    if (
      expanded
      && clicked !== this.controller
      && ! this.target.contains(clicked)
    ) {
      this.setState({ expanded: false });
    }
  }

  /**
   * Remove all ARIA attributes added by this class.
   */
  destroy() {
    // Add a reference to the class instance
    this.controller.popup = null;
    this.target.popup = null;

    // Remove controller attributes
    this.controller.removeAttribute('aria-haspopup');
    this.controller.removeAttribute('aria-expanded');
    this.controller.removeAttribute('aria-controls');

    if (this.target !== this.controller.nextElementSibling) {
      this.controller.removeAttribute('aria-owns');
    }

    // Remove target attributes
    this.target.removeAttribute('aria-hidden');

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggleState);
    this.controller.removeEventListener(
      'keydown',
      this.controllerKeyDownHandler
    );
    this.target.removeEventListener('keydown', this.targetKeyDownHandler);
    document.body.removeEventListener('click', this.closeOnOutsideClick);

    // Reset initial state.
    this.state = {
      expanded: false,
    };
  }
}
