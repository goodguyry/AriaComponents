import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import { setUniqueId } from '../lib/uniqueId';
import { tabIndexDeny, tabIndexAllow } from '../lib/rovingTabIndex';
import { nextPreviousFromLeftRight } from '../lib/nextPrevious';
import keyCodes from '../lib/keyCodes';

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
   * @param {object} config The config object.
   */
  constructor(config) {
    super();

    /**
     * The component name.
     *
     * @type {string}
     */
    this.componentName = 'Tablist';

    // Warn about deprecated config value.
    if (config.tablist) {
      const { tablist } = config;
      Object.assign(config, { tabs: tablist, tablist: undefined });

      this.warnDeprecated('config.tablist', 'config.tabs');
    }

    // The tabs element is required to be a UL.
    if ('UL' !== config.tabs.nodeName) {
      // eslint-disable-next-line no-console
      console.warn('Tablist requires a <ul> for the tabs.');
      return;
    }

    /**
     * Component configuration options.
     *
     * @type {object}
     */
    const options = {
      /**
       * The UL parent of the Tablist tabs.
       *
       * @type {HTMLUListElement}
       */
      list: null,

      /**
       * The Tablist panel elements.
       *
       * @type {NodeList}
       */
      panels: null,

      /**
       * Callback to run after the component initializes.
       *
       * @callback initCallback
       */
      onInit: () => {},

      /**
       * Callback to run after component state is updated.
       *
       * @callback stateChangeCallback
       */
      onStateChange: () => {},

      /**
       * Callback to run after the component is destroyed.
       *
       * @callback destroyCallback
       */
      onDestroy: () => {},
    };

    // Save references to the tablist and panels.
    Object.assign(this, options, config);

    // Intial component state.
    this.state = { activeIndex: 0 };

    // Bind class methods.
    this.handlePanelKeydown = this.handlePanelKeydown.bind(this);
    this.handleTabsKeydown = this.handleTabsKeydown.bind(this);
    this.handleTabsClick = this.handleTabsClick.bind(this);
    this.switchTo = this.switchTo.bind(this);
    this.destroy = this.destroy.bind(this);
    this.stateWasUpdated = this.stateWasUpdated.bind(this);

    /**
     * Tablist panels.
     *
     * @type {array}
     */
    if (! Array.isArray(this.panels)) {
      this.panels = Array.prototype.slice.call(this.panels);
    }

    /**
     * Collect the anchor inside of each list item. Using anchors makes
     * providing a non-JS fallback as simple as using the associated tabpanel's
     * ID attribute as the link's HREF.
     *
     * Required tab markup: `<li><a href=""></a></li>`
     *
     * @type {array}
     */
    this.tabLinks = Array.prototype.filter.call(
      this.tabs.children,
      (child) => null !== child.querySelector('a[href]')
    )
      .map((child) => child.querySelector('a[href]'));

    // Only initialize if tabs and panels are equal in number.
    if (this.tabLinks.length === this.panels.length) {
      this.init();
    }
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    // Component state is initially set in the constructor.
    const { activeIndex } = this.state;

    /*
     * The`tablist` role indicates that the list is a container for a set of tabs.
     *
     * https://www.w3.org/TR/wai-aria-1.1/#tablist
     */
    this.tabs.setAttribute('role', 'tablist');

    /*
     * Prevent the Tablist LI element from being announced as list-items as
     * that information is neither useful nor applicable.
     */
    Array.prototype.forEach.call(this.tabs.children, (listChild) => {
      if ('LI' === listChild.nodeName) {
        listChild.setAttribute('role', 'presentation');
      }
    });

    // Set attributes for each tab.
    this.tabLinks.forEach((tab, index) => {
      /*
       * A reference to the class instance added to the controller and target
       * elements to enable external interactions with this instance.
       */
      super.setSelfReference([tab]);

      // Ensure each tab has an ID.
      setUniqueId(tab);
      // Add the `tab` role to indicate its relationship to the Tablist.
      tab.setAttribute('role', 'tab');

      if (activeIndex !== index) {
        // Don't allow focus on inactive tabs.
        tab.setAttribute('tabindex', '-1');
      } else {
        // Set the first tab as selected by default.
        tab.setAttribute('aria-selected', 'true');
      }

      tab.setAttribute('aria-controls', this.panels[index].id);
    });

    // Add event listeners.
    this.tabs.addEventListener('click', this.handleTabsClick);
    this.tabs.addEventListener('keydown', this.handleTabsKeydown);

    // Set attributes or each panel.
    this.panels.forEach((panel, index) => {
      /*
       * Add a reference to the class instance to enable external interactions
       * with this instance.
       */
      super.setSelfReference([panel]);

      // Ensure each panel has an ID.
      setUniqueId(panel);
      // Add the `tabpanel` role to indicate its relationship to the tablist.
      panel.setAttribute('role', 'tabpanel');
      // Create a relationship between the tab and its panel.
      panel.setAttribute('aria-labelledby', this.tabLinks[index].id);
      // All but the first tab should be hidden by default.
      if (activeIndex === index) {
        panel.setAttribute('tabindex', '0');
        panel.setAttribute('aria-hidden', 'false');
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('hidden', '');
      }

      // Listen for panel keydown events.
      panel.addEventListener('keydown', this.handlePanelKeydown);
    });

    // Save the active panel's interactive children.
    this.interactiveChildren = interactiveChildren(this.panels[activeIndex]);

    // Run {initCallback}
    this.onInit.call(this);
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
    const [deactivate] = this.tabLinks.filter((tab) => (
      'true' === tab.getAttribute('aria-selected')
    ));
    // Get the index; this is essentially the previous `activeIndex` state.
    const deactiveIndex = this.tabLinks.indexOf(deactivate);

    // Deactivate the previously-selected tab.
    deactivate.setAttribute('tabindex', '-1');
    deactivate.removeAttribute('aria-selected');
    this.panels[deactiveIndex].setAttribute('aria-hidden', 'true');
    this.panels[deactiveIndex].setAttribute('hidden', '');
    this.panels[deactiveIndex].removeAttribute('tabindex');

    // Prevent tabbing to interactive children of the deactivated panel.
    const deactiveChildren = interactiveChildren(this.panels[deactiveIndex]);
    tabIndexDeny(deactiveChildren);

    // Actvate the newly active tab.
    this.tabLinks[activeIndex].removeAttribute('tabindex');
    this.tabLinks[activeIndex].setAttribute('aria-selected', 'true');
    this.panels[activeIndex].setAttribute('aria-hidden', 'false');
    this.panels[activeIndex].removeAttribute('hidden');
    this.panels[activeIndex].setAttribute('tabindex', '0');

    // Allow tabbing to the newly-active panel.
    this.interactiveChildren = interactiveChildren(this.panels[activeIndex]);
    tabIndexAllow(this.interactiveChildren);

    // Run {stateChangeCallback}
    this.onStateChange.call(this, this.state);
  }

  /**
   * Handle keydown events on the tabpanels.
   *
   * @param {Event} event The event object.
   */
  handlePanelKeydown(event) {
    const { TAB } = keyCodes;
    const { activeIndex } = this.state;
    const { keyCode, shiftKey } = event;
    const { activeElement } = document;
    const [firstChild] = this.interactiveChildren;

    if (keyCode === TAB && shiftKey) {
      if (activeElement === this.panels[activeIndex]) {
        event.preventDefault();
        this.tabLinks[activeIndex].focus();
      } else if (activeElement === firstChild) {
        /*
         * Ensure navigating with Shift-TAB from the first interactive child of
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
  handleTabsKeydown(event) {
    const {
      TAB,
      LEFT,
      RIGHT,
      DOWN,
      HOME,
      END,
    } = keyCodes;
    const { keyCode, shiftKey, target } = event;
    const currentIndex = this.tabLinks.indexOf(target);

    switch (keyCode) {
      /*
       * Move focus from the active tab to the active panel.
       */
      case TAB: {
        if (! shiftKey) {
          event.preventDefault();

          this.panels[currentIndex].focus();
        }

        break;
      }

      /*
       * Move to and activate the previous or next tab.
       */
      case LEFT:
      case RIGHT: {
        const newItem = nextPreviousFromLeftRight(
          keyCode,
          target,
          this.tabLinks
        );

        if (newItem) {
          event.preventDefault();

          this.switchTo(this.tabLinks.indexOf(newItem));
          newItem.focus();
        }

        break;
      }

      /*
       * Focus the active panel itself with the down arrow.
       */
      case DOWN: {
        event.preventDefault();

        this.panels[currentIndex].setAttribute('tabindex', '0');
        this.panels[currentIndex].focus();

        break;
      }

      /*
       * Select the first Tablist tab.
       */
      case HOME: {
        event.preventDefault();
        this.switchTo(0);
        this.tabLinks[0].focus();

        break;
      }

      /*
       * Select the last Tablist tab.
       */
      case END: {
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
  handleTabsClick(event) {
    const { target } = event;
    event.preventDefault();

    // Don't act when an active tab is clicked.
    if ('true' !== target.getAttribute('aria-selected')) {
      if (this.tabLinks.includes(target)) {
        this.switchTo(this.tabLinks.indexOf(target));
      }
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
    this.tabs.removeAttribute('role');

    // Remove the 'presentation' role from each list item.
    Array.prototype.forEach.call(this.tabs.children, (listChild) => {
      if ('LI' === listChild.nodeName) {
        listChild.removeAttribute('role');
      }
    });

    // Remove the references to the class instance.
    this.deleteSelfReferences();

    // Remove tab attributes and event listeners.
    this.tabLinks.forEach((tab) => {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');
      tab.removeAttribute('aria-controls');

      tab.removeEventListener('click', this.handleTabsClick);
      tab.removeEventListener('keydown', this.handleTabsKeydown);
    });

    // Remove panel attributes and event listeners.
    this.panels.forEach((panel) => {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('hidden');
      panel.removeAttribute('tabindex');
      panel.removeAttribute('aria-labelledby');

      // Make sure to allow tabbing to all children of all panels.
      const interactiveChildElements = interactiveChildren(panel);
      tabIndexAllow(interactiveChildElements);

      panel.removeEventListener(
        'keydown',
        this.handlePanelKeydown
      );
    });

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
