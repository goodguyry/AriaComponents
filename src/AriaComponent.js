/**
 * Class for facilitating accessible components.
 */
export default class AriaComponent {
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
      Object.assign(element, { [this.componentName]: this });
    });
  }

  /**
   * Return the current compoennt state.
   *
   * @return {object}
   */
  getState() {
    return this.state;
  }
}
