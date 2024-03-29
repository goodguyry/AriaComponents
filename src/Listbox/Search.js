/**
 * Class for searching a list.
 */
export default class Search {
  /**
   * Create an instance of the Search class.
   * @constructor
   */
  constructor(items) {
    this.searchString = '';
    this.clearSearch = null;

    // Make sure `items` is an Array.
    switch (true) {
      case Array.isArray(items): {
        this.items = items;
        break;
      }
      case items instanceof NodeList: {
        this.items = Array.from(items);
        break;
      }
      case null !== items && 'UL' === items.nodeName: {
        this.items = Array.from(items.children);
        break;
      }
      default: {
        this.items = null;
        break;
      }
    }
  }

  /**
   * Select the item that matches a search string.
   * If a match is found, return it so that it can be selected.
   *
   * @param {number} key A keyCode value.
   * @return {HTMLElement|null} The matched element or null if no match.
   */
  getItem(key) {
    if (null !== this.items) {
      // Append the new character to the searchString
      this.searchString += key;

      if (null !== this.clearSearch) {
        clearTimeout(this.clearSearch);
        this.clearSearch = null;
      }

      // Clear the typed string after timeout.
      this.clearSearch = setTimeout(() => {
        this.searchString = '';
        this.clearSearch = null;
      }, 500);

      // Find the item by matching the search string to the item text.
      const match = this.items.find((item) => item.textContent
        .toLowerCase()
        .startsWith(this.searchString.toLowerCase()));

      return match;
    }

    return null;
  }
}
