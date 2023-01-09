import Menu from '../Menu';

/**
 * The MenuBar component is deprecated.
 */
export default class MenuBar extends Menu {
  /**
   * Create a Menu.
   * @constructor
   *
   * @param {HTMLUListElement} element The menu list element.
   * @param {object}           options The options object.
   */
  constructor(list, options = {}) {
    super(list, options);

    if (true !== options.quiet) {
      /* eslint-disable no-console, max-len */
      console.group('[aria-components]: MenuBar');
      console.warn('The MenuBar component is deprecated.');
      console.info('Use the Menu component instead.');
      console.groupEnd();
      /* eslint-enable */
    }
  }
}
