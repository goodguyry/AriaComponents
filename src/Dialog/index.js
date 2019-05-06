import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import interactiveChildren from '../lib/interactiveChildren';
import keyCodes from '../lib/keyCodes';

/**
 * Dialog class.
 * Sets up an interactive popup dialog element.
 */
export default class Dialog extends AriaComponent {
  /**
   * Create the dialog overlay element.
   * Can be used to obscure the content behind the dialog.
   *
   * @static
   */
  static createOverlayElement() {
    const overlay = document.createElement('div');
    overlay.id = 'aria-dialog-overlay';
    return overlay;
  }

  /**
   * Create the dialog close button, in case one doesn't exist. Will be inserted
   * as the dialog element's first child.
   *
   * @static
   */
  static createCloseButtton() {
    const button = document.createElement('button');
    button.innerText = 'Close';

    return button;
  }

  /**
   * Start the component.
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     * @type {String}
     */
    this.componentName = 'dialog';

    /**
     * Options shape.
     * @type {Object}
     */
    const options = {
      /**
       * The element used to trigger the dialog popup.
       * @type {HTMLElement}
       */
      controller: null,
      /**
       * The dialog element.
       * @type {HTMLElement}
       */
      target: null,
      /**
       * The site content wrapper. NOT necessarily <main>, but the element
       * wrapping all site content (including header and footer) with the sole
       * exception of the dialog element.
       * @type {HTMLElement}
       */
      content: null,
      /**
       * The button used to close the dialog. Required to be the very first
       * element inside the dialog. If none is passed, one will be created.
       * @type {HTMLElement}
       */
      close: this.constructor.createCloseButtton(),
      /**
       * Callback to run after the component initializes.
       * @type {Function}
       */
      onInit: () => {},
      /**
       * Callback to run after component state is updated.
       * @type {Function}
       */
      onStateChange: () => {},
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

    // Initialize the component if all required elements are accounted for.
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
   * Set the component's DOM attributes and event listeners.
   */
  init() {
    /**
     * Add a reference to the class instance to enable external interactions
     * with this instance.
     */
    this.setSelfReference([this.controller, this.target]);

    // Insert the overlay element if it's not found.
    this.overlay = document.getElementById('aria-dialog-overlay');
    if (null === this.overlay) {
      this.overlay = this.constructor.createOverlayElement();
      document.body.insertBefore(this.overlay, this.target);
    }

    /**
     * Create the popup to control the Dialog.
     * @type {Popup}
     */
    this.popup = new Popup({
      controller: this.controller,
      target: this.target,
      type: 'dialog',
      onStateChange: this.onPopupStateChange,
    });

    /**
     * Collect the Dialog's interactive child elements. This is an initial pass
     * to ensure values exists, but the interactive children will be collected
     * each time the dialog opens, in case the dialog's contents change.
     */
    this.interactiveChildren = interactiveChildren(this.target);

    // Add event listeners.
    this.close.addEventListener('click', this.popup.hide);
    this.target.addEventListener('keydown', this.handleTargetKeydown);

    /**
     * Remove clashing Popup event listener. This Popup event listener is
     * clashing with the Dialog's ability to trap keyboard tabs.
     *
     * @todo Can this event listener be removed outright?
     */
    this.popup.target.removeEventListener(
      'keydown',
      this.popup.targetKeyDownHandler
    );

    // Call the onInit callback.
    this.onInit.call(this);
  }

  /**
   * Update element attributes and event listeners when the Popup's state
   * changes. The Dialog component has no state of its own, but run the
   * onStateChange callback regardless so authors can tie in additional
   * functionality necessary for their design.
   *
   * @param {Object} state The Popup component state.
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

    // Run the onStageChange callback.
    this.onStateChange.call(this, this.state);
  }

  /**
   * Close the dialog on when users click outside of the Dialog element.
   *
   * @param {Event}
   */
  outsideClick(event) {
    const { expanded } = this.popup.getState();

    if (expanded && ! this.target.contains(event.target)) {
      this.popup.hide();
    }
  }

  /**
   * Trap key tabs within the dialog.
   *
   * @param {Event}
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
        /**
         * Move back from the first interactive child element to the last
         * interactive child element
         */
        lastChild.focus();
      } else if (! shiftKey && lastChild === activeElement) {
        event.preventDefault();
        /**
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
   * @param {Event}
   */
  handleKeydownEsc(event) {
    const { ESC } = keyCodes;
    const { keyCode } = event;

    if (ESC === keyCode) {
      this.popup.hide();
    }
  }
}
