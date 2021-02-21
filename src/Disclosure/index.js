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
   * @param {HTMLElement} controller The activating element.
   * @param {object}      options    The options object.
   */
  constructor(controller, options = {}) {
    super(controller);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Disclosure';

    this.controller = controller;
    this.target = super.constructor.getTargetElement(controller);

    /**
     * Options shape.
     *
     * @type {object}
     */
    const defaultOptions = {
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
    };

    // Merge remaining options with defaults and save all as instance properties.
    Object.assign(this, defaultOptions, options);

    // Initial component state.
    this.state = { expanded: this.loadOpen };

    // Bind class methods.
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.controllerHandleKeydown = this.controllerHandleKeydown.bind(this);
    this.toggleExpandedState = this.toggleExpandedState.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);

    this.init();
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
      this.target.setAttribute('hidden', '');
    }

    // Add event listeners
    this.controller.addEventListener('click', this.toggleExpandedState);
    this.controller.addEventListener('keydown', this.controllerHandleKeydown);
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

    // Fire the init event.
    if (! this._suppressDispatch.includes('init')) {
      this.dispatch('init', { instance: this });
    }
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
      this.target.removeAttribute('hidden');
    } else {
      this.target.setAttribute('aria-hidden', 'true');
      this.target.setAttribute('hidden', '');
    }

    // Allow or deny keyboard focus depending on component state.
    if (expanded) {
      tabIndexAllow(this.interactiveChildElements);
    } else {
      tabIndexDeny(this.interactiveChildElements);
    }
  }

  /**
   * Handle keydown events on the Disclosure controller.
   *
   * @param {Event} event The event object.
   */
  controllerHandleKeydown(event) {
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

    // Remove IDs set by this class.
    [this.controller, this.target].forEach((element) => {
      if (element.getAttribute('id').includes('id_')) {
        element.removeAttribute('id');
      }
    });

    // Remove controller attributes.
    this.controller.removeAttribute('aria-expanded');
    this.controller.removeAttribute('aria-controls');
    this.controller.removeAttribute('aria-owns');
    this.controller.removeAttribute('tabindex');

    if ('BUTTON' !== this.controller.nodeName) {
      this.controller.removeAttribute('role');
    }

    // Remove target attributes.
    this.target.removeAttribute('aria-hidden');
    this.target.removeAttribute('hidden');

    // Remove tabindex attributes.
    tabIndexAllow(this.interactiveChildElements);

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggleExpandedState);
    this.controller.removeEventListener(
      'keydown',
      this.controllerHandleKeydown
    );
    document.body.removeEventListener('click', this.closeOnOutsideClick);

    // Reset initial state.
    this.state = { expanded: this.loadOpen };

    // Fire the destroy event.
    if (! this._suppressDispatch.includes('destroy')) {
      this.dispatch('destroy', { element: this.element });
    }
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
