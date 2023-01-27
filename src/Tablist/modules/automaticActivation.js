/**
 * Tablist module for automatically activating tabs when moving focus.
 *
 * @param  {Tablist} arg.component An instance of Tablist.
 * @return {Function} The cleanup function.
 */
export default function AutomaticActivation({ component }) {
  /**
   * Allow the active tab panel to have focus.
   */
  const rovingTabIndex = () => {
    component.panels.forEach((panel, index) => {
      component.updateAttribute(panel, 'tabindex', (component.activeIndex === index ? '0' : null));
    });
  };

  /**
   * Activate the tabpanel on keydown.
   *
   * @param {Event} event The Event object.
   */
  const activateTab = (event) => {
    const { key, shiftKey, target } = event;
    const currentIndex = component.tabLinks.indexOf(target);

    switch (key) {
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

        if (undefined !== nextIndex) {
          component.switchTo(nextIndex);
        }
      }
    }
  };

  /*
   * Initial setup.
   *
   * Set initial tabpanel tabindex based on activeIndex.
   */
  rovingTabIndex();

  component.on('tablist.stateChange', rovingTabIndex);
  component.on('keydown', activateTab);

  // Clean up.
  return () => {
    component.off('keydown', activateTab);
    component.off('tablist.stateChange', rovingTabIndex);
  };
}
