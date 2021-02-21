/**
 * Class for facilitating accessible components.
 */
export default class AriaComponent {
  /**
   * Get the target element based on the controller's target attribute.
   *
   * @param  {HTMLElement} controller The component's controlling element.
   * @return {HTMLElement|null}
   */
  static getTargetElement(controller) {
    if (! controller.hasAttribute('target')) {
      AriaComponent.configurationError(
        'The component element is missing the required \'target\' attribute'
      );
    }

    const targetId = controller.getAttribute('target');
    const target = document.getElementById(targetId);

    if (null === target) {
      AriaComponent.configurationError(
        `A target element with ID of '${targetId}' is not found`
      );
    }

    return target;
  }

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
     * Which events to suppress.
     * @private
     *
     * @type {Array}
     */
    this._suppressDispatch = [];

    // Bind class methods.
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.setSelfReference = this.setSelfReference.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.dispatchEventInit = this.dispatchEventInit.bind(this);
    this.dispatchEventDestroy = this.dispatchEventDestroy.bind(this);
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
   * Dispatch event.
   *
   * @param  {string} name   The event name.
   * @param  {object} detail The event detail object.
   */
  dispatch(name, detail) {
    if (! this._suppressDispatch.includes(name)) {
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
   * Set component state.
   *
   * @param {object} newState The new state to merge with existing state.
   */
  setState(newState) {
    const updatedProps = Object.keys(newState);
    Object.assign(this.state, newState);

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
   * @param {array}  elements An array of elements upon which to add a reference to `this`.
   * @param {string} propName Override the string description.
   */
  setSelfReference(elements, propName) {
    const name = propName || this.stringDescription.toLowerCase();

    const referenceElements = [...elements].map((element) => {
      Object.defineProperty(
        element,
        name,
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
}
