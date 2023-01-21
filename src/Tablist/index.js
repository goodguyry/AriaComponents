import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import getElementPair from '../lib/getElementPair';

/**
 * Class for implimenting a tabs widget for sectioning content and displaying
 * one at a time.
 *
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
 */
export default class Tablist extends AriaComponent {
  /**
   * The initial active index.
   *
   * @type {Number}
   */
  #activeIndex = 0;

  /**
   * Create a Tablist.
   * @constructor
   *
   * @param {object} options The options object.
   */
  constructor(tabs, options) {
    super(tabs);

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

    // Merge options as instance properties.
    Object.assign(this, options);

    // Bind class methods.
    this.panelHandleKeydown = this.panelHandleKeydown.bind(this);
    this.tabsHandleKeydown = this.tabsHandleKeydown.bind(this);
    this.tabsHandleClick = this.tabsHandleClick.bind(this);
    this.getNextIndex = this.getNextIndex.bind(this);
    this.switchTo = this.switchTo.bind(this);
    this.destroy = this.destroy.bind(this);

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
   * Set the active index and update attributes accordingly.
   *
   * @param {Number} newIndex The index to set as active.
   */
  set activeIndex(newIndex) {
    this.#activeIndex = newIndex;

    // Get the tab currently designated as `aria-selected`.
    const deactivate = this.tabLinks.find((tab) => ('true' === tab.getAttribute('aria-selected')));

    // Get the index; this is essentially the previous `activeIndex` state.
    const deactiveIndex = this.tabLinks.indexOf(deactivate);

    // Deactivate the previously-selected tab.
    this.updateAttribute(deactivate, 'tabindex', '-1');
    this.updateAttribute(deactivate, 'aria-selected', null);

    // Deactivate the previously-active panel.
    this.updateAttribute(this.panels[deactiveIndex], 'aria-hidden', 'true');
    this.updateAttribute(this.panels[deactiveIndex], 'tabindex', null);

    // Prevent tabbing to interactive children of the deactivated panel.
    interactiveChildren(this.panels[deactiveIndex]).forEach((item) => (
      item.setAttribute('tabindex', '-1')
    ));

    // Actvate the newly active tab.
    this.updateAttribute(this.tabLinks[this.activeIndex], 'tabindex', null);
    this.updateAttribute(this.tabLinks[this.activeIndex], 'aria-selected', 'true');

    // Actvate the newly active panel.
    this.updateAttribute(this.panels[this.activeIndex], 'aria-hidden', 'false');
    this.updateAttribute(this.panels[this.activeIndex], 'tabindex', '0');

    // Allow tabbing to the newly-active panel.
    interactiveChildren(this.panels[this.activeIndex]).forEach((item) => (
      item.removeAttribute('tabindex')
    ));

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
  init() {
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
      if (this.activeIndex === index) {
        this.addAttribute(panel, 'tabindex', '0');
        this.addAttribute(panel, 'aria-hidden', 'false');
      } else {
        this.addAttribute(panel, 'aria-hidden', 'true');
      }

      // Listen for panel keydown events.
      panel.addEventListener('keydown', this.panelHandleKeydown);
    });

    // Save the active panel's interactive children.
    this.interactiveChildElements = interactiveChildren(this.panels[this.activeIndex]); // eslint-disable-line max-len

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Returns the next index based on the key pressed.
   *
   * @param  {string} key          The key name.
   * @param  {number} currentIndex The currently event target.
   * @return {number}              The index to which focus should move.
   */
  getNextIndex(key, currentIndex) {
    switch (key) {
      // Move to the first item.
      case 'Home': {
        return 0;
      }

      // Move to previous sibling, or the end if we're moving from the first child.
      case 'ArrowLeft': {
        return (0 === currentIndex) ? this.tabLinksLastIndex : (currentIndex - 1);
      }

      // Move to the next sibling, or the first child if we're at the end.
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
  }

  /**
   * Handle keydown events on the tabpanels.
   *
   * @param {Event} event The event object.
   */
  panelHandleKeydown(event) {
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
  }

  /**
   * Handle tablist key presses.
   *
   * @param {Event} event The event object.
   */
  tabsHandleKeydown(event) {
    const { key, shiftKey, target } = event;
    const currentIndex = this.tabLinks.indexOf(target);
    const nextIndex = this.getNextIndex(key, currentIndex);

    switch (key) {
      /*
       * Move focus from the active tab to the active panel.
       */
      case 'Tab': {
        if (! shiftKey) {
          event.preventDefault();

          this.panels[currentIndex].focus();
        }

        break;
      }

      /*
       * Move to and activate the previous or next tab.
       */
      case 'ArrowLeft':
      case 'ArrowRight': {
        event.preventDefault();

        this.switchTo(nextIndex);
        this.tabLinks[nextIndex].focus();

        break;
      }

      /*
       * Focus the active panel itself with the down arrow.
       */
      case 'ArrowDown': {
        event.preventDefault();

        this.updateAttribute(this.panels[currentIndex], 'tabindex', '0');
        this.panels[currentIndex].focus();

        break;
      }

      /*
       * Select the first Tablist tab.
       */
      case 'Home': {
        event.preventDefault();

        this.switchTo(nextIndex);
        this.tabLinks[nextIndex].focus();

        break;
      }

      /*
       * Select the last Tablist tab.
       */
      case 'End': {
        event.preventDefault();

        this.switchTo(nextIndex);
        this.tabLinks[nextIndex].focus();

        break;
      }

      // fuggitaboutit.
      default:
        break;
    }
  }

  /**
   * Activate the tab panel when a tab is clicked.
   *
   * @param {Event} event The event object.
   */
  tabsHandleClick(event) {
    const { target } = event;
    event.preventDefault();

    // Don't act when an active tab is clicked.
    if (
      'true' !== target.getAttribute('aria-selected')
      && this.tabLinks.includes(target)
    ) {
      this.switchTo(this.tabLinks.indexOf(target));
    }
  }

  /**
   * Switch directly to a tab.
   *
   * @param {number} index The zero-based tab index to activate.
   */
  switchTo(index) {
    this.activeIndex = index;
  }

  /**
   * Destroy the tablist, removing ARIA attributes and event listeners
   */
  destroy() {
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

      // Make sure to allow tabbing to all children of all panels.
      this.interactiveChildElements = interactiveChildren(panel);
      this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));

      panel.removeEventListener(
        'keydown',
        this.panelHandleKeydown
      );
    });

    // Fire the destroy event.
    this.dispatchEventDestroy();
  }
}
