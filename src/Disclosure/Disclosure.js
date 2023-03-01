import AriaComponent from '../AriaComponent';
import getElementPair from '../shared/getElementPair';
import { interactiveChildren } from '../shared/interactiveChildren';

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

    // Update component state directly.
    this.#expanded = (
      'true' === this.controller.getAttribute('aria-expanded')
      && 'false' === this.target.getAttribute('aria-hidden')
    );

    this.init();
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
  init = () => {
    /**
     * Collect the target element's interactive child elements.
     * @todo This should all be moved to `manageTabIndex`.
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
    this.addAttribute(this.target, 'aria-hidden', ! this.expanded);

    // Add event listeners
    this.controller.addEventListener('click', this.controllerHandleClick);
    this.controller.addEventListener('keydown', this.componentHandleKeydown);
    this.target.addEventListener('keydown', this.componentHandleKeydown);

    // Install modules.
    this.initModules();

    // Fire the init event.
    this.dispatchEventInit();
  };

  /**
   * Close the Disclosure when the Escape key is pressed.
   *
   * @param {Event} event The Event object.
   */
  componentHandleKeydown = (event) => {
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
  };

  /**
   * Show the Disclosure when the controller is clicked.
   *
   * @param {Event} event The event object.
   */
  controllerHandleClick = (event) => {
    event.preventDefault();

    this.toggle();
  };

  /**
   * Remove all ARIA attributes and event listeners added by this class.
   */
  destroy = () => {
    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove event listeners.
    this.controller.removeEventListener('click', this.controllerHandleClick);
    this.controller.removeEventListener('keydown', this.componentHandleKeydown);
    this.target.removeEventListener('keydown', this.componentHandleKeydown);

    // Cleanup after modules.
    this.cleanupModules();

    // Fire the destroy event.
    this.dispatchEventDestroy();
  };

  /**
   * Update component state to open the Disclosure.
   */
  open = () => {
    this.expanded = true;
  };

  /**
   * Update component state to close the Disclosure.
   */
  close = () => {
    this.expanded = false;
  };

  /**
   * Toggle the Disclosure expanded state.
   */
  toggle = () => {
    this.expanded = (! this.expanded);
  };
}
