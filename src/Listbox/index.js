import Popup from '../Popup';
import Search from './Search';

/**
 * Class to set up an interactive Listbox element.
 *
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
export default class ListBox extends Popup {
  /**
   * The initial selected option.
   *
   * @type {HTMLElement|null}
   */
  #selectedOption = null;

  /**
   * Create a ListBox.
   * @constructor
   *
   * @param {HTMLElement} lement  The component element.
   * @param {object}      options The options object.
   */
  constructor(element, options = {}) {
    // Pass in the `listbox` type.
    super(element, { ...options, type: 'listbox' });

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Listbox';

    // Bind class methods.
    this.preventWindowScroll = this.preventWindowScroll.bind(this);
    this.controllerHandleKeyup = this.controllerHandleKeyup.bind(this);
    this.targetHandleKeydown = this.targetHandleKeydown.bind(this);
    this.targetHandleClick = this.targetHandleClick.bind(this);
    this.targetHandleBlur = this.targetHandleBlur.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.afterPopupStateChange = this.afterPopupStateChange.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Set the active descendant and update attributes accordingly.
   *
   * @param {HTMLElement} newSelection The option to set as selected.
   */
  set activeDescendant(newSelection) {
    this.#selectedOption = newSelection;

    /*
     * Remove the `aria-selected` attribute from the previously-selected option
     * and add it to the newly-selected option.
     */
    const selected = this.target.querySelector('[aria-selected="true"]');
    if (null !== selected) {
      this.updateAttribute(selected, 'aria-selected', null);
    }

    this.updateAttribute(this.activeDescendant, 'aria-selected', 'true');

    /*
     * If the selected option is beyond the bounds of the list, scroll it into
     * view. Check this every time state is updated to ensure the selected
     * option is always visible.
     */
    this.scrollOptionIntoView(this.activeDescendant);

    /*
     * Track the newly selected option via the `aria-activedescendant`
     * attribute on the target.
     */
    this.updateAttribute(this.target, 'aria-activedescendant', this.activeDescendant.id);
  }

  /**
   * Get the selected option.
   *
   * @return {HTMLElement} The selected option.
   */
  get activeDescendant() {
    return this.#selectedOption;
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    super.init();

    /**
     * The target list items.
     *
     * @type {array}
     */
    this.options = Array.from(this.target.children);

    /**
     * Initialize search.
     * @type {Search}
     */
    this.search = new Search(this.options);

    // Set the `option` role for each list item and ensure each has a unique ID.
    this.options.forEach((listItem) => this.addAttribute(listItem, 'role', 'option'));

    // Save the first and last options.
    const [firstOption, lastOption] = this.constructor.getFirstAndLastItems(this.options);
    this.firstOption = firstOption;
    this.lastOption = lastOption;

    /**
     * The initial state.
     *
     * The element is saved, rather than just its ID attribute, to remove the
     * need to query the DOM for it each time we need to act on it.
     *
     * @type {HTMLElement}
     */
    this.#selectedOption = this.firstOption;

    /*
     * Add the 'listbox' role to signify a component that presents a listbox of
     * options from which to select.
     */
    this.addAttribute(this.target, 'role', 'listbox');

    /*
     * Set up the target element to allow programatically setting focus to it
     * when the Listbox opens.
     */
    this.addAttribute(this.target, 'tabindex', '-1');

    // Add event listeners.
    this.controller.addEventListener('keyup', this.controllerHandleKeyup);
    this.target.addEventListener('keydown', this.targetHandleKeydown);
    this.target.addEventListener('click', this.targetHandleClick);
    this.target.addEventListener('blur', this.targetHandleBlur);

    // Prevent scrolling when using arrow up/down on the button.
    window.addEventListener('keydown', this.preventWindowScroll);

    // Listen for Popup state changes; prefix due to override in constructor.
    this.on('listbox.stateChange', this.afterPopupStateChange);

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Track the selected Listbox option.
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant
   */
  afterPopupStateChange() {
    // The Popup is newly opened.
    if (this.expanded) {
      /*
       * Focus the target (list) element when the Listbox is shown. Focus
       * remains on the target element, with option selection coming through a
       * combination of the `aria-selected` attribute on the option and the
       * `aria-activedescendant` attribute on the target tracking the active
       * option.
       */
      this.target.focus();

      // Run the setter.
      this.activeDescendant = this.#selectedOption;
    } else {
      /*
       * When the Popup is hidden, the `aria-activedescendant` attribute should
       * be removed from the list and the selected option should be used as the
       * button text.
       */
      this.updateAttribute(this.target, 'aria-activedescendant', null);
      this.controller.textContent = this.activeDescendant.textContent;

      /*
       * If focus is within the Listbox, move focus to the controller. This
       * check is in place to avoid moving focus to the controller if an element
       * outside of the Listbox is clicked.
       */
      if (this.target.contains(document.activeElement)) {
        this.controller.focus();
      }
    }
  }

  /**
   * Prevent the page from scrolling when the arrow keys are used.
   *
   * @param {Event} event The event object.
   */
  preventWindowScroll(event) {
    const { target: keydownTarget, key } = event;

    if (keydownTarget === this.target && ['ArrowUp', 'ArrowDown'].includes(key)) {
      event.preventDefault();
    }
  }

  /**
   * Handle keyup events on the button.
   * Both the arrow up and down keys should show the Listbox popup.
   *
   * @param {Event} event The event object.
   */
  controllerHandleKeyup(event) {
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();

      this.show();
    }
  }

  /**
   * Handle keydown events on the listbox.
   *
   * @param {Event} event The event object.
   */
  targetHandleKeydown(event) {
    const { key } = event;

    // 'Escape' is handled via Popup.
    switch (key) {
      /*
       * Close the Listbox when the Return, Escape, or Spacebar are pressed. No
       * need to update state here; if the Listbox is open rest assured an
       * option is selected.
       */
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this.hide();

        // Move focus to the controller when the Listbox is closed.
        this.controller.focus();

        break;
      }

      /*
       * Select the next or previous Listbox option.
       */
      case 'ArrowUp':
      case 'ArrowDown': {
        const moveTo = ('ArrowUp' === key)
          ? this.activeDescendant.previousElementSibling
          : this.activeDescendant.nextElementSibling;

        if (moveTo) {
          event.preventDefault();

          this.activeDescendant = moveTo;
        }

        break;
      }

      /*
       * Select the first Listbox option.
       */
      case 'Home': {
        event.preventDefault();

        this.activeDescendant = this.firstOption;

        break;
      }

      /*
       * Select the last Listbox option.
       */
      case 'End': {
        event.preventDefault();

        this.activeDescendant = this.lastOption;

        break;
      }

      /*
       * Select the Listbox option based on a search string created by
       * collecting key presses.
       */
      default: {
        const itemToFocus = this.search.getItem(key);
        if (null != itemToFocus) {
          this.activeDescendant = itemToFocus;
        }

        break;
      }
    }
  }

  /**
   * Close the Listbox, but not before updating state to reflect the option that
   * was clicked.
   *
   * @param {Event} event The event object.
   */
  targetHandleClick(event) {
    this.activeDescendant = event.target;
    this.hide();
  }

  /**
   * Close the Listbox when focus is moved away from the target.
   */
  targetHandleBlur() {
    // Use Popup state here, since the Popup drives the Listbox state.
    if (this.state.expanded) {
      this.hide();
    }
  }

  /**
   * If the Listbox is scrollable, and the selected option is not visible,
   * scroll it into view.
   *
   * @param {HTMLElement} moveTo The element getting focus.
   */
  scrollOptionIntoView(moveTo) {
    const { scrollHeight, clientHeight, scrollTop } = this.target;
    const { offsetTop, offsetHeight } = moveTo;

    if (scrollHeight > clientHeight) {
      const scrollBottom = (clientHeight + scrollTop);
      const elementBottom = (offsetTop + offsetHeight);

      if (elementBottom > scrollBottom) {
        this.target.scrollTop = (elementBottom - clientHeight);
      } else if (offsetTop < scrollTop) {
        this.target.scrollTop = offsetTop;
      }
    }
  }

  /**
   * Destroy the Listbox and Popup.
   */
  destroy() {
    // Destroy the Popup.
    super.destroy();

    // Remove list item attributes.
    this.options.forEach((listItem) => this.removeAttributes(listItem));

    // Remove target attributes.
    this.removeAttributes(this.target);

    // Remove event listeners.
    this.controller.removeEventListener('keyup', this.controllerHandleKeyup);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    this.target.removeEventListener('click', this.targetHandleClick);
    this.target.removeEventListener('blur', this.targetHandleBlur);
    window.removeEventListener('keydown', this.preventWindowScroll);

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
