import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import keyCodes from '../lib/keyCodes';
import getFirstAndLastItems from '../lib/getFirstAndLastItems';
import toArray from '../lib/toArray';
import { tabIndexDeny, tabIndexAllow } from '../lib/rovingTabIndex';
import { setUniqueId } from '../lib/uniqueId';

/**
 * Class to set up an interactive Dialog element.
 */
export default class Dialog extends AriaComponent {
  /**
   * Create a Dialog.
   * @constructor
   *
   * @param {HTMLElement} controller The activating element.
   * @param {object}      options    The options object.
   */
  constructor(controller, options = {}) {
    super(controller);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Dialog';

    this.controller = controller;
    this.target = super.constructor.getTargetElement(controller);

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
    this.setInteractiveChildren = this.setInteractiveChildren.bind(this);
    this.controllerHandleClick = this.controllerHandleClick.bind(this);
    this.targetHandleKeydown = this.targetHandleKeydown.bind(this);
    this.handleKeydownEsc = this.handleKeydownEsc.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Collect the Dialog's interactive child elements.
   */
  setInteractiveChildren() {
    this.interactiveChildElements = interactiveChildren(this.target);

    const [
      firstInteractiveChild,
      lastInteractiveChild,
    ] = getFirstAndLastItems(this.interactiveChildElements);

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
      this.content = toArray(this.content);
    }

    // If no content is found.
    if (0 === this.content.length) {
      AriaComponent.configurationError(
        'The Dialog target should not be within the main site content'
      );
    }

    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.controller, this.target]);

    /*
     * Collect the Dialog's interactive child elements. This is an initial pass
     * to ensure values exists, but the interactive children will be collected
     * each time the dialog opens, in case the dialog's contents change.
     */
    this.setInteractiveChildren();

    // Focusable content should initially have tabindex='-1'.
    tabIndexDeny(this.interactiveChildElements);

    // Add target attribute.
    setUniqueId(this.target);

    // Allow focus on the target element.
    this.target.setAttribute('tabindex', '0');

    /*
     * Set the taget as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    this.target.setAttribute('aria-hidden', 'true');
    this.target.setAttribute('hidden', '');

    // Set additional attributes.
    this.target.setAttribute('role', 'dialog');
    this.target.setAttribute('aria-modal', 'true');

    // Add event listeners.
    this.controller.addEventListener('click', this.controllerHandleClick);
    this.target.addEventListener('keydown', this.targetHandleKeydown);

    /**
     * Set initial state.
     *
     * @type {object}
     */
    this.state = { expanded: false };

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Update element attributes and event listeners when the Popup's state changes.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated() {
    const { expanded } = this.state;
    const contentLength = this.content.length;

    this.setInteractiveChildren();

    if (expanded) {
      for (let i = 0; i < contentLength; i += 1) {
        this.content[i].setAttribute('aria-hidden', 'true');
      }

      // Update target element.
      this.target.setAttribute('aria-hidden', 'false');
      this.target.removeAttribute('hidden');

      tabIndexAllow(this.interactiveChildElements);

      document.body.addEventListener('keydown', this.handleKeydownEsc);

      this.target.focus();
    } else {
      for (let i = 0; i < contentLength; i += 1) {
        this.content[i].removeAttribute('aria-hidden');
      }

      // Update target element.
      this.target.setAttribute('aria-hidden', 'true');
      this.target.setAttribute('hidden', '');

      // Focusable content should have tabindex='-1' or be removed from the DOM.
      tabIndexDeny(this.interactiveChildElements);

      document.body.removeEventListener('keydown', this.handleKeydownEsc);

      this.controller.focus();
    }
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
   * Show the Dialog when the controller is clicked.
   *
   * @@param {Event} event The event object.
   */
  controllerHandleClick(event) {
    event.preventDefault();

    this.show();
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

      if (shiftKey && this.firstInteractiveChild === activeElement) {
        event.preventDefault();
        /*
         * Move back from the first interactive child element to the last
         * interactive child element
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

    // Remove the `aria-hidden` attribute from the content wrapper.
    const contentLength = this.content.length;
    for (let i = 0; i < contentLength; i += 1) {
      this.content[i].removeAttribute('aria-hidden');
    }

    // Remove target attributes.
    this.target.removeAttribute('tabindex');

    this.target.removeAttribute('aria-hidden');
    this.target.removeAttribute('hidden');

    this.target.removeAttribute('role');
    this.target.removeAttribute('aria-modal');

    // Remove tabindex attribute.
    tabIndexAllow(this.interactiveChildElements);

    // Remove event listeners.
    this.controller.removeEventListener('click', this.controllerHandleClick);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    document.body.removeEventListener('keydown', this.handleKeydownEsc);

    // Reset initial state.
    this.state = { expanded: false };

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }

  /**
   * Show the Dialog.
   */
  show() {
    this.setState({ expanded: true });
  }

  /**
   * Hide the Dialog.
   */
  hide() {
    this.setState({ expanded: false });
  }
}
