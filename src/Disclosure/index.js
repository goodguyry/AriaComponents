import AriaComponent from '../AriaComponent';
import getElementPair from '../lib/getElementPair';
import interactiveChildren from '../lib/interactiveChildren';

/**
 * Class to set up a controller-target relationship for independently revealing
 * and hiding inline content.
 *
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export default class Disclosure extends AriaComponent {
  /**
   * Initial `loadOpen` option value.
   * @private
   *
   * @type {Boolean}
   */
  #optionLoadOpen = false;

  /**
   * Create a Disclosure.
   * @constructor
   *
   * @param {HTMLElement} element The component element.
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

    // Merge options with default values.
    const {
      loadOpen,
      allowOutsideClick,
      autoClose,
    } = {
      /**
       * Set the Disclosure open on load.
       *
       * @type {boolean}
       */
      loadOpen: this.#optionLoadOpen,

      /**
       * Keep the Disclosure open when the user interacts with external content.
       *
       * @type {boolean}
       */
      allowOutsideClick: true,

      /**
       * Automatically close the Disclosure after tabbing from its last child.
       *
       * @type {boolean}
       */
      autoClose: false,

      ...options,
    };

    // Save static options.
    this.#optionLoadOpen = loadOpen;

    // Set initial dynamic options.
    this.allowOutsideClick = allowOutsideClick;
    this.autoClose = autoClose;

    // Bind class methods.
    this.init = this.init.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);
    this.patchButtonKeydown = this.patchButtonKeydown.bind(this);
    this.closeOnEscKey = this.closeOnEscKey.bind(this);
    this.closeOnTabOut = this.closeOnTabOut.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);
    this.tabBackToController = this.tabBackToController.bind(this);
    this.tabtoTarget = this.tabtoTarget.bind(this);
    this.destroy = this.destroy.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);

    // Initial component state.
    this.state = { expanded: this.#optionLoadOpen };

    this.init();
  }

  /**
   * Enables the autoClose option.
   *
   * @param {bool} shouldAutoClose Whether the Disclosure should close automatically.
   */
  set autoClose(shouldAutoClose) {
    if (shouldAutoClose) {
      this.target.addEventListener('keydown', this.closeOnTabOut);
    } else {
      this.target.removeEventListener('keydown', this.closeOnTabOut);
    }
  }

  /**
   * Manages the allowOutsideClick option.
   *
   * @param {bool} shouldAllowOutsideClick Whether the Disclosure remain open
   *                                        when the user interacts with external content
   */
  set allowOutsideClick(shouldAllowOutsideClick) {
    if (shouldAllowOutsideClick) {
      document.body.removeEventListener('click', this.closeOnOutsideClick);
    } else {
      document.body.addEventListener('click', this.closeOnOutsideClick);
    }
  }

  /**
   * Add initial attributes and listen for events
   */
  init() {
    // Component state is initially set in the constructor.
    const { expanded } = this.state;

    /**
     * Collect the target element's interactive child elements.
     *
     * @type {array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Collect first and last interactive child elements from target.
    if (0 < this.interactiveChildElements.length) {
      const [
        firstInteractiveChild,
        lastInteractiveChild,
      ] = AriaComponent.getFirstAndLastItems(this.interactiveChildElements);

      this.firstInteractiveChild = firstInteractiveChild;
      this.lastInteractiveChild = lastInteractiveChild;
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

      // Ensure we can Tab to the controller even if it's not a button nor anchor.
      if ('A' !== this.controller.nodeName) {
        this.addAttribute(this.controller, 'tabindex', '0');
      }
    }

    /*
     * Establish a relationship when the DOM heirarchy doesn't represent that
     * a relationship exists.
     */
    if (this.target !== this.controller.nextElementSibling) {
      this.addAttribute(this.controller, 'aria-owns', this.target.id);

      this.controller.addEventListener('keydown', this.tabtoTarget);
      this.target.addEventListener('keydown', this.tabBackToController);
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
    this.controller.addEventListener('click', this.toggle);
    this.controller.addEventListener('keydown', this.closeOnEscKey);
    this.target.addEventListener('keydown', this.closeOnEscKey);

    /*
     * Prevent focus on interactive elements in the target when the target is
     * hidden. This isn't such an issue when the target is hidden with
     * `display:none`, but is necessary if the target is hidden by other means,
     * such as minimized height or width.
     */
    this.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));

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
    this.updateAttribute(this.target, 'aria-hidden', (! expanded));

    // Allow or deny keyboard focus depending on component state.
    if (expanded) {
      this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
    } else {
      this.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));
    }
  }

  /**
   * Treat the Spacebar and Return keys as clicks if the controller is not a <button>.
   *
   * @param {Event} event The event object.
   */
  patchButtonKeydown(event) {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      this.toggle();
    }
  }

  /**
   * Close the Disclosure when the Escape key is pressed.
   *
   * @param {Event} event The Event object.
   */
  closeOnEscKey(event) {
    if ('Escape' === event.key && this.state.expanded) {
      event.preventDefault();

      this.close();

      /*
       * Move focus to the Disclosure controller to avoid the confusion of focus
       * being within a hidden element.
       */
      if (event.target === this.target) {
        this.controller.focus();
      }
    }
  }

  /**
   * Close the Disclosure when tabbing forward from the last interactve child.
   *
   * @param {Event} event The event object.
   */
  closeOnTabOut(event) {
    if (
      'Tab' === event.key && ! event.shiftKey
      && this.lastInteractiveChild === document.activeElement
    ) {
      this.close();
    }
  }

  /**
   * Close the Disclosure when the user clicks outside of the target.
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
   * Move focus to the target's first interactive child in cases where the
   * markup is disconnected or out-of-order.
   *
   * @param {Event} event The Event object.
   */
  tabtoTarget(event) {
    const { expanded } = this.state;
    const { key, shiftKey } = event;

    if (
      expanded
      && ! shiftKey
      && 'Tab' === key
    ) {
      event.preventDefault();

      this.firstInteractiveChild.focus();
    }
  }

  /**
   * Move focus back to the controller from the target's first interactive child
   * in cases where the markup is disconnected or out-of-order.
   *
   * @param {Event} event The Event object.
   */
  tabBackToController(event) {
    const { key, shiftKey } = event;
    const { activeElement } = document;

    if (
      this.firstInteractiveChild === activeElement
      && shiftKey
      && 'Tab' === key
    ) {
      event.preventDefault();

      this.controller.focus();
    }
  }

  /**
   * Remove all ARIA attributes and event listeners added by this class.
   */
  destroy() {
    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove tabindex attributes.
    this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggle);
    this.controller.removeEventListener('keydown', this.patchButtonKeydown);
    document.body.removeEventListener('click', this.closeOnOutsideClick);
    this.controller.removeEventListener('keydown', this.closeOnEscKey);
    this.target.removeEventListener('keydown', this.closeOnEscKey);

    // Reset initial state.
    this.state = { expanded: this.#optionLoadOpen };

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

  /**
   * Toggle the Disclosure expanded state.
   */
  toggle() {
    this.setState({ expanded: ! this.state.expanded });
  }
}
