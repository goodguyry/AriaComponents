import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import { setUniqueId } from '../lib/uniqueId';
import rovingTabIndex from '../lib/rovingTabIndex';
import keyCodes from '../lib/keyCodes';

/**
 * Manage tablist elements
 */
export default class TabList extends AriaComponent {
  constructor(config) {
    super();

    if ('UL' !== config.tablist.nodeName) {
      // @todo Maybe throw an error here?
      return;
    }

    /**
     * The component name.
     * @type {String}
     */
    this.componentName = 'tablist';

    /**
     * Options shape.
     * @type {Object}
     */
    const options = {
      tablist: null,
      panels: null,
    };

    // Merge config options with defaults.
    Object.assign(this, options, config);

    // Default state.
    this.state.activeIndex = 0;

    // Bind class methods
    this.handleTabKeydown = this.handleTabKeydown.bind(this);
    this.handleTabsKeydown = this.handleTabsKeydown.bind(this);
    this.handleTabsClick = this.handleTabsClick.bind(this);
    this.switchTo = this.switchTo.bind(this);
    this.destroy = this.destroy.bind(this);

    /**
     * TabList panels
     * @type {Array}
     */
    this.panels = Array.prototype.slice.call(this.panels);

    /**
     * Collect the anchor inside of each list item.
     * Required markup is `<li><a href=""></a></li>`
     * @type {Array}
     */
    this.tabs = Array.prototype.filter.call(
      this.tablist.children,
      (child) => null !== child.querySelector('a[href]')
    )
      .map((child) => child.querySelector('a[href]'));

    // Only initialize if tabs aren panels are equal in number.
    if (this.tabs.length === this.panels.length) {
      this.init();
    }
  }

  /**
   * Add necessary attributes and event listeners; collect interactive elements.
   */
  init() {
    const { activeIndex } = this.state;

    // The list gets the `tablist` role.
    this.tablist.setAttribute('role', 'tablist');

    // Each of the list items are now presentational.
    Array.prototype.forEach.call(this.tablist.children, (listChild) => {
      if ('LI' === listChild.nodeName) {
        listChild.setAttribute('role', 'presentation');
      }
    });

    this.tabs.forEach((tab, index) => {
      // Ensure each tab has an ID.
      setUniqueId(tab);
      // Add the `tab` role.
      tab.setAttribute('role', 'tab');

      if (activeIndex !== index) {
        // Don't allow focus on inactive tabs.
        tab.setAttribute('tabindex', '-1');
      } else {
        // Set up the selected tab.
        tab.setAttribute('aria-selected', 'true');
      }
    });

    this.tablist.addEventListener('click', this.handleTabsClick);
    this.tablist.addEventListener('keydown', this.handleTabsKeydown);

    this.panels.forEach((panel, index) => {
      // Ensure each panel has an ID.
      setUniqueId(panel);
      // Add the `tabpanel` role.
      panel.setAttribute('role', 'tabpanel');
      // Create a relationship between the tab and its panel.
      panel.setAttribute('aria-labelledby', this.tabs[index].id);
      // All but the first tab should be hidden by default.
      panel.setAttribute('aria-hidden', `${activeIndex !== index}`);
      // Listen for panel keydown events.
      panel.addEventListener('keydown', this.handleTabKeydown);
    });

    // Save the active panel's interactive children.
    this.interactiveChildren = interactiveChildren(this.panels[activeIndex]);
  }

  /**
   * Update tab and panel attributes based on new state.
   *
   * @param {Object} state The component state.
   */
  stateWasUpdated({ activeIndex }) {
    const [deactivate] = this.tabs.filter((tab) => (
      'true' === tab.getAttribute('aria-selected')
    ));
    const deactiveIndex = this.tabs.indexOf(deactivate);

    // Deactivate the previously-selected tab.
    deactivate.setAttribute('tabindex', '-1');
    deactivate.removeAttribute('aria-selected');
    this.panels[deactiveIndex].setAttribute('aria-hidden', 'true');

    const deactiveChildren = interactiveChildren(this.panels[deactiveIndex]);
    // Prevent tabbing to interactive children of the deactivated panel.
    rovingTabIndex(deactiveChildren);

    // Actvate the newly active tab.
    this.tabs[activeIndex].removeAttribute('tabindex');
    this.tabs[activeIndex].setAttribute('aria-selected', 'true');
    this.panels[activeIndex].setAttribute('aria-hidden', 'false');

    // Allow tabbing to the newly-active panel.
    this.interactiveChildren = interactiveChildren(this.panels[activeIndex]);
    rovingTabIndex(this.interactiveChildren, this.interactiveChildren);
  }

  /**
   * Handle keydown events on the tabpanels.
   *
   * @param {Object} event The event object.
   */
  handleTabKeydown(event) {
    const { TAB } = keyCodes;
    const { keyCode, shiftKey } = event;

    // Shift-TAB from the active panel's first interactive element.
    if (keyCode === TAB && shiftKey) {
      // eslint-disable-next-line max-len
      const focusIndex = this.interactiveChildren.indexOf(document.activeElement);
      const [theTab] = this.tabs.filter(
        (tab) => tab.hasAttribute('aria-selected')
      );

      // This is the first interactive child element and there is an active tab.
      if (0 === focusIndex && null !== theTab) {
        event.preventDefault();
        theTab.focus();
      }
    }
  }

  /**
   * Handle tablist key presses.
   *
   * @param {Object} event The event object.
   */
  handleTabsKeydown(event) {
    const {
      TAB,
      LEFT,
      RIGHT,
      DOWN,
    } = keyCodes;
    const { keyCode, shiftKey, target } = event;
    const currentIndex = this.tabs.indexOf(target);

    if (keyCode === TAB && ! shiftKey && this.interactiveChildren.length) {
      event.preventDefault();
      // Move focus from the active tab to the active panel's first child.
      this.interactiveChildren[0].focus();
    } else if ([LEFT, RIGHT, DOWN].includes(keyCode)) {
      // Navigate through tablist with arrow keys.
      if ([LEFT, RIGHT].includes(keyCode)) {
        const newIndex = (LEFT === keyCode)
          ? currentIndex - 1
          : currentIndex + 1;

        if (undefined !== this.tabs[newIndex]) {
          event.preventDefault();
          this.switchTo(newIndex);
          this.tabs[newIndex].focus();
        }
      } else if (DOWN === keyCode) {
        // Focus the active panel itself with the down arrow.
        event.preventDefault();
        this.panels[currentIndex].setAttribute('tabindex', '-1');
        this.panels[currentIndex].focus();
      }
    }
  }

  /**
   * Toggle tabs/panels.
   *
   * @param {Object} event The event object.
   */
  handleTabsClick(event) {
    const { target } = event;
    event.preventDefault();

    // Don't act when an active tab is clicked.
    if ('true' !== target.getAttribute('aria-selected')) {
      const index = this.tabs.indexOf(target);
      this.switchTo(index);
    }
  }

  /**
   * Switch directly to a tab.
   *
   * @param  {Number} index The zero-based tab index to activate.
   */
  switchTo(index) {
    this.setState({ activeIndex: index });
  }

  /**
   * Destroy the tablist, removing ARIA attributes and event listeners
   */
  destroy() {
    this.tablist.removeAttribute('role');

    Array.prototype.forEach.call(this.tablist.children, (listChild) => {
      if ('LI' === listChild.nodeName) {
        listChild.removeAttribute('role');
      }
    });

    this.tabs.forEach((tab) => {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');

      tab.removeEventListener('click', this.handleTabsClick);
      tab.removeEventListener('keydown', this.handleTabsKeydown);
    });

    this.panels.forEach((panel) => {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-hidden');

      const interactiveChildElements = interactiveChildren(panel);
      rovingTabIndex(interactiveChildElements, interactiveChildElements);

      panel.removeEventListener(
        'keydown',
        this.handleTabKeydown
      );
    });
  }
}
