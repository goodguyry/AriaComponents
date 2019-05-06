import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import { tabIndexDeny, tabIndexAllow } from '../lib/rovingTabIndex';
import { setUniqueId } from '../lib/uniqueId';

/**
 * Disclosure class.
 * Sets up a controller-target relationship for independently revealing and
 * hiding content.
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
      /**
       * The element used to trigger the dialog popup.
       * @type {HTMLElement}
       */
      controller: null,
      /**
       * The dialog element.
       * @type {HTMLElement}
       */
      target: null,
      /**
       * Load the Disclosure open by default.
       * @type {Boolean}
       */
      loadOpen: false,
      /**
       * Keep the Disclosure open when the user clicks outside of it.
       * @type {Boolean}
       */
      allowOutsideClick: true,
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
       * @return {Function}
       */
      onDestroy: () => {},
    };

    // Merge config options with defaults and save all as instance properties.
    Object.assign(this, options, config);

    // Initial component state.
    this.state.expanded = this.loadOpen;

    // Bind class methods.
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);

    // Check for a valid controller and target before initializing.
    if (null !== this.controller && null !== this.target) {
      this.init();
    }
  }

  /**
   * Add initial attributes, establish relationships, and listen for events
   */
  init() {
    // Component state is initially set in the constructor.
    const { expanded } = this.state;

    /**
     * Collect the target element's interactive child elements.
     * @type {Array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Ensure the target and controller each have an ID attribute.
    [this.controller, this.target].forEach((element) => {
      setUniqueId(element);
    });

    /**
     * Add a reference to the class instance to enable external interactions
     * with this instance.
     */
    this.setSelfReference([this.controller, this.target]);

    // Add controller attributes
    this.controller.setAttribute('aria-expanded', `${expanded}`);
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
    this.target.setAttribute('aria-hidden', `${! expanded}`);

    // Add event listeners
    this.controller.addEventListener('click', this.toggleExpandedState);
    if (! this.allowOutsideClick) {
      document.body.addEventListener('click', this.closeOnOutsideClick);
    }

    /**
     * Prevent focus on interactive elements in the target when the target is
     * hidden. This isn't such an issue when the target is hidden with
     * `display:none`, but is necessary if the target is hidden by other means,
     * such as minimized height or width.
     */
    tabIndexDeny(this.interactiveChildElements);

    // Call the onInit callback.
    this.onInit.call(this);
  }

  /**
   * Update the component attributes based on updated state.
   *
   * @param {Boolean} expand The expected `expanded` state.
   */
  stateWasUpdated({ expanded }) {
    this.controller.setAttribute('aria-expanded', `${expanded}`);
    this.target.setAttribute('aria-hidden', `${! expanded}`);

    // Allow or deny keyboard focus depending on component state.
    if (expanded) {
      tabIndexAllow(this.interactiveChildElements);
    } else {
      tabIndexDeny(this.interactiveChildElements);
    }

    // Call the onStateChange callback.
    this.onStateChange.call(this, this.state);
  }

  /**
   * Toggle the expanded state.
   *
   * @param {Event}
   */
  toggleExpandedState(event) {
    event.preventDefault();

    if (this.state.expanded) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Close the disclosure when the user clicks outside of the target.
   *
   * @param {Event}
   */
  closeOnOutsideClick(event) {
    if (
      this.state.expanded
      && event.target !== this.controller
      && ! this.target.contains(event.target)
    ) {
      this.close();
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
    this.state.expanded = this.loadOpen;

    // Call the onDestroy callback.
    this.onDestroy.call(this);
  }

  /**
   * Update component state to open the Disclosure.
   */
  open() {
    this.setState({ expanded: true });
  }

  /**
   * Update component state to close the Disclosure.
   */
  close() {
    this.setState({ expanded: false });
  }
}
