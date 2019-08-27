import AriaComponent from '../AriaComponent';
import Popup from '../Popup';
import { setUniqueId } from '../lib/uniqueId';
import keyCodes from '../lib/keyCodes';

/**
 * Listbox class.
 * Implements a single-select listbox based on WAI-ARIA Authoring Practices 1.1
 *
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
 *
 * @param {Object} config {
 *   @type {HTMLElement} controller The button to activate the Listbox.
 *   @type {HMTLElement} target     The list, comprises Listbox options.
 * }
 */
export default class ListBox extends AriaComponent {
  /**
   * Start the component.
   */
  constructor(config) {
    super(config);

    /**
     * The component name.
     * @type {String}
     */
    this.componentName = 'listbox';

    /**
     * Options shape.
     * @type {Object}
     */
    const options = {
      controller: null,
      target: null,
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    /**
     * Save search characters
     * @type {String}
     */
    this.searchString = '';

    // Bind class methods.
    this.handleControllerKeyup = this.handleControllerKeyup.bind(this);
    this.handleTargetKeydown = this.handleTargetKeydown.bind(this);
    this.handleTargetClicks = this.handleTargetClicks.bind(this);
    this.handleTargetBlur = this.handleTargetBlur.bind(this);
    this.typeAhead = this.typeAhead.bind(this);
    this.clearSearchString = this.clearSearchString.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.popupStateWasUpdated = this.popupStateWasUpdated.bind(this);

    this.init();
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    /**
     * Collect list items.
     * @type {Array}
     */
    this.options = Array.prototype.slice.call(this.target.children, 0);

    /**
     * First [role="option"]
     * @type {HTMLElement}
     */
    const [firstOption] = this.options;

    /**
     * Last [role="option"]
     * @type {HTMLElement}
     */
    const lastOption = this.options[this.options.length - 1];

    // Save first and last option as properties.
    Object.assign(this, { firstOption, lastOption });

    /**
     * Set the `option` role for each list itme and ensure each has a unique ID.
     * The ID here is what will be used to track the active descendant.
     */
    this.options.forEach((listItem) => {
      setUniqueId(listItem);
      listItem.setAttribute('role', 'option');
    });

    /**
     * The default state.
     *
     * The element is saved, rather than just its ID attribute, to remove the
     * need to query the DOM for it each time we need to act on it.
     *
     * @type {HTMLElement}
     */
    this.state.activeDescendant = this.firstOption;

    /**
     * The Listbox is basically a Popup to present a list of options, so we
     * instantiate a Popup and subscribe to state changes to act on the Listbox
     * when the Popup is shown and hidden.
     *
     * @type {Popup}
     */
    this.popup = new Popup({
      controller: this.controller,
      target: this.target,
      type: 'listbox',
      onStateChange: this.popupStateWasUpdated,
    });

    /**
     * Add the 'listbox' role to signify a component that presents a listbox of
     * options from which to select.
     */
    this.target.setAttribute('role', 'listbox');

    /**
     * Set up the target element to allow programatically setting focus to it
     * when the Listbox opens.
     *
     * @see this.stateWasUpdated()
     */
    this.target.setAttribute('tabindex', '-1');

    // Add event listeners.
    this.controller.addEventListener('keyup', this.handleControllerKeyup);
    this.target.addEventListener('keydown', this.handleTargetKeydown);
    this.target.addEventListener('click', this.handleTargetClicks);
    this.target.addEventListener('blur', this.handleTargetBlur);

    // Prevent scrolling when using UP/DOWN arrows on the button
    window.addEventListener('keydown', (event) => {
      const { UP, DOWN } = keyCodes;
      const { target: keydownTarget, keyCode } = event;

      if (keydownTarget === this.controller && [UP, DOWN].includes(keyCode)) {
        event.preventDefault();
      }
    });
  }

  /**
   * Track the selected Listbox option.
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant
   *
   * @param {Object} this.state The current component state.
   */
  stateWasUpdated({ activeDescendant }) {
    /**
     * Remove the `aria-selected` attribute form the previously-selected option
     * and add it to the newly-selected option.
     */
    const selected = this.target.querySelector('[aria-selected="true"]');
    if (null !== selected) {
      selected.removeAttribute('aria-selected');
    }
    activeDescendant.setAttribute('aria-selected', 'true');

    /**
     * Track the newly selected option via the `aria-activedescendant` attribute
     * on the target.
     */
    this.target.setAttribute('aria-activedescendant', activeDescendant.id);

    /**
     * If the selected option is beyond the bounds of the list, scroll it into
     * view. Check this every time state is updated to ensure the selected
     * option is always visible.
     */
    this.scrollOptionIntoView(activeDescendant);
  }

  /**
   * Subscribe to Popup state changes.
   *
   * @param {Object} popup.state The popup state.
   */
  popupStateWasUpdated({ expanded }) {
    const { activeDescendant } = this.state;

    if (expanded) {
      // Update component state.
      this.setState({ activeDescendant });

      /**
       * Focus the target (list) element when the Listbox is shown. Focus
       * remains on the target element, with option selection coming through a
       * combination of the `aria-selected` attribute on the option and the
       * `aria-activedescendant` attribute on the target tracking the active
       * option.
       */
      this.target.focus();
    } else {
      /**
       * When the Popup is hidden, the `aria-activedescendant` attribute should
       * be removed from the list and the selected option should be used as the
       * button text.
       */
      this.target.removeAttribute('aria-activedescendant');
      this.controller.textContent = activeDescendant.textContent;

      /**
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
   * Handle keyup events on the button.
   * Both the UP and DOWN arrow keys should show the Listbox popup.
   *
   * @param {Object} event The event object.
   */
  handleControllerKeyup(event) {
    const { UP, DOWN } = keyCodes;

    if ([UP, DOWN].includes(event.keyCode)) {
      event.preventDefault();
      this.popup.show();
    }
  }

  /**
   * Handle keydown events on the listbox.
   *
   * @param {Object} event The event object.
   */
  handleTargetKeydown(event) {
    const { activeDescendant } = this.state;
    const { keyCode } = event;
    const {
      RETURN,
      ESC,
      UP,
      DOWN,
      SPACE,
      HOME,
      END,
    } = keyCodes;

    switch (keyCode) {
      /**
       * Close the Listbox when the Return, Escape, or Spacebar are pressed. No
       * need to update state here; if the Listbox is open rest assured an
       * option is selected.
       */
      case ESC:
      case RETURN:
      case SPACE: {
        event.preventDefault();
        this.popup.hide();

        // Move focus to the controller when the Listbox is closed.
        this.controller.focus();
        break;
      }

      /**
       * Select the next or previous Listbox option.
       */
      case UP:
      case DOWN: {
        let moveTo = activeDescendant;

        moveTo = (keyCode === UP)
          ? moveTo.previousElementSibling
          : moveTo.nextElementSibling;

        if (moveTo) {
          event.preventDefault();
          this.setState({ activeDescendant: moveTo });
        }
        break;
      }

      /**
       * Select the first Listbox option.
       */
      case HOME: {
        event.preventDefault();
        this.setState({ activeDescendant: this.firstOption });
        break;
      }

      /**
       * Select the last Listbox option.
       */
      case END: {
        event.preventDefault();
        this.setState({ activeDescendant: this.lastOption });
        break;
      }

      /**
       * Select the Listbox option based on a search string created by
       * collecting key presses.
       */
      default: {
        const itemToFocus = this.typeAhead(keyCode);
        if (null !== itemToFocus) {
          this.setState({ activeDescendant: itemToFocus });
        }
        break;
      }
    }
  }

  /**
   * Close the Listbox, but not before updating state to reflect the option that
   * was clicked.
   *
   * @param {Object} event The event object.
   */
  handleTargetClicks(event) {
    this.setState({ activeDescendant: event.target });
    this.popup.hide();
  }

  /**
   * When focus is moved away from the target, update state and close the
   * Listbox.
   *
   * @param {Object} event The event object.
   */
  handleTargetBlur(event) {
    if (this.popup.getState().expanded) {
      this.setState({ activeDescendant: event.target });
      this.popup.hide();
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
      const scrollBottom = clientHeight + scrollTop;
      const elementBottom = offsetTop + offsetHeight;

      if (elementBottom > scrollBottom) {
        this.target.scrollTop = elementBottom - clientHeight;
      } else if (offsetTop < scrollTop) {
        this.target.scrollTop = offsetTop;
      }
    }
  }

  /**
   * Select the Listbox option that matches the search string. If a match is
   * found, return it so that it can be selected.
   *
   * @param {Number} key A keyCode value.
   *
   * @return {(HTMLElement|null)} The matched element or null if no match.
   */
  typeAhead(key) {
    const character = String.fromCharCode(key);

    // Append the new character to the searchString
    this.searchString += character;
    this.clearSearchString();

    // Find the option by matching the search string to the option text.
    const match = Array.prototype
      .slice.call(this.options)
      .filter((option) => {
        const optionText = option.textContent.toLowerCase();
        return 0 === optionText.indexOf(this.searchString.toLowerCase());
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