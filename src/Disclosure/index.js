import AriaComponent from '../AriaComponent';
import keyCodes from '../lib/keyCodes';
import interactiveChildren from '../lib/interactiveChildren';
import { tabIndexDeny, tabIndexAllow } from '../lib/rovingTabIndex';
import { setUniqueId } from '../lib/uniqueId';

/**
 * Class to set up a controller-target relationship for independently revealing
 * and hiding inline content.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
 */
export default class Disclosure extends AriaComponent {
  /**
   * Create a Disclosure.
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
    this.componentName = 'Disclosure';

    /**
     * Options shape.
     *
     * @type {object}
     */
    const options = {
      /**
       * The element used to trigger the Disclosure Popup.
       *
       * @type {HTMLElement}
       */
      controller: null,

      /**
       * The Disclosure element.
       *
       * @type {HTMLElement}
       */
      target: null,

      /**
       * Load the Disclosure open by default.
       *
       * @type {boolean}
       */
      loadOpen: false,

      /**
       * Keep the Disclosure open when the user clicks outside of it.
       *
       * @type {boolean}
       */
      allowOutsideClick: true,

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

    // Merge config options with defaults and save all as instance properties.
    Object.assign(this, options, config);

    // Initial component state.
    this.state = { expanded: this.loadOpen };

    // Bind class methods.
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleControllerKeydown = this.handleControllerKeydown.bind(this);
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);

    // Check for a valid controller and target before initializing.
    if (null !== this.controller && null !== this.target) {
      this.init();
    }
  }

  /**
   * Add initial attributes, establish relationships, and listen for events
   */
  init() {
    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.controller, this.target]);

    // Component state is initially set in the constructor.
    const { expanded } = this.state;

    /**
     * Collect the target element's interactive child elements.
     * @type {array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Ensure the target and controller each have an ID attribute.
    [this.controller, this.target].forEach((element) => {
      setUniqueId(element);
    });

    // Add controller attributes
    this.controller.setAttribute('aria-expanded', `${expanded}`);
    this.controller.setAttribute('aria-controls', this.target.id);

    // Patch button role and behavior for non-button controller.
    if ('BUTTON' !== this.controller.nodeName) {
      /*
       * Some elements semantics conflict with the button role. You really
       * should just use a button.
       */
      this.controller.setAttribute('role', 'button');

      // Ensure we can TAB to the controller if it's not a button or anchor.
      if (
        'A' !== this.controller.nodeName
        && null === this.controller.getAttribute('tabindex')
      ) {
        this.controller.setAttribute('tabindex', '0');
      }
    }

    /*
     * Establishes a relationship when the DOM heirarchy doesn't represent that
     * a relationship exists.
     */
    if (this.target !== this.controller.nextElementSibling) {
      this.controller.setAttribute('aria-owns', this.target.id);
    }

    /*
     * Set the taget as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    if (! expanded) {
      this.target.setAttribute('aria-hidden', 'true');
    }

    // Add event listeners
    this.controller.addEventListener('click', this.toggleExpandedState);
    this.controller.addEventListener('keydown', this.handleControllerKeydown);
    if (! this.allowOutsideClick) {
      document.body.addEventListener('click', this.closeOnOutsideClick);
    }

    /*
     * Prevent focus on interactive elements in the target when the target is
     * hidden. This isn't such an issue when the target is hidden with
     * `display:none`, but is necessary if the target is hidden by other means,
     * such as minimized height or width.
     */
    tabIndexDeny(this.interactiveChildElements);

    // Run {initCallback}
    this.onInit.call(this);
  }

  /**
   * Update the component attributes based on updated state.
   *
   * @param {object} state The component state.
   * @param {boolean} state.expanded The expected `expanded` state.
   */
  stateWasUpdated() {
    const { expanded } = this.state;

    this.controller.setAttribute('aria-expanded', `${expanded}`);

    /*
     * https://developer.paciellogroup.com/blog/2016/01/the-state-of-hidden-content-support-in-2016/
     *
     * > In some browser and screen reader combinations aria-hidden=false on an
     *   element that is hidden using the hidden attribute or CSS display:none
     *   results in the content being unhidden.
     */
    if (expanded) {
      this.target.setAttribute('aria-hidden', 'false');
    } else {
      this.target.setAttribute('aria-hidden', 'true');
    }

    // Allow or deny keyboard focus depending on component state.
    if (expanded) {
      tabIndexAllow(this.interactiveChildElements);
    } else {
      tabIndexDeny(this.interactiveChildElements);
    }

    // Run {stateChangeCallback}
    this.onStateChange.call(this, this.state);
  }

  /**
   * Handle keydown events on the Disclosure controller.
   *
   * @param {Event} event The event object.
   */
  handleControllerKeydown(event) {
    const { SPACE, RETURN } = keyCodes;
    const { keyCode } = event;

    if ([SPACE, RETURN].includes(keyCode)) {
      /*
       * Treat the Spacebar and Return keys as clicks in case the controller is
       * not a <button>.
       */
      this.toggleExpandedState(event);
    }
  }

  /**
   * Toggle the expanded state.
   *
   * @param {Event} event The Event object.
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
   * @param {Event} event The Event object.
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
    // Remove the references to the class instance.
    this.deleteSelfReferences();

    // Remove controller attributes.
    this.controller.removeAttribute('aria-expanded');
    this.controller.removeAttribute('aria-controls');
    this.controller.removeAttribute('aria-owns');
    this.controller.removeAttribute('tabindex');

    // Remove target attributes.
    this.target.removeAttribute('aria-hidden');

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggleExpandedState);
    document.body.removeEventListener('click', this.closeOnOutsideClick);

    // Reset initial state.
    this.state = { expanded: this.loadOpen };

    // Run {destroyCallback}
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
