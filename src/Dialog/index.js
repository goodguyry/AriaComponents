import AriaComponent from '../AriaComponent';
import getElementPair from '../lib/getElementPair';
import interactiveChildren from '../lib/interactiveChildren';

/**
 * Class to set up an interactive Dialog element.
 */
export default class Dialog extends AriaComponent {
  /**
   * Initial state.
   * @private
   *
   * @type {Boolean}
   */
  #expanded = false;

  /**
   * Create a Dialog.
   * @constructor
   *
   * @param {HTMLElement} element The dialog element.
   * @param {object}      options The options object.
   */
  constructor(element, options = {}) {
    super(element);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Dialog';

    // Get the component elements.
    const { controller, target } = getElementPair(element);
    this.controller = controller;
    this.target = target;

    /**
     * Options shape.
     *
     * @type {object}
     */
    const defaultOptions = {
      /**
       * The element(s) to be hidden when the Dialog is visible. The elements
       * wrapping all site content with the sole exception of the dialog element.
       *
       * @type {HTMLElement|NodeList|Array}
       */
      content: [],
    };

    // Merge remaining options with defaults and save all as instance properties.
    Object.assign(this, defaultOptions, options);

    // Bind class methods
    this.setCloseButton = this.setCloseButton.bind(this);
    this.setInteractiveChildren = this.setInteractiveChildren.bind(this);
    this.controllerHandleClick = this.controllerHandleClick.bind(this);
    this.controllerHandleKeydown = this.controllerHandleKeydown.bind(this);
    this.targetHandleKeydown = this.targetHandleKeydown.bind(this);
    this.handleOutsideKeydown = this.handleOutsideKeydown.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.destroy = this.destroy.bind(this);

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

    const contentLength = this.content.length;

    this.setInteractiveChildren();

    for (let i = 0; i < contentLength; i += 1) {
      this.updateAttribute(this.content[i], 'aria-hidden', (this.expanded || null));
    }

    // Update target element.
    this.updateAttribute(this.target, 'aria-hidden', (! this.expanded));

    if (this.expanded) {
      this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));

      document.body.addEventListener('keydown', this.handleOutsideKeydown);

      this.target.focus();
    } else {
      // Focusable content should have tabindex='-1' or be removed from the DOM.
      this.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));

      document.body.removeEventListener('keydown', this.handleOutsideKeydown);

      this.controller.focus();
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
   * Collect the Dialog's interactive child elements.
   */
  setInteractiveChildren() {
    this.interactiveChildElements = interactiveChildren(this.target);

    const [
      firstInteractiveChild,
      lastInteractiveChild,
    ] = this.constructor.getFirstAndLastItems(this.interactiveChildElements);

    // Save as instance properties.
    this.firstInteractiveChild = firstInteractiveChild;
    this.lastInteractiveChild = lastInteractiveChild;
  }

  /**
   * Set the component's DOM attributes and event listeners.
   */
  init() {
    // Get the content items if none are provided.
    if (0 === this.content.length || undefined === this.content) {
      this.content = Array.from(document.body.children)
        .filter((child) => ! child.contains(this.target));
    } else {
      this.content = Array.from(this.content);
    }

    // If no content is found.
    if (0 === this.content.length) {
      AriaComponent.configurationError(
        'The Dialog target should not be within the main site content'
      );
    }

    // Be sure each element has an id attribute for internal attribute tracking.
    const contentLength = this.content.length;
    for (let i = 0; i < contentLength; i += 1) {
      this.addAttribute(this.content[i], this.constructor.getUniqueId());
    }

    /*
     * Collect the Dialog's interactive child elements. This is an initial pass
     * to ensure values exists, but the interactive children will be collected
     * each time the dialog opens, in case the dialog's contents change.
     */
    this.setInteractiveChildren();

    // Focusable content should initially have tabindex='-1'.
    this.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));

    /**
     * Check if the controller is a button, but only if it doesn't already have
     * a role attribute, since we'll be adding the role and allowing focus.
     *
     * @type {bool}
     */
    this.controllerIsNotAButton = (
      'BUTTON' !== this.controller.nodeName
      && null === this.controller.getAttribute('role')
    );

    /*
     * Use the button role on non-button elements.
     */
    if (this.controllerIsNotAButton) {
      // https://www.w3.org/TR/wai-aria-1.1/#button
      this.addAttribute(this.controller, 'role', 'button');
      this.addAttribute(this.controller, 'tabindex', '0');
    }

    // Allow focus on the target element.
    this.addAttribute(this.target, 'tabindex', '0');

    /*
     * Set the target as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    this.addAttribute(this.target, 'aria-hidden', 'true');

    // Set additional attributes.
    this.addAttribute(this.target, 'role', 'dialog');
    this.addAttribute(this.target, 'aria-modal', 'true');

    // Add event listeners.
    this.controller.addEventListener('click', this.controllerHandleClick);
    this.target.addEventListener('keydown', this.targetHandleKeydown);

    if (this.controllerIsNotAButton) {
      this.controller.addEventListener('keydown', this.controllerHandleKeydown);
    }

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Handles setting the close button's event listener
   *
   * @param {HTMLButtonElement} button The Dialog's close element.
   */
  setCloseButton(button) {
    if (null != button) {
      this.closeButton = button;

      this.closeButton.addEventListener('click', this.hide);
    }
  }

  /**
   * Close the dialog on when users click outside of the Dialog element.
   *
   * @param {Event} event The Event object.
   */
  outsideClick(event) {
    if (this.expanded && ! this.target.contains(event.target)) {
      this.hide();
    }
  }

  /**
   * Show the Dialog when the controller is clicked.
   *
   * @param {Event} event The event object.
   */
  controllerHandleClick(event) {
    event.preventDefault();

    this.show();
  }

  /**
   * Handle keydown events on the Dialog controller.
   *
   * @param {Event} event The event object.
   */
  controllerHandleKeydown(event) {
    if ([' ', 'Return'].includes(event.key)) {
      event.preventDefault();

      /*
       * Treat the Spacebar and Return keys as clicks in case the controller is
       * not a <button>.
       */
      this.show();
    }
  }

  /**
   * Trap key tabs within the dialog.
   *
   * @param {Event} event The Event object.
   */
  targetHandleKeydown(event) {
    const { key, shiftKey } = event;

    if (this.expanded && 'Tab' === key) {
      const { activeElement } = document;

      if (
        shiftKey
        && (
          this.firstInteractiveChild === activeElement
          || this.target === activeElement
        )
      ) {
        event.preventDefault();
        /*
         * Move back from the first interactive child element, or dialog element
         * itself, to the last interactive child element.
         */
        this.lastInteractiveChild.focus();
      } else if (! shiftKey && this.lastInteractiveChild === activeElement) {
        event.preventDefault();
        /*
         * Move forward from the last interactive child element to the first
         * interactive child element.
         */
        this.firstInteractiveChild.focus();
      }
    }
  }

  /**
   * Close the dialog on 'Escape' key press. This is added to the body element, so
   * any press of the 'Escape' key will short-circuit the dialog and move forcus back
   * to the controller.
   *
   * @param {Event} event The Event object.
   */
  handleOutsideKeydown(event) {
    const { key, target: eventTarget } = event;

    switch (key) {
      case 'Escape':
        this.hide();
        break;

      case 'Tab':
        if (! this.target.contains(eventTarget)) {
          /*
           * Move focus to the first interactive child element. This is a stopgap
           * for instances where clicking outside of the Dialog moves focus out.
           */
          this.firstInteractiveChild.focus();
        }
        break;

      default:
        break;
    }
  }

  /**
   * Destroy the Dialog and Popup.
   */
  destroy() {
    // Remove the `aria-hidden` attribute from the content wrapper.
    const contentLength = this.content.length;
    for (let i = 0; i < contentLength; i += 1) {
      this.removeAttributes(this.content[i]);
    }

    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove tabindex attribute.
    this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));

    // Remove event listeners.
    this.controller.removeEventListener('click', this.controllerHandleClick);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    document.body.removeEventListener('keydown', this.handleOutsideKeydown);

    if (this.controllerIsNotAButton) {
      this.controller.removeEventListener(
        'keydown',
        this.controllerHandleKeydown
      );
    }

    if (null != this.closeButton) {
      this.closeButton.removeEventListener('click', this.hide);
    }

    // Reset initial state.
    this.#expanded = false;

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }

  /**
   * Show the Dialog.
   */
  show() {
    this.expanded = true;
  }

  /**
   * Hide the Dialog.
   */
  hide() {
    this.expanded = false;
  }
}
