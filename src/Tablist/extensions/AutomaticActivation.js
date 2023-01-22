/**
 * Auotmatically activate tabs when moving focus.
 *
 * @param {Tablist} options.instance The Tablist instance.
 */
export default function AutomaticActivation({ instance }) {
  /**
   * Allow the active tab panel to have focus.
   */
  const rovingTabIndex = () => {
    instance.panels.forEach((panel, index) => {
      instance.updateAttribute(panel, 'tabindex', (instance.activeIndex === index ? '0' : null))
    });
  };

  /**
   * Activate the tab on keydown.
   *
   * @param {Event} event The Event object.
   */
  const activateTab = (event) => {
    const { key, shiftKey, target } = event;
    const currentIndex = instance.tabLinks.indexOf(target);

    switch(key) {
      /*
       * Move focus from the active tab to the active panel.
       */
      case 'Tab': {
        if (! shiftKey) {
          event.preventDefault();

          instance.panels[instance.activeIndex].focus();
        }

        break;
      }

      // Conditionally activate another tab.
      default: {
        const nextIndex = instance.getNextIndex(key, currentIndex);

        if (undefined != nextIndex) {
          instance.switchTo(nextIndex);
        }
      }
    }
  };

  // All but the first tab should be hidden by default.
  instance.panels.forEach((panel, index) => {
    instance.addAttribute(panel, 'tabindex', (instance.activeIndex === index) ? '0' : null);
  });

  // Activate tabs on keydown.
  instance.tabs.addEventListener('keydown', activateTab);

  // Handle state changes.
  instance.on('tablist.stateChange', rovingTabIndex);

  // Handle destroy.
  instance.on('tablist.destroy', () => {
    instance.tabs.removeEventListener('keydown', activateTab);
    instance.off('tablist.stateChange', rovingTabIndex);
  });
}
