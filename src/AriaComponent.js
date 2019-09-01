/**
 * Base AriaComponent class.
 */
export default class AriaComponent {
  constructor() {
    /**
     * The component name.
     *
     * @type {String}
     */
    this.componentName = '';

    /**
     * Component state.
     *
     * @type {Object}
     */
    this.state = {};

    // Bind class methods.
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.setSelfReference = this.setSelfReference.bind(this);
  }

  /**
   * Set state.
   *
   * @param {Object} newState The new state to merge with existing state.
   */
  setState(newState) {
    Object.assign(this.state, newState);

    if (undefined !== this.stateWasUpdated) {
      this.stateWasUpdated(this.state);
    }
  }

  /**
   * Set a reference to the class instance on the element upon which the class is instantiated
   *
   * @param {Array} elements An array of elements upon which to add a reference to `this`.
   */
  setSelfReference(elements) {
    [...elements].forEach((element) => {
      Object.assign(element, { [this.componentName]: this });
    });
  }

  /**
   * Return the state instance property.
   *
   * @return {Object}
   */
  getState() {
    return this.state;
  }
}
