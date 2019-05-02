import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import keyCodes from '../lib/keyCodes';

/**
 * Manage dialog (modal) elements
 *
 * @todo Add a close button if one isn't passed.
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
      close: null,
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    // Default state.
    this.state.visible = false;

    // Bind class methods
    this.outsideClick = this.outsideClick.bind(this);
    this.handleTargetKeydown = this.handleTargetKeydown.bind(this);
    this.handleKeydownEsc = this.handleKeydownEsc.bind(this);
    this.setState = this.setState.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    this.init();
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

    this.controller.setAttribute('aria-haspopup', 'dialog');
    this.controller.setAttribute('aria-expanded', 'false');
    this.target.setAttribute('aria-hidden', 'true');

    this.controller.addEventListener('click', this.show);
    this.target.addEventListener('keydown', this.handleTargetKeydown);
    this.close.addEventListener('click', this.hide);
    this.overlay.addEventListener('click', this.outsideClick);

    // @todo Remove support for passing in additional aria-* attributes?
    Object.keys(this.attributes).forEach((attr) => {
      this.target.setAttribute(`aria-${attr}`, this.attributes[attr]);
    });
  }

  /**
   * Update element attributes and event listeners.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated({ visible }) {
    this.controller.setAttribute('aria-expanded', `${visible}`);
    this.target.setAttribute('aria-hidden', `${! visible}`);
    this.content.setAttribute('aria-hidden', `${visible}`);

    if (visible) {
      this.interactiveChildren = interactiveChildren(this.target);

      document.body.addEventListener('keydown', this.handleKeydownEsc);
      this.close.focus();
    } else {
      document.body.removeEventListener('keydown', this.handleKeydownEsc);
      this.controller.focus();
    }
  }

  /**
   * Close the dialog on outside click.
   *
   * @param {Object} event The event object.
   */
  outsideClick(event) {
    const { visible } = this.state;

    if (visible && ! this.target.contains(event.target)) {
      this.hide();
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

    if (this.state.visible && keyCode === TAB) {
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
      this.hide();
    }
  }

  /**
   * Hide the target element.
   */
  hide() {
    this.setState({ visible: false });
  }

  /**
   * Show the target element.
   */
  show() {
    this.setState({ visible: true });
  }
}
