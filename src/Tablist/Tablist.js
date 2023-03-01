import AriaComponent from '../AriaComponent';
import getElementPair from '../shared/getElementPair';
import { hasInteractiveChildren } from '../shared/interactiveChildren';

/**
 * Class for implimenting a tabs widget for sectioning content and displaying
 * one at a time.
 *
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
 */
export default class Tablist extends AriaComponent {
  /**
   * The tablist orientation.
   */
  #orientation = 'horizontal';

  /**
   * The initial active index.
   *
   * @type {Number}
   */
  #activeIndex = 0;

  /**
   * The previously-active index.
   *
   * @type {Number}
   */
  #switchedFrom = null;

  /**
   * Create a Tablist.
   * @constructor
   *
   * @param {HTMLUListElement} tabs    The tabs list.
   * @param {object}           options The options object.
   */
  constructor(tabs, options = {}) {
    super(tabs, options);

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Tablist';

    /**
     * The list element containing tab links
     *
     * @type {HTMLULElement|HTMLOLElement}
     */
    this.tabs = tabs;

    /**
     * Tablist anchor elements.
     *
     * @type {array}
     */
    this.tabLinks = [];

    /**
     * Tablist panels.
     *
     * @type {array}
     */
    this.panels = [];

    // Merge options with default values.
    const { orientation } = {
      /**
       * Whether the tabs are horizonally or vertically oriented.
       * Options: 'horizontal', 'vertical'.
       *
       * @type {String}
       */
      orientation: this.#orientation,

      ...options,
    };

    /**
     * Set the orientation.
     */
    this.orientation = orientation;

    // Make sure the component element is a list.
    if (['UL', 'OL'].includes(tabs.nodeName)) {
      this.init();
    } else {
      AriaComponent.configurationError(
        'Expected component element nodeName to be `UL`'
      );
    }
  }

  /**
   * Set the tablist orientation.
   *
   * @param {string} newOrientation The expected `aria-orientation` value.
   *                                Default is 'horizontal'.
   */
  set orientation(newOrientation) {
    this.#orientation = ('vertical' === newOrientation) ? newOrientation : 'horizontal';

    this.updateAttribute(this.tabs, 'aria-orientation', this.orientation);
  }

  /**
   * Returns the tablist orientation.
   *
   * @return {string}
   */
  get orientation() {
    return this.#orientation;
  }

  /**
   * Set the last-active index and update attributes accordingly.
   *
   * @param {Number} previousIndex The previous index.
   */
  set #previousIndex(previousIndex) {
    this.#switchedFrom = previousIndex;

    // Get the tab currently designated as `aria-selected`.
    const deactivatedTab = this.tabLinks[this.previousIndex];
    const deactivatedPanel = this.panels[this.previousIndex];

    // Deactivate the previously-selected tab.
    this.updateAttribute(deactivatedTab, 'tabindex', '-1');
    this.updateAttribute(deactivatedTab, 'aria-selected', 'false');

    // Deactivate the previously-active panel.
    this.updateAttribute(deactivatedPanel, 'aria-hidden', 'true');
  }

  /**
   * Get the previously-avtive index.
   *
   * @return {Number}
   */
  get previousIndex() {
    return this.#switchedFrom;
  }

  /**
   * Set the active index and update attributes accordingly.
   *
   * @param {Number} newIndex The index to set as active.
   */
  set activeIndex(newIndex) {
    // Deactivate the previous tab-panel pair.
    this.#previousIndex = this.#activeIndex;
    // Activate the current tab-panel pair.
    this.#activeIndex = newIndex;

    const activeTab = this.tabLinks[this.activeIndex];
    const activePanel = this.panels[this.activeIndex];

    // Actvate the newly active tab.
    this.updateAttribute(activeTab, 'tabindex', null);
    this.updateAttribute(activeTab, 'aria-selected', 'true');

    // Actvate the newly active panel.
    this.updateAttribute(activePanel, 'aria-hidden', 'false');

    this.dispatch(
      'stateChange',
      {
        instance: this,
        activeIndex: this.activeIndex,
      }
    );
  }

  /**
   * Get the active index.
   *
   * @return {Number}
   */
  get activeIndex() {
    return this.#activeIndex;
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init = () => {
    const listItems = Array.from(this.tabs.children);
    const listItemsLength = listItems.length;

    /**
     * Collect the anchor inside of each list item, and the panel referenced by
     * the anchor's `aria-controls` value.
     *
     * Required tab markup: `<li><a aria-controls="PANEL_ID_REF"></a></li>`
     *
     * @type {array}
     */
    for (let i = 0; i < listItemsLength; i += 1) {
      const child = listItems[i];
      const tabLink = child.querySelector('[aria-controls]');

      if (null !== tabLink) {
        const { controller, target } = getElementPair(tabLink);

        this.tabLinks.push(controller);
        this.panels.push(target);
      }
    }

    /**
     * The final tab link index.
     *
     * @type {number}
     */
    this.tabLinksLastIndex = (this.tabLinks.length - 1);

    /*
     * The`tablist` role indicates that the list is a container for a set of tabs.
     *
     * https://www.w3.org/TR/wai-aria-1.1/#tablist
     */
    this.addAttribute(this.tabs, 'role', 'tablist');

    /*
     * Prevent the Tablist LI element from being announced as list-item, as
     * that information is neither useful nor applicable.
     */
    Array.from(this.tabs.children).forEach((listChild) => {
      if ('LI' === listChild.nodeName) {
        this.addAttribute(listChild, 'role', 'presentation');
      }
    });

    // Set attributes for each tab.
    this.tabLinks.forEach((tab, index) => {
      // Add the `tab` role to indicate its relationship to the Tablist.
      this.addAttribute(tab, 'role', 'tab');

      if (this.activeIndex !== index) {
        // Don't allow focus on inactive tabs.
        this.addAttribute(tab, 'tabindex', '-1');
        // All inactive tab elements have aria-selected set to false.
        this.addAttribute(tab, 'aria-selected', 'false');
      } else {
        // Set the first tab as selected by default.
        this.addAttribute(tab, 'aria-selected', 'true');
      }
    });

    // Add event listeners.
    this.tabs.addEventListener('click', this.tabsHandleClick);
    this.tabs.addEventListener('keydown', this.tabsHandleKeydown);

    // Set attributes or each panel.
    this.panels.forEach((panel, index) => {
      // Add the `tabpanel` role to indicate its relationship to the tablist.
      this.addAttribute(panel, 'role', 'tabpanel');

      // Create a relationship between the tab and its panel.
      this.addAttribute(panel, 'aria-labelledby', this.tabLinks[index].id);

      // All but the first tab should be hidden by default.
      this.addAttribute(panel, 'aria-hidden', (this.activeIndex !== index));

      if (! hasInteractiveChildren(panel)) {
        this.addAttribute(panel, 'tabindex', '0');
      }

      // Listen for panel keydown events.
      panel.addEventListener('keydown', this.panelHandleKeydown);
    });

    // Install modules.
    this.initModules();

    // Fire the init event.
    this.dispatchEventInit();
  };

  /**
   * Returns the next index based on the key pressed.
   *
   * @param  {string} key          The key name.
   * @param  {number} currentIndex The currently event target.
   * @return {number}              The index to which focus should move.
   */
  getNextIndex = (key, currentIndex) => {
    switch (key) {
      // Move to the first item.
      case 'Home': {
        return 0;
      }

      // Move to previous sibling, or the end if we're moving from the first child.
      case 'ArrowUp':
      case 'ArrowLeft': {
        return (0 === currentIndex) ? this.tabLinksLastIndex : (currentIndex - 1);
      }

      // Move to the next sibling, or the first child if we're at the end.
      case 'ArrowDown':
      case 'ArrowRight': {
        return (this.tabLinksLastIndex === currentIndex) ? 0 : (currentIndex + 1);
      }

      // Move to the last item.
      case 'End': {
        return this.tabLinksLastIndex;
      }

      default:
        // Do nothing.
        return undefined;
    }
  };

  /**
   * Handle keydown events on the tabpanels.
   *
   * @param {Event} event The event object.
   */
  panelHandleKeydown = (event) => {
    const { key, shiftKey } = event;
    const { activeElement } = document;
    const [firstInteractiveChild] = this.interactiveChildElements;

    if ('Tab' === key && shiftKey) {
      if (activeElement === this.panels[this.activeIndex]) {
        event.preventDefault();
        this.tabLinks[this.activeIndex].focus();
      } else if (activeElement === firstInteractiveChild) {
        /*
         * Ensure navigating with Shift-Tab from the first interactive child of
         * the active panel returns focus to the active panel.
         */
        event.preventDefault();
        this.panels[this.activeIndex].focus();
      }
    }
  };

  /**
   * Handle tablist key presses.
   *
   * @param {Event} event The event object.
   */
  tabsHandleKeydown = (event) => {
    const { key, target } = event;
    const currentIndex = this.tabLinks.indexOf(target);
    const nextIndex = this.getNextIndex(key, currentIndex);

    switch (key) {
      /*
       * Move to the previous or next tab when horizontally oriented.
       */
      case 'ArrowLeft':
      case 'ArrowRight': {
        if ('horizontal' === this.orientation) {
          event.preventDefault();

          this.tabLinks[nextIndex].focus();
        }
        break;
      }

      /*
       * Move to the previous or next tab when vertically oriented.
       */
      case 'ArrowUp':
      case 'ArrowDown': {
        if ('vertical' === this.orientation) {
          event.preventDefault();

          this.tabLinks[nextIndex].focus();
        }
        break;
      }

      /*
       * Select the first Tablist tab.
       */
      case 'Home': {
        event.preventDefault();

        this.tabLinks[nextIndex].focus();
        break;
      }

      /*
       * Select the last Tablist tab.
       */
      case 'End': {
        event.preventDefault();

        this.tabLinks[nextIndex].focus();
        break;
      }

      /*
       * Activate the tab.
       */
      case ' ':
      case 'Enter': {
        const targetIndex = this.tabLinks.indexOf(target);

        // Don't act when the tab is already active.
        if (
          targetIndex !== this.activeIndex
          && this.tabLinks.includes(target)
        ) {
          event.preventDefault();

          this.switchTo(targetIndex);
        }
        break;
      }

      // fuggitaboutit.
      default:
        break;
    }
  };

  /**
   * Activate the tab panel when a tab is clicked.
   *
   * @param {Event} event The event object.
   */
  tabsHandleClick = (event) => {
    event.preventDefault();

    const { target } = event;
    const targetIndex = this.tabLinks.indexOf(target);

    // Don't act when the tab is already active.
    if (
      targetIndex !== this.activeIndex
      && this.tabLinks.includes(target)
    ) {
      this.switchTo(targetIndex);
    }
  };

  /**
   * Switch directly to a tab.
   *
   * @param {number} index The zero-based tab index to activate.
   */
  switchTo = (index) => {
    this.activeIndex = index;
  };

  /**
   * Destroy the tablist, removing ARIA attributes and event listeners
   */
  destroy = () => {
    // Remove the tablist role.
    this.removeAttributes(this.tabs);

    // Remove the 'presentation' role from each list item.
    Array.from(this.tabs.children).forEach((listChild) => {
      if ('LI' === listChild.nodeName) {
        this.removeAttributes(listChild);
      }
    });

    // Remove tab attributes and event listeners.
    this.tabLinks.forEach((tab) => {
      this.removeAttributes(tab);

      tab.removeEventListener('click', this.tabsHandleClick);
      tab.removeEventListener('keydown', this.tabsHandleKeydown);
    });

    // Remove panel attributes and event listeners.
    this.panels.forEach((panel) => {
      this.removeAttributes(panel);

      panel.removeEventListener(
        'keydown',
        this.panelHandleKeydown
      );
    });

    // Cleanup after modules.
    this.cleanupModules();

    // Fire the destroy event.
    this.dispatchEventDestroy();
  };
}
