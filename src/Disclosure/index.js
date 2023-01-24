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
   * Initial expanded state.
   * @private
   *
   * @type {Boolean}
   */
  #expanded = false;

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
    super(element, options);

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
    this.closeOnEscKey = this.closeOnEscKey.bind(this);
    this.closeOnTabOut = this.closeOnTabOut.bind(this);
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);
    this.destroy = this.destroy.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);

    // Update component state directly.
    this.#expanded = this.#optionLoadOpen;

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
   * Set expanded state and update attributes.
   *
   * @param {Object} state The component state.
   */
  set expanded(newState) {
    // Update state.
    this.#expanded = newState;

    this.updateAttribute(this.controller, 'aria-expanded', this.expanded);
    this.updateAttribute(this.target, 'aria-hidden', (! this.expanded));

    this.dispatch(
      'stateChange',
      {
        instance: this,
        expanded: this.expanded,
      }
    );
  }

  /**
   * Get expanded state.
   *
   * @return {bool}
   */
  get expanded() {
    return this.#expanded;
  }

  /**
   * Add initial attributes and listen for events
   */
  init() {
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
    this.addAttribute(this.controller, 'aria-expanded', this.expanded);

    /*
     * Set the taget as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    if (! this.expanded) {
      this.addAttribute(this.target, 'aria-hidden', 'true');
    }

    // Add event listeners
    this.controller.addEventListener('click', this.toggle);
    this.controller.addEventListener('keydown', this.closeOnEscKey);
    this.target.addEventListener('keydown', this.closeOnEscKey);

    // Install extensions.
    this.initExtensions();

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Close the Disclosure when the Escape key is pressed.
   *
   * @param {Event} event The Event object.
   */
  closeOnEscKey(event) {
    if ('Escape' === event.key && this.expanded) {
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
      this.expanded
      && event.target !== this.controller
      && ! this.target.contains(event.target)
    ) {
      this.close();
    }
  }

  /**
   * Remove all ARIA attributes and event listeners added by this class.
   */
  destroy() {
    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggle);
    document.body.removeEventListener('click', this.closeOnOutsideClick);
    this.controller.removeEventListener('keydown', this.closeOnEscKey);
    this.target.removeEventListener('keydown', this.closeOnEscKey);

    // Reset initial state.
    this.#expanded = this.#optionLoadOpen;

    // Cleanup after extensions.
    this.cleanupExtensions();

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }

  /**
   * Update component state to open the Disclosure.
   */
  open() {
    this.expanded = true;
  }

  /**
   * Update component state to close the Disclosure.
   */
  close() {
    this.expanded = false;
  }

  /**
   * Toggle the Disclosure expanded state.
   */
  toggle() {
    this.expanded = (! this.expanded);
  }
}
