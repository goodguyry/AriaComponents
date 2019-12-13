/**
 * Class for facilitating accessible components.
 */
export default class AriaComponent {
  /**
   * Warn about deprecated config properties.
   *
   * @param {string} name The name of the class instance.
   * @param {string} unsupported The deprecated config value.
   * @param {string} supported The newly supported config value.
   */
  static warnDeprecated(name, unsupported, supported) {
    // eslint-disable-next-line no-console, max-len
    console.warn(`${name}: config.${unsupported} is deprecated. Use config.${supported} instead.`);
  }

  /**
   * Create an AriaComponent.
   * @constructor
   */
  constructor() {
    /**
     * The component name.
     *
     * @type {string}
     */
    this.componentName = '';

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

    // Bind class methods.
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.setSelfReference = this.setSelfReference.bind(this);
  }

  /**
   * Set component state.
   *
   * @param {object} newState The new state to merge with existing state.
   */
  setState(newState) {
    Object.assign(this.state, newState);

    if (undefined !== this.stateWasUpdated) {
      this.stateWasUpdated(this.state);
    }
  }

  /**
   * Set a reference to the class instance on the element upon which the class
   * is instantiated.
   *
   * @param {array} elements An array of elements upon which to add a reference to `this`.
   */
  setSelfReference(elements) {
    [...elements].forEach((element) => {
      Object.defineProperty(
        element,
        this.componentName,
        { value: this, configurable: true }
      );
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
