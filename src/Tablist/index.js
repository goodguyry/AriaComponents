import AriaComponent from '../AriaComponent';
import interactiveChildren from '../lib/interactiveChildren';
import { setUniqueId } from '../lib/uniqueId';
import { tabIndexDeny, tabIndexAllow } from '../lib/rovingTabIndex';
import keyCodes from '../lib/keyCodes';

/**
 * Class for implimenting a tabs widget for sectioning content and displaying
 * one at a time.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel
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

    // The Tablist element is required to be a UL.
    if ('UL' !== config.tablist.nodeName) {
      // @todo Maybe throw an error here?
      return;
    }

    /**
     * The component name.
     *
     * @type {string}
     */
    this.componentName = 'tablist';

    /**
     * Component configuration options.
     *
     * @type {object}
     */
    const options = {
      /**
       * The UL parent of the Tablist tabs.
       *
       * @type {HTMLElement}
       */
      tablist: null,
      /**
       * The Tablist panels.
       *
       * @type {NodeList}
       */
      panels: null,
      /**
       * Callback to run after the component initializes.
       * @callback initCallback
       */
      onInit: () => {},
      /**
       * Callback to run after component state is updated.
       * @callback stateChangeCallback
       */
      onStateChange: () => {},
      /**
       * Callback to run after the component is destroyed.
       * @callback destroyCallback
       */
      onDestroy: () => {},
    };

    // Save references to the tablist and panels.
    Object.assign(this, options, config);

    // Intial component state.
    this.state = { activeIndex: 0 };

    // Bind class methods
    this.handleTabKeydown = this.handleTabKeydown.bind(this);
    this.handleTabsKeydown = this.handleTabsKeydown.bind(this);
    this.handleTabsClick = this.handleTabsClick.bind(this);
    this.switchTo = this.switchTo.bind(this);
    this.destroy = this.destroy.bind(this);

    /**
     * Tablist panels
     *
     * @type {array}
     */
    this.panels = Array.prototype.slice.call(this.panels);

    /**
     * Collect the anchor inside of each list item. Using anchors makes
     * providing a non-JS fallback as simple as using the associated tabpanel's
     * ID attribute as the link's HREF.
     *
     * Required tab markup: `<li><a href=""></a></li>`
     *
     * @type {array}
     */
    this.tabs = Array.prototype.filter.call(
      this.tablist.children,
      (child) => null !== child.querySelector('a[href]')
    )
      .map((child) => child.querySelector('a[href]'));

    // Only initialize if tabs and panels are equal in number.
    if (this.tabs.length === this.panels.length) {
      this.init();
    }
  }

  /**
   * Set up the component's DOM attributes and event listeners.
   */
  init() {
    // Component state is initially set in the constructor.
    const { activeIndex } = this.state;

    // The`tablist` role indicates that the list is a container for a set of tabs.
    this.tablist.setAttribute('role', 'tablist');

    /*
     * Prevent the Tablist LI element from being announced as list-items as
     * that information is neither useful nor applicable.
     */
    Array.prototype.forEach.call(this.tablist.children, (listChild) => {
      if ('LI' === listChild.nodeName) {
        listChild.setAttribute('role', 'presentation');
      }
    });

    // Set attributes for each tab.
    this.tabs.forEach((tab, index) => {
      /*
       * Add a reference to the class instance to enable external interactions
       * with this instance.
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
    });

    // Add event listeners.
    this.tablist.addEventListener('click', this.handleTabsClick);
    this.tablist.addEventListener('keydown', this.handleTabsKeydown);

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
      panel.setAttribute('aria-labelledby', this.tabs[index].id);
      // All but the first tab should be hidden by default.
      panel.setAttribute('aria-hidden', `${activeIndex !== index}`);
      // Listen for panel keydown events.
      panel.addEventListener('keydown', this.handleTabKeydown);
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
  stateWasUpdated({ activeIndex }) {
    // Get the tab currently designated as `aria-selected`.
    const [deactivate] = this.tabs.filter((tab) => (
      'true' === tab.getAttribute('aria-selected')
    ));
    // Get the index; this is essentially the previous `activeIndex` state.
    const deactiveIndex = this.tabs.indexOf(deactivate);

    // Deactivate the previously-selected tab.
    deactivate.setAttribute('tabindex', '-1');
    deactivate.removeAttribute('aria-selected');
    this.panels[deactiveIndex].setAttribute('aria-hidden', 'true');

    // Prevent tabbing to interactive children of the deactivated panel.
    const deactiveChildren = interactiveChildren(this.panels[deactiveIndex]);
    tabIndexDeny(deactiveChildren);

    // Actvate the newly active tab.
    this.tabs[activeIndex].removeAttribute('tabindex');
    this.tabs[activeIndex].setAttribute('aria-selected', 'true');
    this.panels[activeIndex].setAttribute('aria-hidden', 'false');

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
  handleTabKeydown(event) {
    const { TAB } = keyCodes;
    const { activeIndex } = this.state;
    const { keyCode, shiftKey } = event;
    const { activeElement } = document;

    if (keyCode === TAB && shiftKey) {
      // Get the index of the activeElement within the active panel.
      const focusIndex = this.interactiveChildren.indexOf(activeElement);
      // Get the tab associated with the active panel via the panel's aria-labelledby attribute.
      const panelLabelledby = (
        this.panels[activeIndex].getAttribute('aria-labelledby')
      );
      const theTab = document.getElementById(panelLabelledby);

      /*
       * Ensure navigating with Shift-TAB from the first interactive child of
       * the active panel returns focus to the active panel's associated tab.
       */
      if (0 === focusIndex && null !== theTab) {
        event.preventDefault();

        theTab.focus();
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
    } = keyCodes;
    const { keyCode, shiftKey, target } = event;
    const currentIndex = this.tabs.indexOf(target);
    const hasInteractiveChildren = (0 < this.interactiveChildren.length);

    switch (keyCode) {
      /*
       * Move focus from the active tab to the active panel's first child.
       */
      case TAB: {
        if (! shiftKey && hasInteractiveChildren) {
          event.preventDefault();

          this.interactiveChildren[0].focus();
        }

        break;
      }

      /*
       * Move to and activate the previous or next tab.
       */
      case LEFT:
      case RIGHT: {
        const newIndex = (LEFT === keyCode)
          ? currentIndex - 1
          : currentIndex + 1;

        if (undefined !== this.tabs[newIndex]) {
          event.preventDefault();

          this.switchTo(newIndex);
          this.tabs[newIndex].focus();
        }

        break;
      }

      /*
       * Focus the active panel itself with the down arrow.
       */
      case DOWN: {
        event.preventDefault();

        this.panels[currentIndex].setAttribute('tabindex', '-1');
        this.panels[currentIndex].focus();

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
      const index = this.tabs.indexOf(target);
      this.switchTo(index);
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
    this.tablist.removeAttribute('role');

    // Remove the 'presentation' role from each list item.
    Array.prototype.forEach.call(this.tablist.children, (listChild) => {
      if ('LI' === listChild.nodeName) {
        listChild.removeAttribute('role');
      }
    });

    // Remove tab attributes and event listeners.
    this.tabs.forEach((tab) => {
      // Remove the self reference.
      delete tab.tablist; // eslint-disable-line no-param-reassign

      tab.removeAttribute('role');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');

      tab.removeEventListener('click', this.handleTabsClick);
      tab.removeEventListener('keydown', this.handleTabsKeydown);
    });

    // Remove panel attributes and event listeners.
    this.panels.forEach((panel) => {
      // Remove the self reference.
      delete panel.tablist; // eslint-disable-line no-param-reassign

      panel.removeAttribute('role');
      panel.removeAttribute('aria-hidden');

      // Make sure to allow tabbing to all children of all panels.
      const interactiveChildElements = interactiveChildren(panel);
      tabIndexAllow(interactiveChildElements);

      panel.removeEventListener(
        'keydown',
        this.handleTabKeydown
      );
    });

    // Run {destroyCallback}
    this.onDestroy.call(this);
  }
}
