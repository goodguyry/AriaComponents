import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import rovingTabIndex from '../lib/rovingTabIndex';
import { setUniqueId } from '../lib/uniqueId';

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
 * }
 */
export default class Disclosure extends AriaComponent {
  /**
   * Start the component
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     * @type {String}
     */
    this.componentName = 'disclosure';

    /**
     * Options shape.
     * @type {Object}
     */
    const options = {
      controller: null,
      target: null,
      loadOpen: false,
      allowOutsideClick: true,
      onStateChange: () => {},
      onInit: () => {},
      onDestroy: () => {},
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    // Initial state.
    this.state.expanded = this.loadOpen;

    // Bind class methods.
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);

    this.init();
  }

  /**
   * Add initial attributes, establish relationships, and listen for events
   */
  init() {
    const { expanded } = this.state;

    /**
     * The target element's interactive child elements.
     * @type {Array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Ensure the target and controller each have an ID attribute.
    [this.controller, this.target].forEach((element) => {
      setUniqueId(element);
    });

    // Add a reference to the class instance
    this.setSelfReference([this.controller, this.target]);

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

    // Prevent focus on interactive elements in the target when the target is hidden.
    rovingTabIndex(this.interactiveChildElements);

    this.onInit.call(this);
  }

  /**
   * Expand or collapse the disclosure
   *
   * @param {Boolean} expand The expected `expanded` state.
   */
  stateWasUpdated({ expanded }) {
    this.controller.setAttribute('aria-expanded', `${expanded}`);
    this.target.setAttribute('aria-hidden', `${! expanded}`);

    if (expanded) {
      rovingTabIndex(
        this.interactiveChildElements,
        this.interactiveChildElements
      );
    } else {
      rovingTabIndex(this.interactiveChildElements);
    }

    this.onStateChange.call(this);
  }

  /**
   * Toggle the expanded state.
   *
   * @param {Object} event The event object.
   */
  toggleExpandedState(event) {
    event.preventDefault();

    if (this.state.expanded) {
      this.setState({ expanded: false });
    } else {
      this.setState({ expanded: true });
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
      this.setState({ expanded: false });
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

    this.onDestroy.call(this);
  }
}
