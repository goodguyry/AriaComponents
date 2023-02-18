import AriaComponent from '../AriaComponent';
import getElementPair from '../shared/getElementPair';
import interactiveChildren from '../shared/interactiveChildren';

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
   * The close button.
   *
   * @type {HTMLButtonElement}
   */
  #closeButton = null;

  /**
   * Create a Dialog.
   * @constructor
   *
   * @param {HTMLElement} element The dialog element.
   * @param {object}      options The options object.
   */
  constructor(element, options = {}) {
    super(element, options);

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
    const { closeButton } = {
      /**
       * The element used to close the Dialog.
       *
       * @type {HTMLButtonElement}
       */
      closeButton: null,

      ...options,
    };

    // Set the close button.
    this.closeButton = closeButton;

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

    this.setInteractiveChildren();

    // Update target element.
    this.updateAttribute(this.target, 'aria-hidden', (! this.expanded));

    if (this.expanded) {
      document.body.addEventListener('keydown', this.bodyHandleKeydown);

      if (null != this.#closeButton) {
        this.#closeButton.focus();
      }
    } else {
      document.body.removeEventListener('keydown', this.bodyHandleKeydown);

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
  setInteractiveChildren = () => {
    this.interactiveChildElements = interactiveChildren(this.target);

    const [
      firstInteractiveChild,
      lastInteractiveChild,
    ] = this.constructor.getFirstAndLastItems(this.interactiveChildElements);

    // Save as instance properties.
    this.firstInteractiveChild = firstInteractiveChild;
    this.lastInteractiveChild = lastInteractiveChild;
  };

  /**
   * Set the component's DOM attributes and event listeners.
   */
  init = () => {
    /*
     * Collect the Dialog's interactive child elements. This is an initial pass
     * to ensure values exists, but the interactive children will be collected
     * each time the dialog opens, in case the dialog's contents change.
     */
    this.setInteractiveChildren();

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

    // Install modules.
    this.initModules();

    // Fire the init event.
    this.dispatchEventInit();
  };

  /**
   * Handles setting the close button's event listener
   *
   * @param {HTMLButtonElement} button The Dialog's close element.
   */
  set closeButton(button) {
    if (null != this.#closeButton) {
      this.#closeButton.removeEventListener('click', this.hide);
    }

    this.#closeButton = button;

    if (null != button) {
      this.#closeButton.addEventListener('click', this.hide);
    }
  }

  /**
   * Close the dialog on when users click outside of the Dialog element.
   *
   * @todo This isn't actually used.
   *
   * @param {Event} event The Event object.
   */
  outsideClick = (event) => {
    if (this.expanded && ! this.target.contains(event.target)) {
      this.hide();
    }
  };

  /**
   * Show the Dialog when the controller is clicked.
   *
   * @param {Event} event The event object.
   */
  controllerHandleClick = (event) => {
    event.preventDefault();

    this.show();
  };

  /**
   * Trap key tabs within the dialog.
   *
   * @param {Event} event The Event object.
   */
  targetHandleKeydown = (event) => {
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
  };

  /**
   * Close the dialog on 'Escape' key press. This is added to the body element,
   * so any press of the 'Escape' key will short-circuit the dialog and move
   * focus back to the controller.
   *
   * @param {Event} event The Event object.
   */
  bodyHandleKeydown = (event) => {
    const { key, target: eventTarget } = event;

    switch (key) {
      case 'Escape':
        this.hide();
        break;

      default:
        break;
    }
  };

  /**
   * Destroy the Dialog and Popup.
   */
  destroy = () => {
    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Remove event listeners.
    this.controller.removeEventListener('click', this.controllerHandleClick);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    document.body.removeEventListener('keydown', this.bodyHandleKeydown);

    if (null != this.#closeButton) {
      this.#closeButton.removeEventListener('click', this.hide);
    }

    // Reset initial state.
    this.#expanded = false;

    // Cleanup after modules.
    this.cleanupModules();

    // Fire the destroy event.
    this.dispatchEventDestroy();
  };

  /**
   * Show the Dialog.
   */
  show = () => {
    this.expanded = true;
  };

  /**
   * Hide the Dialog.
   */
  hide = () => {
    this.expanded = false;
  };
}
