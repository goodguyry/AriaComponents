import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import interactiveChildren from '../lib/interactiveChildren';
import keyCodes from '../lib/keyCodes';
import getFirstAndLastItems from '../lib/getFirstAndLastItems';

/**
 * Class to set up an interactive Dialog element.
 */
export default class Dialog extends AriaComponent {
  /**
   * Create the dialog close button, in case one doesn't exist. Will be inserted
   * as the dialog element's first child.
   *
   * @return {HTMLElement} The HTML button element with 'Close' as its label.
   */
  static createCloseButton() {
    const button = document.createElement('button');
    button.innerText = 'Close';

    return button;
  }

  /**
   * Create a Dialog.
   * @constructor
   *
   * @param {object} options The options object.
   */
  constructor(controller, options) {
    super(controller);

    const target = super.constructor.getTargetElement(controller);

    /**
     * The component name.
     *
     * @type {string}
     */
    this.componentName = 'Dialog';

    /**
     * Options shape.
     *
     * @type {object}
     */
    const defaultOptions = {
      /**
       * The site content wrapper. NOT necessarily <main>, but the element
       * wrapping all site content (including header and footer) with the sole
       * exception of the dialog element.
       *
       * @type {HTMLElement}
       */
      content: null,

      /**
       * The button used to close the dialog. Required to be the very first
       * element inside the dialog. If none is passed, one will be created.
       *
       * @type {HTMLButtonElement}
       */
      close: this.constructor.createCloseButton(),

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

    // Merge options with defaults and save all as instance properties.
    Object.assign(this, defaultOptions, options, { controller, target });

    // Ensure the target isn't within this.content
    if (
      false === Boolean(this.content)
      || this.content.contains(this.target)
    ) {
      AriaComponent.configurationError(
        'The content cannot contain the dialog element'
      );
    }

    // Insert the close button if no button was passed in.
    if (undefined === options.close && null !== this.target) {
      this.target.insertBefore(this.close, this.target.firstChild);
    }

    // Bind class methods
    this.onPopupStateChange = this.onPopupStateChange.bind(this);
    this.targetHandleKeydown = this.targetHandleKeydown.bind(this);
    this.handleKeydownEsc = this.handleKeydownEsc.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.destroy = this.destroy.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);

    this.init();
  }

  /**
   * Set the component's DOM attributes and event listeners.
   */
  init() {
    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.controller, this.target]);

    /**
     * The Popup instance controlling the Dialog.
     *
     * @type {Popup}
     */
    this.popup = new Popup(
      this.controller,
      {
        type: 'dialog',
        onStateChange: this.onPopupStateChange,
      }
    );

    // Allow focus on the target element.
    this.target.setAttribute('tabindex', '0');

    /*
     * Collect the Dialog's interactive child elements. This is an initial pass
     * to ensure values exists, but the interactive children will be collected
     * each time the dialog opens, in case the dialog's contents change.
     */
    this.interactiveChildElements = interactiveChildren(this.target);

    // Add event listeners.
    this.close.addEventListener('click', this.hide);
    this.target.addEventListener('keydown', this.targetHandleKeydown);

    /*
     * Remove clashing Popup event listener. This Popup event listener is
     * clashing with the Dialog's ability to trap keyboard tabs.
     */
    this.popup.target.removeEventListener(
      'keydown',
      this.popup.targetHandleKeydown
    );

    /**
     * Set initial state.
     *
     * @type {object}
     */
    this.state = { expanded: false };

    /* Run {initCallback} */
    this.onInit.call(this);
  }

  /**
   * Keep this component's state synced with the Popup's state.
   *
   * @param {Object} state The Popup state.
   */
  onPopupStateChange({ expanded }) {
    this.setState({ expanded });
  }

  /**
   * Update element attributes and event listeners when the Popup's state changes.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated() {
    const { expanded } = this.state;

    this.interactiveChildElements = interactiveChildren(this.target);

    if (expanded) {
      this.content.setAttribute('aria-hidden', 'true');
      this.content.setAttribute('hidden', '');
      document.body.addEventListener('keydown', this.handleKeydownEsc);
      this.target.focus();
    } else {
      this.content.setAttribute('aria-hidden', 'false');
      this.content.removeAttribute('hidden');
      document.body.removeEventListener('keydown', this.handleKeydownEsc);
      this.controller.focus();
    }

    /* Run {stateChangeCallback} */
    this.onStateChange.call(this, this.state);
  }

  /**
   * Close the dialog on when users click outside of the Dialog element.
   *
   * @param {Event} event The Event object.
   */
  outsideClick(event) {
    const { expanded } = this.state;

    if (expanded && ! this.target.contains(event.target)) {
      this.hide();
    }
  }

  /**
   * Trap key tabs within the dialog.
   *
   * @param {Event} event The Event object.
   */
  targetHandleKeydown(event) {
    const { TAB } = keyCodes;
    const { keyCode, shiftKey } = event;
    const { expanded } = this.state;

    if (expanded && keyCode === TAB) {
      const { activeElement } = document;
      const [
        firstInteractiveChild,
        lastInteractiveChild,
      ] = getFirstAndLastItems(this.interactiveChildElements);

      if (shiftKey && firstInteractiveChild === activeElement) {
        event.preventDefault();
        /*
         * Move back from the first interactive child element to the last
         * interactive child element
         */
        lastInteractiveChild.focus();
      } else if (! shiftKey && lastInteractiveChild === activeElement) {
        event.preventDefault();
        /*
         * Move forward from the last interactive child element to the first
         * interactive child element.
         */
        firstInteractiveChild.focus();
      }
    }
  }

  /**
   * Close the dialog on ESC key press. This is added to the body element, so
   * any press of the ESC key will short-circuit the dialog and move forcus back
   * to the controller.
   *
   * @param {Event} event The Event object.
   */
  handleKeydownEsc(event) {
    const { ESC } = keyCodes;
    const { keyCode } = event;

    if (ESC === keyCode) {
      this.hide();
    }
  }

  /**
   * Destroy the Dialog and Popup.
   */
  destroy() {
    // Remove the references to the class instance.
    this.deleteSelfReferences();

    // Destroy the Dialog Popup.
    this.popup.destroy();

    // Remove the `aria-hidden` attribute from the content wrapper.
    this.content.removeAttribute('aria-hidden');
    // Remove tabIndex attribute from target.
    this.target.removeAttribute('tabindex');

    // Remove event listeners.
    this.close.removeEventListener('click', this.hide);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    document.body.removeEventListener('keydown', this.handleKeydownEsc);

    /* Run {destroyCallback} */
    this.onDestroy.call(this);
  }

  /**
   * Show the Dialog.
   */
  show() {
    this.popup.show();
  }

  /**
   * Hide the Dialog.
   */
  hide() {
    this.popup.hide();
  }
}
