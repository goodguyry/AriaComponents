/**
 * Class for facilitating accessible components.
 */
export default class AriaComponent {
  /**
   * Get the target element based on the controller's target attribute.
   *
   * @param  {HTMLElement} controller The components controlling element.
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
    if (false === Boolean(element)) {
      AriaComponent.configurationError(
        'The first parameter must be a valid HTMLElement'
      );
    }

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

    // Bind class methods.
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.setSelfReference = this.setSelfReference.bind(this);
    this.warnDeprecated = this.warnDeprecated.bind(this);
  }

  /**
   * Set component state.
   *
   * @param {object} newState The new state to merge with existing state.
   */
  setState(newState) {
    Object.assign(this.state, newState);

    if ('function' === typeof this.stateWasUpdated) {
      this.stateWasUpdated();
    }
  }

  /**
   * Set a reference to the class instance on the element upon which the class
   * is instantiated.
   *
   * @param {array} elements An array of elements upon which to add a reference to `this`.
   */
  setSelfReference(elements) {
    const referenceElements = [...elements].map((element) => {
      Object.defineProperty(
        element,
        this.componentName.toLowerCase(),
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
      delete element[this.componentName.toLowerCase()];
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
   * Warn about deprecated config properties.
   *
   * @param {string} name The name of the class instance.
   * @param {string} unsupported The deprecated config value.
   * @param {string} supported The newly supported config value, if any.
   */
  warnDeprecated(unsupported, supported = false) {
    const use = supported ? `Use ${supported} instead.` : '';
    // eslint-disable-next-line no-console, max-len
    console.warn(
      `${this.componentName}:`,
      `${unsupported} is deprecated.`,
      `${use}`
    );
  }
}
