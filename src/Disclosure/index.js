import AriaComponent from '../AriaComponent';
import getElementPair from '../lib/getElementPair';
import keyCodes from '../lib/keyCodes';
import interactiveChildren from '../lib/interactiveChildren';
import { tabIndexDeny, tabIndexAllow } from '../lib/rovingTabIndex';
import getFirstAndLastItems from '../lib/getFirstAndLastItems';

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
   * @param {HTMLElement} element The activating element.
   * @param {object}      options The options object.
   */
  constructor(element, options = {}) {
    super(element);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Disclosure';

    // Get the component elements.
    const { controller, target } = getElementPair(element);
    this.controller = controller;
    this.target = target;

    // Merge options.
    const {
      loadOpen,
      allowOutsideClick,
      autoClose,
    } = {
      loadOpen: false,
      allowOutsideClick: true,
      autoClose: false,

      ...options,
    };

    /**
     * Load the Disclosure open by default.
     *
     * @type {boolean}
     */
    this.loadOpen = loadOpen;

    /**
     * Keep the Disclosure open when the user clicks outside of it.
     *
     * @type {boolean}
     */
    this.allowOutsideClick = allowOutsideClick;

    /**
     * Automatically close the Disclosure when its contents lose focus.
     *
     * @type {boolean}
     */
    this.autoClose = autoClose;

    // Initial component state.
    this.state = { expanded: this.loadOpen };

    // Bind class methods.
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.patchButtonKeydown = this.patchButtonKeydown.bind(this);
    this.closeOnEscKey = this.closeOnEscKey.bind(this);
    this.handleTargetKeydown = this.handleTargetKeydown.bind(this);
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
     * Add a reference to the class instance to enable external interactions
     * with this instance.
     */
    super.setSelfReference(this.controller, this.target);

    // Component state is initially set in the constructor.
    const { expanded } = this.state;

    /**
     * Collect the target element's interactive child elements.
     * @type {array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    /*
     * Collect first and last interactive child elements from target and merge
     * them in as instance properties.
     */
    if (0 < this.interactiveChildElements.length) {
      const [
        firstInteractiveChild,
        lastInteractiveChild,
      ] = getFirstAndLastItems(this.interactiveChildElements);

      Object.assign(this, { firstInteractiveChild, lastInteractiveChild });
    }

    // Add controller attributes
    this.addAttribute(this.controller, 'aria-expanded', expanded);

    // Patch button role and behavior for non-button controller.
    if ('BUTTON' !== this.controller.nodeName) {
      /*
       * Some elements semantics conflict with the button role. You really
       * should just use a button.
       */
      this.addAttribute(this.controller, 'role', 'button');
      this.controller.addEventListener('keydown', this.patchButtonKeydown);

      // Ensure we can TAB to the controller if it's not a button nor anchor.
      if ('A' !== this.controller.nodeName) {
        this.addAttribute(this.controller, 'tabindex', '0');
      }
    }

    /*
     * Establishes a relationship when the DOM heirarchy doesn't represent that
     * a relationship exists.
     */
    if (this.target !== this.controller.nextElementSibling) {
      this.addAttribute(this.controller, 'aria-owns', this.target.id);
    }

    /*
     * Set the taget as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    if (! expanded) {
      this.addAttribute(this.target, 'aria-hidden', 'true');
    }

    // Add event listeners
    this.controller.addEventListener('click', this.toggleExpandedState);
    this.controller.addEventListener('keydown', this.closeOnEscKey);
    this.target.addEventListener('keydown', this.closeOnEscKey);

    if (this.autoClose) {
      this.target.addEventListener('keydown', this.handleTargetKeydown);
    }

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
    this.dispatchEventInit();
  }

  /**
   * Update the component attributes based on updated state.
   *
   * @param {object} state The component state.
   * @param {boolean} state.expanded The expected `expanded` state.
   */
  stateWasUpdated() {
    const { expanded } = this.state;

    this.updateAttribute(this.controller, 'aria-expanded', expanded);

    /*
     * https://developer.paciellogroup.com/blog/2016/01/the-state-of-hidden-content-support-in-2016/
     *
     * > In some browser and screen reader combinations aria-hidden=false on an
     *   element that is hidden using the hidden attribute or CSS display:none
     *   results in the content being unhidden.
     */
    if (expanded) {
      this.updateAttribute(this.target, 'aria-hidden', 'false');
    } else {
      this.updateAttribute(this.target, 'aria-hidden', 'true');
    }

    // Allow or deny keyboard focus depending on component state.
    if (expanded) {
      tabIndexAllow(this.interactiveChildElements);
    } else {
      tabIndexDeny(this.interactiveChildElements);
    }
  }

  /**
   * Close the Disclosure when the Escape key is pressed.
   *
   * @param {Event} event The Event object.
   */
  closeOnEscKey(event) {
    const { ESC } = keyCodes;
    const { keyCode, target } = event;
    const { expanded } = this.state;

    if (ESC === keyCode && expanded) {
      event.preventDefault();

      this.close();

      /*
       * Move focus to the Disclosure controller to avoid the confusion of focus
       * being within a hidden element.
       */
      if (target === this.target) {
        this.controller.focus();
      }
    }
  }

  /**
   * Handle keydown events on the Disclosure controller.
   *
   * @param {Event} event The event object.
   */
  patchButtonKeydown(event) {
    const { SPACE, RETURN } = keyCodes;
    const { keyCode } = event;

    if ([SPACE, RETURN].includes(keyCode)) {
      /*
       * Treat the Spacebar and Return keys as clicks if the controller is not a <button>.
       */
      this.toggleExpandedState(event);
    }
  }

  /**
   * Handle keydown events on the Disclosure target.
   *
   * @param {Event} event The event object.
   */
  handleTargetKeydown(event) {
    const { TAB } = keyCodes;
    const { keyCode, shiftKey } = event;
    const { activeElement } = document;

    if (
      TAB === keyCode
      && ! shiftKey
      && this.lastInteractiveChild === activeElement
    ) {
      /*
       * Close the Disclosure when tabbing forward from the last interactve child.
       */
      this.close();
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

    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove tabindex attributes.
    tabIndexAllow(this.interactiveChildElements);

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggleExpandedState);
    this.controller.removeEventListener('keydown', this.patchButtonKeydown);
    document.body.removeEventListener('click', this.closeOnOutsideClick);
    this.controller.removeEventListener('keydown', this.closeOnEscKey);
    this.target.removeEventListener('keydown', this.closeOnEscKey);

    // Reset initial state.
    this.state = { expanded: this.loadOpen };

    // Fire the destroy event.
    this.dispatchEventDestroy();
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
