/**
 * Class for facilitating accessible components.
 */
export default class AriaComponent {
  /**
   * Throw a confguration error.
   * @static
   *
   * @param {string} message The error message.
   */
  static configurationError(message) {
    throw new Error(`Configuration error: ${message}`);
  }

  /**
   * Create a passably unique `id` attribute.
   * @static
   *
   * @param {Number} radix An optional base for converting the Number to a String.
   * @returns {String}
   */
  static getUniqueId(radix = 36) {
    const [, attr] = Math.random().toString(radix).split('.');
    return `ac-id_${attr}`;
  }

  /**
   * Returns the first and last items from an Array or NodeList.
   *
   * @param  {array|NodeList} items The Array or NodeList from which to retrieve the items.
   * @return {array}                The first and last items.
   */
  static getFirstAndLastItems(items) {
    const {
      0: firstItem,
      [(items.length - 1)]: lastItem,
    } = items;

    // @todo return [items.at(0), items.at(-1)];
    return [firstItem, lastItem];
  }

  /**
   * Create an AriaComponent.
   * @constructor
   */
  constructor(element, options = {}) {
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
     * Save search characters
     *
     * @type {string}
     */
    this.searchString = '';

    /**
     * Component extensions to include.
     *
     * @type {array}
     */
    this.extensions = options.extensions || [];

    /**
     * Track attributes added by this script.
     *
     * @type {Object}
     */
    this.__trackedAttributes = {};

    /**
     * Track installed plugins.
     *
     * @type {Array}
     */
    this.__includedExtensions = [];

    // Bind class methods.
    this.initExtensions = this.initExtensions.bind(this);
    this.start = this.start.bind(this);
    this.cleanupExtensions = this.cleanupExtensions.bind(this);
    this.addAttribute = this.addAttribute.bind(this);
    this.getTrackedAttributesFor = this.getTrackedAttributesFor.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.removeAttributes = this.removeAttributes.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.dispatchEventInit = this.dispatchEventInit.bind(this);
    this.dispatchEventDestroy = this.dispatchEventDestroy.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);

    /**
     * The instance ID.
     *
     * @type {string}
     */
    if ('' === element.id) {
      const sharedId = this.constructor.getUniqueId();

      this.addAttribute(element, 'id', sharedId);
      this.id = sharedId;
    } else {
      this.id = element.id;
    }
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
   * Returns tracked attributes for the given element after ensuring it has the required ID attribute.
   *
   * @param  {HTMLElement} element The element for which attributes are being retrieved.
   * @return {array}
   */
  getTrackedAttributesFor(element) {
    const id = element.id || this.constructor.getUniqueId();
    const { [id]: trackedAttributes = [] } = this.__trackedAttributes;

    // Force an id attribute if none present.
    if ('' === element.id) {
      element.setAttribute('id', id);
      trackedAttributes.push('id');
    }

    return trackedAttributes;
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
    if (! element.hasAttribute(attribute) && null != value) {
      const trackedAttributes = this.getTrackedAttributesFor(element);

      element.setAttribute(attribute, value);
      trackedAttributes.push(attribute);

      this.__trackedAttributes[element.id] = trackedAttributes;
    }
  }

  /**
   * Updates an attribute for the given element and tracks it for later removal.
   *
   * @param {HTMLElement} element   The element to which attributes should be updated.
   * @param {string}      attribute The attribute name.
   * @param {string}      value     The attribute value.
   */
  updateAttribute(element, attribute, value) {
    const trackedAttributes = this.getTrackedAttributesFor(element);

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
    const trackedAttributes = this.getTrackedAttributesFor(element);
    trackedAttributes.forEach((attr) => element.removeAttribute(attr));
  }

  /**
   * Dispatch event.
   *
   * @param  {string} name   The event name.
   * @param  {object} detail The event detail object.
   */
  dispatch(name, detail) {
    const event = new CustomEvent(
      `${this.stringDescription.toLowerCase()}.${name}`,
      {
        bubbles: true,
        composed: true,
        detail,
      }
    );

    this.element.dispatchEvent(event);
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
   * Initialize extension(s).
   */
  initExtensions() {
    const afterDestroy = this.cleanupFunctions || [];
    let cleanup = [];

    if (Array.isArray(this.extensions)) {
      cleanup = this.extensions.map((extension) => this.start(extension));
    } else {
      cleanup.push(this.start(this.extensions));
    }

    this.cleanupFunctions = [...afterDestroy, ...cleanup];
  }

  /**
   * Run the extension function, which returns a cleanup function.
   *
   * @param  {Funciton} extension The extension initializing function.
   * @return {Functions}           The extension's cleanup function.
   */
  start(extension) {
    if (! this.__includedExtensions.includes(extension.name)) {
      this.__includedExtensions.push(extension.name);

      return extension({ instance: this });
    }
  }

  /**
   * Run extension cleanup function.
   */
  cleanupExtensions() {
    this.cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
  }
}
