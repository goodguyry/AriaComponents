import AriaComponent from '../AriaComponent';
import Search from './Search';
import getElementPair from '../shared/getElementPair';

/**
 * Class to set up an interactive Listbox element.
 *
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
export default class ListBox extends AriaComponent {
  /**
   * Initial expanded state.
   * @private
   *
   * @type {Boolean}
   */
  #expanded = false;

  /**
   * The initial selected option.
   * @private
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
    super(element, options);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Listbox';

    // Get the component elements.
    const { controller, target } = getElementPair(element);
    this.controller = controller;
    this.target = target;

    /**
     * Saves the initial button label.
     *
     * @type {String}
     */
    this.buttonLabel = this.controller.textContent;

    // Bind class methods.
    this.windowHandleKeydown = this.windowHandleKeydown.bind(this);
    this.controllerHandleClick = this.controllerHandleClick.bind(this);
    this.controllerHandleKeyup = this.controllerHandleKeyup.bind(this);
    this.controllerHandleKeydown = this.controllerHandleKeydown.bind(this);
    this.targetHandleKeydown = this.targetHandleKeydown.bind(this);
    this.targetHandleClick = this.targetHandleClick.bind(this);
    this.targetHandleBlur = this.targetHandleBlur.bind(this);
    this.bodyHandleClick = this.bodyHandleClick.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Update the component attributes based on new state.
   */
  set expanded(newState) {
    // Update state.
    this.#expanded = newState;

    this.updateAttribute(this.controller, 'aria-expanded', this.expanded);
    this.updateAttribute(this.target, 'aria-hidden', (! this.expanded));

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
       * When the Listbox is hidden, the `aria-activedescendant` attribute should
       * be removed from the list and the selected option should be used as the
       * button text.
       */
      this.updateAttribute(this.target, 'aria-activedescendant', null);
      this.controller.textContent = this.activeDescendant?.textContent;

      /*
       * If focus is within the Listbox, move focus to the controller. This
       * check is in place to avoid moving focus to the controller if an element
       * outside of the Listbox is clicked.
       */
      if (this.target.contains(document.activeElement)) {
        this.controller.focus();
      }
    }

    this.dispatch(
      'stateChange',
      {
        instance: this,
        expanded: this.expanded,
      }
    );
  }

  /**
   * Get expanded state.
   *
   * @return {bool}
   */
  get expanded() {
    return this.#expanded;
  }

  /**
   * Set the active descendant and update attributes accordingly.
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant
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

    // Add controller attributes
    this.addAttribute(this.controller, 'aria-expanded', 'false');

    /*
     * Set the taget as hidden by default. Using the `aria-hidden` attribute,
     * rather than the `hidden` attribute, means authors must hide the target
     * element via CSS.
     */
    this.addAttribute(this.target, 'aria-hidden', 'true');

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
    this.controller.addEventListener('click', this.controllerHandleClick);
    this.controller.addEventListener('keydown', this.controllerHandleKeydown);
    this.controller.addEventListener('keyup', this.controllerHandleKeyup);
    this.target.addEventListener('blur', this.targetHandleBlur);
    this.target.addEventListener('click', this.targetHandleClick);
    this.target.addEventListener('keydown', this.targetHandleKeydown);
    document.body.addEventListener('click', this.bodyHandleClick);

    // Prevent scrolling when using arrow up/down on the button.
    window.addEventListener('keydown', this.windowHandleKeydown);

    // Install modules.
    this.initModules();

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Prevent the page from scrolling when the arrow keys are used.
   *
   * @param {Event} event The event object.
   */
  windowHandleKeydown(event) {
    const { target: keydownTarget, key } = event;

    if (keydownTarget === this.target && ['ArrowUp', 'ArrowDown'].includes(key)) {
      event.preventDefault();
    }
  }

  /**
   * Show the Listbox when the controller is clicked.
   *
   * @param {Event} event The event object.
   */
  controllerHandleClick(event) {
    event.preventDefault();

    this.toggle();
  }

  /**
   * Handle keyup events on the button.
   * Both the arrow up and down keys should show the Listbox.
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
   * Handle keydown events on the Listbox controller.
   *
   * @param {Event} event The event object.
   */
  controllerHandleKeydown(event) {
    const { key } = event;

    if (this.expanded && 'Escape' === key) {
      event.preventDefault();

      /*
       * Close the Listbox when the Escape key is pressed. Because focus is not
       * inside the target (based on the fact that the event was fired on the
       * controller), there's no need to move focus.
       */
      this.hide();
    }
  }

  /**
   * Handle keydown events on the listbox.
   *
   * @param {Event} event The event object.
   */
  targetHandleKeydown(event) {
    const { key, shiftKey } = event;
    const { activeElement } = document;

    switch (key) {
      case 'Escape': {
        if (this.expanded) {
          event.preventDefault();

          /*
           * Close the Listbox when the Escape key is pressed.
           */
          this.hide();

          /*
           * Because the activeElement is within the Listbox, move focus to the
           * Listbox controller to avoid the confusion of focus being within a
           * hidden element.
           */
          this.controller.focus();
        }

        break;
      }

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

      case 'Tab': {
        if (! shiftKey && this.target === activeElement) {
          /*
           * Close the Listbox when tabbing from the target.
           */
          this.hide();
        }

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
    if (this.expanded) {
      this.hide();
    }
  }

  /**
   * Close the Listbox when clicking anywhere outside of the target or controller
   * elements.
   *
   * @param {Event} event The event object.
   */
  bodyHandleClick(event) {
    const { target: eventTarget } = event;

    if (
      this.expanded
      && eventTarget !== this.controller
      && ! this.target.contains(eventTarget)
    ) {
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
   * Update component state to show the target element.
   */
  show() {
    this.expanded = true;
  }

  /**
   * Update component state to hide the target element.
   */
  hide() {
    this.expanded = false;
  }

  /**
   * Toggle the Listbox state.
   */
  toggle() {
    this.expanded = (! this.expanded);
  }

  /**
   * Destroy the Listbox.
   */
  destroy() {
    // Remove attributes.
    this.removeAttributes(this.controller);
    this.removeAttributes(this.target);

    // Reset initial state.
    this.#expanded = false;
    this.#selectedOption = null;

    // Remove list item attributes.
    this.options.forEach((listItem) => this.removeAttributes(listItem));

    // Remove target attributes.
    this.removeAttributes(this.target);

    this.controller.textContent = this.buttonLabel;

    // Remove event listeners.
    this.controller.removeEventListener('click', this.controllerHandleClick);
    this.controller.removeEventListener('keydown', this.controllerHandleKeydown);
    this.controller.removeEventListener('keyup', this.controllerHandleKeyup);
    this.target.removeEventListener('blur', this.targetHandleBlur);
    this.target.removeEventListener('click', this.targetHandleClick);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    document.body.removeEventListener('click', this.bodyHandleClick);
    window.removeEventListener('keydown', this.windowHandleKeydown);

    // Cleanup after modules.
    this.cleanupModules();

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
