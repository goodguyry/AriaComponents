import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';

/**
 * Class for implimenting a tabs widget for sectioning content and displaying
 * one at a time.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel
 * https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
 */
export default class Tablist extends AriaComponent {
  /**
   * Create a Tablist.
   * @constructor
   *
   * @param {object} options The options object.
   */
  constructor(tabs, options) {
    super(tabs);

    // Make sure the component element is an unordered list.
    if ('UL' !== tabs.nodeName) {
      AriaComponent.configurationError(
        'Expected component element nodeName to be `UL`'
      );
    }

    /**
     * The string description for this object.
     *
     * @type {string}
     */
    this[Symbol.toStringTag] = 'Tablist';

    this.tabs = tabs;

    // Merge options as instance properties.
    Object.assign(this, options);

    // Bind class methods.
    this.panelHandleKeydown = this.panelHandleKeydown.bind(this);
    this.tabsHandleKeydown = this.tabsHandleKeydown.bind(this);
    this.tabsHandleClick = this.tabsHandleClick.bind(this);
    this.switchTo = this.switchTo.bind(this);
    this.destroy = this.destroy.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);

    this.init();
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    // Intial component state.
    this.state = { activeIndex: 0 };

    /**
     * Collect the anchor inside of each list item, and the panel referenced by
     * the anchor's HREF value.
     *
     * Required tab markup: `<li><a href="PANEL_ID_REF"></a></li>`
     *
     * @type {array}
     */
    const { tabLinks, panels } = Array.from(this.tabs.children)
      .reduce((acc, child) => {
        const tabLink = child.querySelector('a[aria-controls]');

        if (null === tabLink) {
          return acc;
        }

        const panel = document.getElementById(tabLink.hash.replace('#', ''));
        if (null !== panel) {
          return {
            tabLinks: [...acc.tabLinks, tabLink],
            panels: [...acc.panels, panel],
          };
        }

        return acc;
      }, { tabLinks: [], panels: [] });

    // Save the tab links and panels.
    Object.assign(this, {
      /**
       * Tablist anchor elements.
       *
       * @type {array}
       */
      tabLinks,
      /**
       * Tablist panels.
       *
       * @type {array}
       */
      panels,
    });

    // Component state is initially set in the constructor.
    const { activeIndex } = this.state;

    /*
     * The`tablist` role indicates that the list is a container for a set of tabs.
     *
     * https://www.w3.org/TR/wai-aria-1.1/#tablist
     */
    this.addAttribute(this.tabs, 'role', 'tablist');

    /*
     * Prevent the Tablist LI element from being announced as list-items as
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

      if (activeIndex !== index) {
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
      if (activeIndex === index) {
        this.addAttribute(panel, 'tabindex', '0');
        this.addAttribute(panel, 'aria-hidden', 'false');
      } else {
        this.addAttribute(panel, 'aria-hidden', 'true');
      }

      // Listen for panel keydown events.
      panel.addEventListener('keydown', this.panelHandleKeydown);
    });

    // Save the active panel's interactive children.
    this.interactiveChildElements = interactiveChildren(this.panels[activeIndex]); // eslint-disable-line max-len

    // Fire the init event.
    this.dispatchEventInit();
  }

  /**
   * Update tab and panel attributes based on component state.
   *
   * @param {object} state The component state.
   * @param {number} state.activeIndex The active index of both tabs and panels.
   */
  stateWasUpdated() {
    const { activeIndex } = this.state;

    // Get the tab currently designated as `aria-selected`.
    const deactivate = this.tabLinks.find((tab) => 'true' === tab.getAttribute('aria-selected'));

    // Get the index; this is essentially the previous `activeIndex` state.
    const deactiveIndex = this.tabLinks.indexOf(deactivate);

    // Deactivate the previously-selected tab.
    this.updateAttribute(deactivate, 'tabindex', '-1');
    this.updateAttribute(deactivate, 'aria-selected', null);

    // Deactivate the previously-active panel.
    this.updateAttribute(this.panels[deactiveIndex], 'aria-hidden', 'true');
    this.updateAttribute(this.panels[deactiveIndex], 'tabindex', null);

    // Prevent tabbing to interactive children of the deactivated panel.
    const deactiveChildren = interactiveChildren(this.panels[deactiveIndex]);
    deactiveChildren.forEach((item) => item.setAttribute('tabindex', '-1'));

    // Actvate the newly active tab.
    this.updateAttribute(this.tabLinks[activeIndex], 'tabindex', null);
    this.updateAttribute(this.tabLinks[activeIndex], 'aria-selected', 'true');

    // Actvate the newly active panel.
    this.updateAttribute(this.panels[activeIndex], 'aria-hidden', 'false');
    this.updateAttribute(this.panels[activeIndex], 'tabindex', '0');

    // Allow tabbing to the newly-active panel.
    this.interactiveChildElements = interactiveChildren(this.panels[activeIndex]); // eslint-disable-line max-len
    this.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
  }

  /**
   * Handle keydown events on the tabpanels.
   *
   * @param {Event} event The event object.
   */
  panelHandleKeydown(event) {
    const { activeIndex } = this.state;
    const { key, shiftKey } = event;
    const { activeElement } = document;
    const [firstInteractiveChild] = this.interactiveChildElements;

    if ('Tab' === key && shiftKey) {
      if (activeElement === this.panels[activeIndex]) {
        event.preventDefault();
        this.tabLinks[activeIndex].focus();
      } else if (activeElement === firstInteractiveChild) {
        /*
         * Ensure navigating with Shift-Tab from the first interactive child of
         * the active panel returns focus to the active panel.
         */
        event.preventDefault();
        this.panels[activeIndex].focus();
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
        const activeIndex = this.tabLinks.indexOf(target);
        const menuLastIndex = (this.tabLinks.length - 1);

        let nextIndex = 0;

        // Move to previous sibling.
        if ('ArrowLeft' === key) {
          // Move to the end if we're moving from the first child.
          nextIndex = (0 === activeIndex) ? menuLastIndex : (activeIndex - 1);
        }

        // Move to the next sibling.
        if ('ArrowRight' === key) {
          // Move to first child if we're at the end.
          nextIndex = (menuLastIndex === activeIndex) ? 0 : (activeIndex + 1);
        }

        const nextItem = this.tabLinks[nextIndex];

        if (nextItem) {
          event.preventDefault();

          this.switchTo(this.tabLinks.indexOf(nextItem));
          nextItem.focus();
        }

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
        this.switchTo(0);
        this.tabLinks[0].focus();

        break;
      }

      /*
       * Select the last Tablist tab.
       */
      case 'End': {
        event.preventDefault();
        const lastIndex = this.tabLinks.length - 1;
        this.switchTo(lastIndex);
        this.tabLinks[lastIndex].focus();

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
    this.setState({ activeIndex: index });
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
