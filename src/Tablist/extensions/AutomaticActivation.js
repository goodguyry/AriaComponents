/**
 * Auotmatically activate tabs when moving focus.
 *
 * @param {Tablist} options.component The Tablist instance.
 */
export default function AutomaticActivation({ component }) {
  /**
   * Allow the active tab panel to have focus.
   */
  const rovingTabIndex = () => {
    component.panels.forEach((panel, index) => {
      component.updateAttribute(panel, 'tabindex', (component.activeIndex === index ? '0' : null))
    });
  };

  /**
   * Activate the tab on keydown.
   *
   * @param {Event} event The Event object.
   */
  const activateTab = (event) => {
    const { key, shiftKey, target } = event;
    const currentIndex = component.tabLinks.indexOf(target);

    switch(key) {
      /*
       * Move focus from the active tab to the active panel.
       */
      case 'Tab': {
        if (! shiftKey) {
          event.preventDefault();

          component.panels[component.activeIndex].focus();
        }

        break;
      }

      // Conditionally activate another tab.
      default: {
        const nextIndex = component.getNextIndex(key, currentIndex);

        if (undefined != nextIndex) {
          component.switchTo(nextIndex);
        }
      }
    }
  };

  // Initial setup.
  rovingTabIndex();

  // Activate tabs on keydown.
  component.tabs.addEventListener('keydown', activateTab);

  // Handle state changes.
  component.on('tablist.stateChange', rovingTabIndex);

  // Clean up.
  return () => {
    component.tabs.removeEventListener('keydown', activateTab);
    component.off('tablist.stateChange', rovingTabIndex);
  };
}
