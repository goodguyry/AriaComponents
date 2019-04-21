import keyCodes from './lib/keyCodes';
import interactiveChildren from './lib/interactiveChildren';

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
export default class Popup {
  /**
   * Start the component
   */
  constructor(config) {
    // Save references to the controller and target.
    Object.assign(this, config);

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

    // Intial state.
    this.state = {
      expanded: false,
    };

    // Bind class methods.
    this.setup = this.setup.bind(this);
    this.destroy = this.destroy.bind(this);
    this.manageExpandedState = this.manageExpandedState.bind(this);
    this.setExpandedState = this.setExpandedState.bind(this);
    this.controllerKeyDownHandler = this.controllerKeyDownHandler.bind(this);
    this.targetKeyDownHandler = this.targetKeyDownHandler.bind(this);
    this.closeOnTabOut = this.closeOnTabOut.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);

    this.setup();
  }

  /**
   * Expand or collapse the popup
   *
   * @param {Boolean} expand The expected `expanded` state.
   */
  setExpandedState(expand) {
    this.controller.setAttribute('aria-expanded', `${expand}`);
    this.target.setAttribute('aria-hidden', `${! expand}`);

    this.state.expanded = expand;
  }

  /**
   * Add initial attributes, establish relationships, and listen for events
   */
  setup() {
    const { expanded } = this.state;

    // Add a reference to the class instance
    this.controller.popup = this;
    this.target.popup = this;

    // Add controller attributes
    this.controller.setAttribute('aria-haspopup', 'menu');
    this.controller.setAttribute('aria-expanded', `${expanded}`);
    this.controller.setAttribute('aria-controls', this.target.id);

    // If the markup is disconnected, establish a relationship.
    if (this.target !== this.controller.nextElementSibling) {
      this.controller.setAttribute('aria-owns', this.target.id);
    }

    // Add target attributes
    this.target.setAttribute('aria-hidden', `${! expanded}`);

    // Add event listeners
    this.controller.addEventListener('click', this.manageExpandedState);
    this.controller.addEventListener('keydown', this.controllerKeyDownHandler);
    this.target.addEventListener('keydown', this.targetKeyDownHandler);
    document.body.addEventListener('click', this.closeOnOutsideClick);
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
    this.controller.removeEventListener('click', this.manageExpandedState);
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

        this.setExpandedState(false);
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
    const { keyCode } = event;
    const { expanded } = this.state;
    const { activeElement } = document;

    if (ESC === keyCode && expanded) {
      // Close the popup.
      event.stopPropagation();
      event.preventDefault();

      this.setExpandedState(false);
      this.controller.focus();
    } else if (TAB === keyCode) {
      if (
        event.shiftKey
        && (this.firstChild === activeElement || this.target === activeElement)
      ) {
        // Tab back from the first interactive child to the controller.
        event.preventDefault();
        this.controller.focus();
      } else if (this.lastChild === activeElement) {
        // Close the popup when tabbing from the last child.
        // TODO: Is this correct behavior?
        this.setExpandedState(false);
      }
    }
  }

  /**
   * Manage the popup state.
   *
   * @param {Object} event The event object.
   */
  manageExpandedState(event) {
    event.preventDefault();

    if (this.state.expanded) {
      this.setExpandedState(false);
    } else {
      this.setExpandedState(true);
    }
  }

  /**
   * Tab from the last item and close the menu.
   *
   * @param {Object} event The event object.
   */
  closeOnTabOut(event) {
    const { TAB } = keyCodes;

    if (TAB === event.keyCode && ! event.shiftKey && this.state.expanded) {
      this.setExpandedState(false);
    }
  }

  /**
   * Close the popup when clicking anywhere outside.
   *
   * @param  {Object} event The event object.
   */
  closeOnOutsideClick(event) {
    if (
      this.state.expanded
      && event.target !== this.controller
      && ! this.target.contains(event.target)
    ) {
      this.setExpandedState(false);
    }
  }
}
