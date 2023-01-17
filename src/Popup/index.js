import AriaComponent from '../AriaComponent';
import getElementPair from '../lib/getElementPair';
import interactiveChildren from '../lib/interactiveChildren';

/**
 * Class for setting up an interactive popup element that can be triggered by a
 * controlling element.
 */
export default class Popup extends AriaComponent {
  /**
   * Initial expanded state.
   * @private
   *
   * @type {Boolean}
   */
  #expanded = false;

  /**
   * Initial `type` option value.
   * @private
   *
   * @type {Boolean}
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
    super(element);

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

    // Bind class methods.
    this.init = this.init.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.popupControllerKeydown = this.popupControllerKeydown.bind(this);
    this.popupTargetKeydown = this.popupTargetKeydown.bind(this);
    this.patchButtonKeydown = this.patchButtonKeydown.bind(this);
    this.tabBackToController = this.tabBackToController.bind(this);
    this.tabtoTarget = this.tabtoTarget.bind(this);
    this.hideOnTabOut = this.hideOnTabOut.bind(this);
    this.hideOnOutsideClick = this.hideOnOutsideClick.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    /**
     * Collect the target element's interactive child elements.
     *
     * @type {array}
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Focusable content should initially have tabindex='-1'.
    this.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));

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
     * Establishes a relationship when the DOM heirarchy doesn't represent that
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
    this.addAttribute(this.target, 'aria-hidden', 'true');

    // Add event listeners
    this.controller.addEventListener('click', this.toggle);
    this.controller.addEventListener('keydown', this.popupControllerKeydown);
    this.target.addEventListener('keydown', this.popupTargetKeydown);
    document.body.addEventListener('click', this.hideOnOutsideClick);
  }

  /**
   * Update the component attributes based on new state.
   */
  set expanded(newState) {
    // Update state.
    this.#expanded = newState;

    this.updateAttribute(this.controller, 'aria-expanded', this.expanded);
    this.updateAttribute(this.target, 'aria-hidden', (! this.expanded));

    // Allow or deny keyboard focus depending on component state.
    if (this.expanded) {
      this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
    } else {
      // Focusable content should have tabindex='-1' or be removed from the DOM.
      (this.interactiveChildElements || []).forEach((item) => item.setAttribute('tabindex', '-1'));
    }

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
   * Handle keydown events on the Popup controller.
   *
   * @param {Event} event The event object.
   */
  popupControllerKeydown(event) {
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
  }

  patchButtonKeydown(event) {
    const { key } = event;

    if ([' ', 'Enter'].includes(key)) {
      event.preventDefault();

      /*
       * Treat the Spacebar and Return keys as clicks in case the controller is
       * not a <button>.
       */
      this.toggle();
    }
  }

  /**
   * Handle keydown events on the Popup target.
   *
   * @param {Event} event The event object.
   */
  popupTargetKeydown(event) {
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
  }

  /**
   * Close the Popup if the Tab key is pressed and the last interactive child of
   * the Popup is the event target.
   *
   * @param {Event} event The event object.
   */
  hideOnTabOut(event) {
    const { key, shiftKey } = event;

    if (
      this.expanded
      && ! shiftKey
      && 'Tab' === key
    ) {
      this.hide();
    }
  }

  /**
   * Close the Popup when clicking anywhere outside of the target or controller
   * elements.
   *
   * @param {Event} event The event object.
   */
  hideOnOutsideClick(event) {
    const { target: eventTarget } = event;

    if (
      this.expanded
      && eventTarget !== this.controller
      && ! this.target.contains(eventTarget)
    ) {
      this.hide();
    }
  }

  /**
   * Move focus to the target's first interactive child in cases where the
   * markup is disconnected or out-of-order.
   *
   * @param {Event} event The Event object.
   */
  tabtoTarget(event) {
    const { key, shiftKey } = event;

    if (
      this.expanded
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
   * Remove all attributes and event listeners added by this class.
   */
  destroy() {
    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove tabindex attribute.
    this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));

    // Remove event listeners.
    this.controller.removeEventListener('click', this.toggle);
    this.controller.removeEventListener(
      'keydown',
      this.popupControllerKeydown
    );
    this.controller.removeEventListener('keydown', this.patchButtonKeydown);
    this.controller.removeEventListener('keydown', this.tabtoTarget);
    this.target.removeEventListener('keydown', this.tabBackToController);
    this.target.removeEventListener('keydown', this.popupTargetKeydown);
    document.body.removeEventListener('click', this.hideOnOutsideClick);

    // Reset initial state.
    this.#expanded = false;
  }

  /**
   * Update component state to show the target element.
   */
  show() {
    this.expanded = true;
  }

  /**
   * Update component state to hide the target element.
   */
  hide() {
    this.expanded = false;
  }

  /**
   * Toggle the popup state.
   */
  toggle(event) {
    if (null != event) {
      event.preventDefault();
    }

    this.expanded = (! this.expanded);
  }
}
