import interactiveChildren from '../lib/interactiveChildren';
import uniqueId from '../lib/uniqueId';

/**
 * Sets up a controller-target relationship with appropriate aria-attributes and event handling.
 *
 * @param {Object} config {
 *   And object denoting the Disclosure's configuration.
 *
 *   @type {HTMLElement} controller               The Disclosure's controlling element.
 *   @type {HTMLElement} target                   The Disclosure's target element.
 *   @type {Boolean}     [loadOpen=false]         To load the Disclosure open.
 *   @type {Boolean}     [allowOutsideClick=true] Keep the Disclosure open on outside clicks.
 *   @type {Function}    onOpen                   Function to be run after the Disclosure is opened.
 *   @type {Function}    onClose                  Function to be run after the Disclosure is closed.
 * }
 */
export default class Disclosure {
  /**
   * Start the component
   */
  constructor(config) {
    /**
     * Default config options.
     * @type {Object}
     */
    const options = {
      controller: null,
      target: null,
      loadOpen: false,
      allowOutsideClick: true,
      onOpen: () => {},
      onClose: () => {},
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    // Initial state.
    this.state = {
      expanded: this.loadOpen,
    };

    /**
     * The target element's interactive child elements.
     * @type {Array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Bind class methods.
    this.setup = this.setup.bind(this);
    this.destroy = this.destroy.bind(this);
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
    this.setExpandedState = this.setExpandedState.bind(this);
    this.rovingTabIndex = this.rovingTabIndex.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);

    this.setup();
    this.rovingTabIndex(false);
  }

  /**
   * Expand or collapse the disclosure
   *
   * @param {Boolean} expand The expected `expanded` state.
   */
  setExpandedState(expand) {
    this.controller.setAttribute('aria-expanded', `${expand}`);
    this.target.setAttribute('aria-hidden', `${! expand}`);

    this.rovingTabIndex(expand);

    this.state.expanded = expand;

    if (expand) {
      this.onOpen.call(this);
    } else {
      this.onClose.call(this);
    }
  }

  /**
   * Return the class name for referencing and identifying instances.
   *
   * @return {String}
   */
  static getClassName() {
    return 'popup';
  }

  /**
   * Add initial attributes, establish relationships, and listen for events
   */
  setup() {
    const { expanded } = this.state;

    // Ensure the target and controller each have an ID attribute.
    [this.controller, this.target].forEach((element) => {
      if ('' === element.id) {
        element.setAttribute('id', uniqueId());
      }
    });

    // Add a reference to the class instance
    this.controller.disclosure = this;
    this.target.disclosure = this;

    // Add controller attributes
    this.controller.setAttribute('aria-expanded', `${expanded}`);
    this.controller.setAttribute('aria-controls', this.target.id);

    // If the markup is disconnected, establish a relationship.
    if (this.target !== this.controller.nextElementSibling) {
      this.controller.setAttribute('aria-owns', this.target.id);
    }

    // Add target attributes
    this.target.setAttribute('aria-hidden', `${! expanded}`);

    // Add event listeners
    this.controller.addEventListener('click', this.toggleExpandedState);

    if (! this.allowOutsideClick) {
      document.body.addEventListener('click', this.closeOnOutsideClick);
    }
  }

  /**
   * Remove all ARIA attributes added by this class.
   */
  destroy() {
    // Add a reference to the class instance.
    this.controller.disclosure = null;
    this.target.disclosure = null;

    // Remove controller attributes.
    this.controller.removeAttribute('aria-expanded');
    this.controller.removeAttribute('aria-controls');
    this.controller.removeAttribute('aria-owns');

    // Remove target attributes.
    this.target.removeAttribute('aria-hidden');

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggleExpandedState);
    document.body.removeEventListener('click', this.closeOnOutsideClick);

    // Reset initial state.
    this.state = {
      expanded: this.loadOpen,
    };
  }

  /**
   * Toggle the expanded state.
   *
   * @param {Object} event The event object.
   */
  toggleExpandedState(event) {
    event.preventDefault();

    if (this.state.expanded) {
      this.setExpandedState(false);
    } else {
      this.setExpandedState(true);
    }
  }

  /**
   * Close the disclosure when the user clicks outside of the target.
   *
   * @param {Object} event The event object.
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

  /**
   * Prevent focus on interactive elements in the target when the target is hidden.
   *
   * This isn't much of an issue if the element is visually hidden with
   * `display:none`, but becomes an issue if the target is collapsed by
   * other means, like reducing one of its dimensions.
   *
   * @param {Boolean} allow Whether or not to allow focus on children of this.target.
   */
  rovingTabIndex(allow) {
    this.interactiveChildElements.forEach((child) => {
      if (allow) {
        child.removeAttribute('tabindex');
      } else {
        child.setAttribute('tabindex', '-1');
      }
    });
  }
}
