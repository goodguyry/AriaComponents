import AriaComponent from '../AriaComponent';
import getElementPair from '../shared/getElementPair';
import { interactiveChildren } from '../shared/interactiveChildren';

/**
 * Class for setting up an interactive popup element that can be triggered by a
 * controlling element.
 */
export default class Popup extends AriaComponent {
  /**
   * Initial expanded state.
   * @private
   *
   * @type {bool}
   */
  #expanded = false;

  /**
   * Initial `type` option value.
   * @private
   *
   * @type {bool}
   */
  #optionType = 'true'; // 'true' === 'menu' in UAs that don't support WAI-ARIA 1.1

  /**
   * Create a MenuBar.
   * @constructor
   *
   * @param {HTMLElement} element The activating element.
   * @param {object}      options The options object.
   */
  constructor(element, options = {}) {
    super(element, options);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    super[Symbol.toStringTag] = 'Popup';

    // Get the component elements.
    const { controller, target } = getElementPair(element);
    this.controller = controller;
    this.target = target;

    // Merge options with default values.
    const { type } = {
      /**
       * The value of `aria-haspopup` must match the role of the Popup container.
       * Options: menu, listbox, tree, grid, or dialog,
       *
       * @type {string}
       */
      type: this.#optionType,

      ...options,
    };

    // Set options.
    this.#optionType = type;

    // Intial component state.
    this.expanded = this.#expanded;
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init = () => {
    /**
     * Collect the target element's interactive child elements.
     *
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
      ] = this.constructor.getFirstAndLastItems(this.interactiveChildElements);

      this.lastInteractiveChild = lastInteractiveChild;
      this.firstInteractiveChild = firstInteractiveChild;
    }

    // Add controller attributes
    this.addAttribute(this.controller, 'aria-haspopup', this.#optionType);
    this.addAttribute(this.controller, 'aria-expanded', 'false');

    /*
     * Set the taget as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    this.addAttribute(this.target, 'aria-hidden', 'true');

    // Add event listeners
    this.controller.addEventListener('click', this.controllerHandleClick);
    this.controller.addEventListener('keydown', this.controllerHandleKeydown);
    this.target.addEventListener('keydown', this.targetHandleKeydown);
    document.body.addEventListener('click', this.bodyHandleClick);

    // Install modules.
    this.initModules();
  };

  /**
   * Update the component attributes based on new state.
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
   * Show the Popup when the controller is clicked.
   *
   * @param {Event} event The event object.
   */
  controllerHandleClick = (event) => {
    event.preventDefault();

    this.toggle();
  };

  /**
   * Handle keydown events on the Popup controller.
   *
   * @param {Event} event The event object.
   */
  controllerHandleKeydown = (event) => {
    const { key } = event;

    if (this.expanded && 'Escape' === key) {
      event.preventDefault();

      /*
       * Close the Popup when the Escape key is pressed. Because focus is not
       * inside the target (based on the fact that the event was fired on the
       * controller), there's no need to move focus.
       */
      this.hide();
    }
  };

  /**
   * Handle keydown events on the Popup target.
   *
   * @param {Event} event The event object.
   */
  targetHandleKeydown = (event) => {
    const { key, shiftKey } = event;
    const { activeElement } = document;

    if (this.expanded && 'Escape' === key) {
      event.preventDefault();

      /*
       * Close the Popup when the Escape key is pressed.
       */
      this.hide();

      /*
       * Because the activeElement is within the Popup, move focus to the Popup
       * controller to avoid the confusion of focus being within a hidden
       * element.
       */
      this.controller.focus();
    }

    if (
      this.lastInteractiveChild === activeElement
      && ! shiftKey
      && 'Tab' === key
    ) {
      /*
       * Close the Popup when tabbing from the last child.
       */
      this.hide();
    }
  };

  /**
   * Close the Popup when clicking anywhere outside of the target or controller
   * elements.
   *
   * @param {Event} event The event object.
   */
  bodyHandleClick = (event) => {
    const { target: eventTarget } = event;

    if (
      this.expanded
      && eventTarget !== this.controller
      && ! this.target.contains(eventTarget)
    ) {
      this.hide();
    }
  };

  /**
   * Remove all attributes and event listeners added by this class.
   */
  destroy = () => {
    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove event listeners.
    this.controller.removeEventListener('click', this.controllerHandleClick);
    this.controller.removeEventListener('keydown', this.controllerHandleKeydown);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    document.body.removeEventListener('click', this.bodyHandleClick);

    // Reset initial state.
    this.#expanded = false;

    // Cleanup after modules.
    this.cleanupModules();

    // Fire the destroy event.
    this.dispatchEventDestroy();
  };

  /**
   * Update component state to show the target element.
   */
  show = () => {
    this.expanded = true;
  };

  /**
   * Update component state to hide the target element.
   */
  hide = () => {
    this.expanded = false;
  };

  /**
   * Toggle the popup state.
   */
  toggle = () => {
    this.expanded = (! this.expanded);
  };
}
