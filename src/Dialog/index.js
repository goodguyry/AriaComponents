import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import interactiveChildren from '../lib/interactiveChildren';
import keyCodes from '../lib/keyCodes';

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
   * @param {object} config The config object.
   */
  constructor(config) {
    super(config);

    /**
     * Options shape.
     *
     * @type {object}
     */
    const options = {
      /**
       * The element used to trigger the dialog popup.
       *
       * @type {HTMLButtonElement}
       */
      controller: null,

      /**
       * The dialog element.
       *
       * @type {HTMLElement}
       */
      target: null,

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

    // Merge config options with defaults and save all as instance properties.
    Object.assign(this, options, config);

    // Insert the close button if no button was passed in.
    if (undefined === config.close && null !== this.target) {
      this.target.insertBefore(this.close, this.target.firstChild);
    }

    // Bind class methods
    this.onPopupStateChange = this.onPopupStateChange.bind(this);
    this.handleTargetKeydown = this.handleTargetKeydown.bind(this);
    this.handleKeydownEsc = this.handleKeydownEsc.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.destroy = this.destroy.bind(this);

    /*
     * Initialize the component if all required elements are accounted for. The
     * final check is to ensure the target isn't within this.content
     */
    if (
      null !== this.controller
      && null !== this.target
      && null !== this.content
      && ! this.content.contains(this.target)
    ) {
      this.init();
    }
  }

  /**
   * Get component state.
   *
   * @return {object} The component state, with it's nested Popup state.
   */
  getState() {
    // Add the Popup state to this component's state.
    return Object.assign(super.getState(), this.popup.getState());
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
     * @type {Popup}
     */
    this.popup = new Popup({
      controller: this.controller,
      target: this.target,
      type: 'dialog',
      onStateChange: this.onPopupStateChange,
    });

    /*
     * Collect the Dialog's interactive child elements. This is an initial pass
     * to ensure values exists, but the interactive children will be collected
     * each time the dialog opens, in case the dialog's contents change.
     */
    this.interactiveChildren = interactiveChildren(this.target);

    // Add event listeners.
    this.close.addEventListener('click', this.hide);
    this.target.addEventListener('keydown', this.handleTargetKeydown);

    /*
     * Remove clashing Popup event listener. This Popup event listener is
     * clashing with the Dialog's ability to trap keyboard tabs.
     */
    this.popup.target.removeEventListener(
      'keydown',
      this.popup.targetKeyDownHandler
    );

    /* Run {initCallback} */
    this.onInit.call(this);
  }

  /**
   * Update element attributes and event listeners when the Popup's state
   * changes. The Dialog component has no state of its own, but run the
   * onStateChange callback regardless so authors can tie in additional
   * functionality necessary for their design.
   *
   * @param {object} state The Popup component state.
   * @param {boolean} state.expanded The expected `expanded` state.
   */
  onPopupStateChange({ expanded }) {
    this.interactiveChildren = interactiveChildren(this.target);

    if (expanded) {
      this.content.setAttribute('aria-hidden', 'true');
      document.body.addEventListener('keydown', this.handleKeydownEsc);
      this.close.focus();
    } else {
      this.content.removeAttribute('aria-hidden');
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
    const { expanded } = this.popup.getState();

    if (expanded && ! this.target.contains(event.target)) {
      this.hide();
    }
  }

  /**
   * Trap key tabs within the dialog.
   *
   * @param {Event} event The Event object.
   */
  handleTargetKeydown(event) {
    const { TAB } = keyCodes;
    const { keyCode, shiftKey } = event;

    if (this.popup.getState().expanded && keyCode === TAB) {
      const { activeElement } = document;
      const lastIndex = this.interactiveChildren.length - 1;
      const [firstChild] = this.interactiveChildren;
      const lastChild = this.interactiveChildren[lastIndex];

      if (shiftKey && firstChild === activeElement) {
        event.preventDefault();
        /*
         * Move back from the first interactive child element to the last
         * interactive child element
         */
        lastChild.focus();
      } else if (! shiftKey && lastChild === activeElement) {
        event.preventDefault();
        /*
         * Move forward from the last interactive child element to the first
         * interactive child element.
         */
        firstChild.focus();
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

    // Remove event listeners.
    this.close.removeEventListener('click', this.hide);
    this.target.removeEventListener('keydown', this.handleTargetKeydown);

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
