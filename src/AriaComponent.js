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
    this.typeAhead = this.typeAhead.bind(this);
    this.clearSearchString = this.clearSearchString.bind(this);
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
   * Return the current compoennt state.
   *
   * @return {object}
   */
  getState() {
    return this.state;
  }

  /**
   * Select the item that matches a search string.
   * If a match is found, return it so that it can be selected.
   *
   * @param {Number} key A keyCode value.
   * @return {HTMLElement|null} The matched element or null if no match.
   */
  typeAhead(key, items) {
    const character = String.fromCharCode(key);

    // Append the new character to the searchString
    this.searchString += character;
    this.clearSearchString();

    // Find the item by matching the search string to the item text.
    const match = items.filter((item) => {
      const itemText = item.textContent.toLowerCase();
      return 0 === itemText.indexOf(this.searchString.toLowerCase());
    });

    return match.length ? match[0] : null;
  }

  /**
   * Clear the typed string after timeout.
   */
  clearSearchString() {
    if (this.keyClear) {
      clearTimeout(this.keyClear);
      this.keyClear = null;
    }

    this.keyClear = setTimeout(() => {
      this.searchString = '';
      this.keyClear = null;
    }, 500);
  }
}
