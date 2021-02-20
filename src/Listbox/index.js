import Popup from '../Popup';
import { setUniqueId } from '../lib/uniqueId';
import keyCodes from '../lib/keyCodes';
import Search from '../lib/Search';
import getFirstAndLastItems from '../lib/getFirstAndLastItems';

/**
 * Class to set up an interactive Listbox element.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
 */
export default class ListBox extends Popup {
  /**
   * Create a ListBox.
   * @constructor
   *
   * @param {HTMLElement} controller The activating element.
   * @param {object}      options    The options object.
   */
  constructor(controller, options = {}) {
    // Pass in the `listbox` type.
    super(controller, { type: 'listbox' });

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Listbox';

    this.controller = controller;
    this.target = super.constructor.getTargetElement(controller);

    /**
     * Options shape.
     *
     * @type {object}
     */
    const defaultOptions = {
      /**
       * Callback to run after the component initializes.
       *
       * @callback initCallback
       */
      onInit: () => {},

      /**
       * Callback to run after the component is destroyed.
       *
       * @callback destroyCallback
       */
      onDestroy: () => {},
    };

    // Merge remaining options with defaults and save all as instance properties.
    Object.assign(this, defaultOptions, options);

    // Bind class methods.
    this.preventWindowScroll = this.preventWindowScroll.bind(this);
    this.controllerHandleKeyup = this.controllerHandleKeyup.bind(this);
    this.targetHandleKeydown = this.targetHandleKeydown.bind(this);
    this.targetHandleClick = this.targetHandleClick.bind(this);
    this.targetHandleBlur = this.targetHandleBlur.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    super.init();

    /*
     * A reference to the class instance added to the controller and target
     * elements to enable external interactions with this instance.
     */
    super.setSelfReference([this.controller, this.target]);

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

    /*
     * Set the `option` role for each list itme and ensure each has a unique ID.
     * The ID here is what will be used to track the active descendant.
     */
    this.options.forEach((listItem) => {
      setUniqueId(listItem);
      listItem.setAttribute('role', 'option');
    });

    // Save first and last option as properties.
    const [firstOption, lastOption] = getFirstAndLastItems(this.options);
    Object.assign(this, { firstOption, lastOption });

    /**
     * The initial default state.
     *
     * The element is saved, rather than just its ID attribute, to remove the
     * need to query the DOM for it each time we need to act on it.
     *
     * @type {HTMLElement}
     */
    this.state.activeDescendant = this.firstOption;

    /*
     * Add the 'listbox' role to signify a component that presents a listbox of
     * options from which to select.
     */
    this.target.setAttribute('role', 'listbox');

    /*
     * Set up the target element to allow programatically setting focus to it
     * when the Listbox opens.
     *
     * @see this.stateWasUpdated()
     */
    this.target.setAttribute('tabindex', '-1');

    // Add event listeners.
    this.controller.addEventListener('keyup', this.controllerHandleKeyup);
    this.target.addEventListener('keydown', this.targetHandleKeydown);
    this.target.addEventListener('click', this.targetHandleClick);
    this.target.addEventListener('blur', this.targetHandleBlur);

    // Prevent scrolling when using UP/DOWN arrows on the button
    window.addEventListener('keydown', this.preventWindowScroll);

    // Run {initCallback}
    this.onInit.call(this);
  }

  /**
   * Track the selected Listbox option.
   * https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant
   *
   * @param {string[]} updatedProps The newly-updated state properties.
   */
  stateWasUpdated(updatedProps) {
    const { activeDescendant, expanded } = this.state;

    if (updatedProps.includes('expanded')) {
      super.stateWasUpdated();

      // The Popup is newly opened.
      if (expanded) {
        /*
         * Focus the target (list) element when the Listbox is shown. Focus
         * remains on the target element, with option selection coming through a
         * combination of the `aria-selected` attribute on the option and the
         * `aria-activedescendant` attribute on the target tracking the active
         * option.
         */
        this.target.focus();
      }
    }

    if (expanded) {
      /*
       * Remove the `aria-selected` attribute from the previously-selected option
       * and add it to the newly-selected option.
       */
      const selected = this.target.querySelector('[aria-selected="true"]');
      if (null !== selected) {
        selected.removeAttribute('aria-selected');
      }
      activeDescendant.setAttribute('aria-selected', 'true');

      /*
       * If the selected option is beyond the bounds of the list, scroll it into
       * view. Check this every time state is updated to ensure the selected
       * option is always visible.
       */
      this.scrollOptionIntoView(activeDescendant);

      /*
       * Track the newly selected option via the `aria-activedescendant`
       * attribute on the target.
       */
      this.target.setAttribute('aria-activedescendant', activeDescendant.id);
    } else {
      /*
       * When the Popup is hidden, the `aria-activedescendant` attribute should
       * be removed from the list and the selected option should be used as the
       * button text.
       */
      this.target.removeAttribute('aria-activedescendant');
      this.controller.textContent = activeDescendant.textContent;

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
    const { UP, DOWN } = keyCodes;
    const { target: keydownTarget, keyCode } = event;

    if (keydownTarget === this.target && [UP, DOWN].includes(keyCode)) {
      event.preventDefault();
    }
  }

  /**
   * Handle keyup events on the button.
   * Both the UP and DOWN arrow keys should show the Listbox popup.
   *
   * @param {Event} event The event object.
   */
  controllerHandleKeyup(event) {
    const { UP, DOWN } = keyCodes;

    if ([UP, DOWN].includes(event.keyCode)) {
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
    const { activeDescendant } = this.state;
    const { keyCode } = event;
    const {
      RETURN,
      UP,
      DOWN,
      SPACE,
      HOME,
      END,
    } = keyCodes;

    switch (keyCode) {
      /*
       * Close the Listbox when the Return, Escape, or Spacebar are pressed. No
       * need to update state here; if the Listbox is open rest assured an
       * option is selected.
       */
      // ESC is handled via Popup.
      case RETURN:
      case SPACE: {
        event.preventDefault();
        this.hide();

        // Move focus to the controller when the Listbox is closed.
        this.controller.focus();

        break;
      }

      /*
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

      /*
       * Select the first Listbox option.
       */
      case HOME: {
        event.preventDefault();
        this.setState({ activeDescendant: this.firstOption });

        break;
      }

      /*
       * Select the last Listbox option.
       */
      case END: {
        event.preventDefault();
        this.setState({ activeDescendant: this.lastOption });

        break;
      }

      /*
       * Select the Listbox option based on a search string created by
       * collecting key presses.
       */
      default: {
        const itemToFocus = this.search.getItem(keyCode);
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
   * @param {Event} event The event object.
   */
  targetHandleClick(event) {
    this.setState({ activeDescendant: event.target });
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
   * Destroy the Listbox and Popup.
   */
  destroy() {
    // Destroy the Popup.
    super.destroy();

    // Remove the role attribute from each of the options.
    this.options.forEach((listItem) => {
      listItem.removeAttribute('role');
      listItem.removeAttribute('aria-selected');

      // Remove IDs set by this class.
      if (listItem.getAttribute('id').includes('id_')) {
        listItem.removeAttribute('id');
      }
    });

    // Remove the listbox role.
    this.target.removeAttribute('role');
    this.target.removeAttribute('tabindex');
    this.target.removeAttribute('aria-activedescendant');

    // Remove event listeners.
    this.controller.removeEventListener('keyup', this.controllerHandleKeyup);
    this.target.removeEventListener('keydown', this.targetHandleKeydown);
    this.target.removeEventListener('click', this.targetHandleClick);
    this.target.removeEventListener('blur', this.targetHandleBlur);
    window.removeEventListener('keydown', this.preventWindowScroll);

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
