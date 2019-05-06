import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import interactiveChildren from '../lib/interactiveChildren';
import keyCodes from '../lib/keyCodes';

/**
 * Manage dialog (modal) elements
 *
 * @todo Throw an error if the modal is within the content element
 */
export default class Dialog extends AriaComponent {
  /**
   * Create the dialog overlay element.
   */
  static createOverlayElement() {
    const overlay = document.createElement('div');
    overlay.id = 'aria-dialog-overlay';
    return overlay;
  }

  static createCloseButtton() {
    const button = document.createElement('button');
    button.innerText = 'Close';

    return button;
  }

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
      controller: null,
      target: null,
      content: null,
      close: this.constructor.createCloseButtton(),
      onInit: () => {},
      onStateChange: () => {},
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    if (undefined === config.close && null !== this.target) {
      this.target.insertBefore(this.close, this.target.firstChild);
    }

    // Bind class methods
    this.onPopupStateChange = this.onPopupStateChange.bind(this);
    this.handleTargetKeydown = this.handleTargetKeydown.bind(this);
    this.handleKeydownEsc = this.handleKeydownEsc.bind(this);

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
   * Initial element setup.
   */
  init() {
    // Add a reference to the class instance
    this.setSelfReference([this.controller, this.target]);

    this.attributes = this.attributes || {};

    this.overlay = document.getElementById('dialog-overlay');
    if (null === this.overlay) {
      this.overlay = this.constructor.createOverlayElement();
      document.body.insertBefore(this.overlay, this.target);
    }

    this.popup = new Popup({
      controller: this.controller,
      target: this.target,
      type: 'dialog',
      onStateChange: this.onPopupStateChange,
    });

    this.interactiveChildren = interactiveChildren(this.target);

    this.close.addEventListener('click', this.popup.hide);
    this.target.addEventListener('keydown', this.handleTargetKeydown);
    // Remove clashing Popup event listener.
    this.popup.target.removeEventListener(
      'keydown',
      this.popup.targetKeyDownHandler
    );

    // @todo Remove support for passing in additional aria-* attributes?
    Object.keys(this.attributes).forEach((attr) => {
      this.target.setAttribute(`aria-${attr}`, this.attributes[attr]);
    });

    this.onInit.call(this);
  }

  /**
   * Update element attributes and event listeners.
   *
   * @param {Object} state The component state.
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
   * Close the dialog on outside click.
   *
   * @param {Object} event The event object.
   */
  outsideClick(event) {
    const { expanded } = this.popup.getState();

    if (expanded && ! this.target.contains(event.target)) {
      this.popup.hide();
    }
  }

  /**
   * Handle key presses.
   *
   * @param {Object} event The event object.
   */
  handleTargetKeydown(event) {
    const { TAB } = keyCodes;
    const { keyCode, shiftKey } = event;

    if (this.popup.getState().expanded && keyCode === TAB) {
      const { activeElement } = document;
      const activeIndex = this.interactiveChildren.indexOf(activeElement);
      const lastIndex = this.interactiveChildren.length - 1;

      // Trap key tabs inside dialog.
      if (shiftKey && 0 === activeIndex) {
        event.preventDefault();
        this.interactiveChildren[lastIndex].focus();
      } else if (! shiftKey && activeIndex === lastIndex) {
        event.preventDefault();
        this.interactiveChildren[0].focus();
      }
    }
  }

  /**
   * Close the dialog on ESC key press.
   *
   * @param  {Object} event The event object.
   */
  handleKeydownEsc(event) {
    const { ESC } = keyCodes;
    const { keyCode } = event;

    if (ESC === keyCode) {
      this.popup.hide();
    }
  }
}
