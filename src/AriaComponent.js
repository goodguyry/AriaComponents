import { getUniqueId } from './lib/uniqueId';

/**
 * Class for facilitating accessible components.
 */
export default class AriaComponent {
  /**
   * Throw a confguration error.
   *
   * @param {string} message The error message.
   */
  static configurationError(message) {
    throw new Error(`Configuration error: ${message}`);
  }

  /**
   * Create an AriaComponent.
   * @constructor
   */
  constructor(element) {
    // Validate the component element.
    if (null == element || ! (element instanceof HTMLElement)) {
      AriaComponent.configurationError(
        'The component element must be a valid HTMLElement'
      );
    }

    /**
     * The controlling element.
     *
     * @type {HTMLElement}
     */
    this.element = element;

    /**
     * The default string description for this object.
     *
     * @type {string}
     */
    this.stringDescription = 'AriaComponent';

    /**
     * Component state.
     *
     * @type {object}
     */
    this.state = {};

    /**
     * Save search characters
     *
     * @type {string}
     */
    this.searchString = '';

    /**
     * Saved reference elements.
     *
     * @type {Array}
     */
    this.referenceElements = [];

    /**
     * Track attributes added by this script.
     *
     * @type {Object}
     */
    this.__trackedAttributes = {};

    /**
     * Whether to suppress the `init` and `destroy` events.
     * @private
     *
     * @type {Boolean}
     */
    this._stateDispatchesOnly = false;

    // Bind class methods.
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.setSelfReference = this.setSelfReference.bind(this);
    this.addAttribute = this.addAttribute.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.removeAttributes = this.removeAttributes.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.dispatchEventInit = this.dispatchEventInit.bind(this);
    this.dispatchEventDestroy = this.dispatchEventDestroy.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.warnMenu = this.warnMenu.bind(this);
  }

  /**
   * Set the string description for this object.
   *
   * @param {string} name The component name.
   */
  set [Symbol.toStringTag](name) {
    this.stringDescription = name;
  }

  /**
   * Get the string description for this object.
   * E.x., MenuButton.toString() === '[object MenuButton]'
   *
   * @return {string}
   */
  get [Symbol.toStringTag]() {
    return this.stringDescription;
  }

  /**
   * Adds an attribute for the given element and tracks it for later removal.
   *
   * @param {HTMLElement} element   The element to which attributes should be added.
   * @param {string}      attribute The attribute name.
   * @param {string}      value     The attribute value.
   */
  addAttribute(element, attribute, value) {
    // Don't overwrite existing attributes.
    if (element.hasAttribute(attribute) || null == value) {
      return void 0;
    }

    const id = element.id || getUniqueId();
    const trackedAttributes = (this.__trackedAttributes[id] ?? []);

    // Force an id attribute if none present.
    if ('' === element.id) {
      element.setAttribute('id', id);
      trackedAttributes.push('id');
    }

    element.setAttribute(attribute, value);
    trackedAttributes.push(attribute);

    this.__trackedAttributes[element.id] = trackedAttributes;
  }

  /**
   * Updates an attribute for the given element and tracks it for later removal.
   *
   * @param {HTMLElement} element   The element to which attributes should be added.
   * @param {string}      attribute The attribute name.
   * @param {string}      value     The attribute value.
   */
  updateAttribute(element, attribute, value) {
    const id = element.id || getUniqueId();
    const trackedAttributes = (this.__trackedAttributes[id] ?? []);

    // Force an id attribute if none present.
    if ('' === element.id) {
      element.setAttribute('id', id);
      trackedAttributes.push('id');
    }

    // Remove null/undefined attributes.
    if (null == value) {
      element.removeAttribute(attribute);
      trackedAttributes.filter((item) => item !== attribute);
    } else {
      element.setAttribute(attribute, value);
      trackedAttributes.push(attribute);
    }

    this.__trackedAttributes[element.id] = trackedAttributes;
  }

  /**
   * Removes tracked attributes added to the given element.
   *
   * @param {HTMLElement} element The elemen on which attributes were added.
   */
  removeAttributes(element) {
    const attributes = (this.__trackedAttributes[element.id] ?? []);
    attributes.forEach((attr) => element.removeAttribute(attr));
  }

  /**
   * Dispatch event.
   *
   * @param  {string} name   The event name.
   * @param  {object} detail The event detail object.
   */
  dispatch(name, detail) {
    const allowed = this._stateDispatchesOnly ? ('stateChange' === name) : true;

    if (allowed) {
      const event = new CustomEvent(
        name,
        {
          bubbles: true,
          composed: true,
          detail,
        }
      );

      this.element.dispatchEvent(event);
    }
  }

  /**
   * Dispatch the `init` event.
   */
  dispatchEventInit() {
    this.dispatch(
      'init',
      {
        instance: this,
      }
    );
  }

  /**
   * Dispatch the `destroy` event.
   */
  dispatchEventDestroy() {
    this.dispatch(
      'destroy',
      {
        element: this.element,
        instance: this,
      }
    );
  }

  /**
   * Register an event handler for the given event type.
   *
   * @param {string}   type     The event type.
   * @param {function} listener The event listener callback.
   * @param {object}   options  Event options.
   */
  on(type, listener, options = {}) {
    this.element.addEventListener(type, listener, options);

    return this;
  }

  /**
   * Unregister an event handler for the given event type.
   *
   * @param {string}   type     The event type.
   * @param {function} listener The event callback.
   * @param {object}   options  Event options.
   */
  off(type, listener, options = {}) {
    this.element.removeEventListener(type, listener, options);

    return this;
  }

  /**
   * Set component state.
   *
   * @param {object} newState The new state to merge with existing state.
   */
  setState(newState) {
    const updatedProps = Object.keys(newState);

    const updatedState = { ...this.state, ...newState };
    this.state = updatedState;

    if ('function' === typeof this.stateWasUpdated) {
      this.stateWasUpdated(updatedProps);
    }

    // Fire the `stateChange` event.
    this.dispatch(
      'stateChange',
      {
        instance: this,
        props: updatedProps,
        state: this.state,
      }
    );
  }

  /**
   * Set a reference to the class instance on the element upon which the class
   * is instantiated.
   *
   * @param {HTMLElement} elements One or more elements upon which to add a reference to `this`.
   */
  setSelfReference(...elements) {
    const referenceElements = elements.map((element) => {
      Object.defineProperty(
        element,
        this.stringDescription.toLowerCase(),
        { value: this, configurable: true }
      );

      return element;
    });

    this.referenceElements = [...this.referenceElements, ...referenceElements];
  }

  /**
   * Delete self references from component elements.
   */
  deleteSelfReferences() {
    this.referenceElements.forEach((element) => {
      delete element[this.stringDescription.toLowerCase()];
    });
  }

  /**
   * Return the current component state.
   *
   * @return {object}
   */
  getState() {
    return this.state;
  }

  /**
   * Menu-specific warning helper.
   */
  warnMenu() {
    /* eslint-disable no-console, max-len */
    console.group(`[aria-components]: ${this.stringDescription}`);
    console.warn('This component is only appropriate for application-like menus and should not be used for a website navigation.');
    console.info('Pass `__is_application_menu: true` to quiet this warning.');
    console.groupEnd();
    /* eslint-enable */
  }
}
