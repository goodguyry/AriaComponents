import interactiveChildren from '../../lib/interactiveChildren';

/**
 * Tablist extension for managing tabIndex for target interactive children.
 *
 * @param {Tablist} options.instance The instance of Tablist.
 */
export default function ManageTabIndex({ instance }) {
  const interactiveChildMap = {};

  /**
   * Allow the active tab panel's active elements to have focus.
   */
  const rovingTabIndex = () => {
    const {
      [instance.previousIndex]: previousChildren,
      [instance.activeIndex]: activeChildren,
    } = interactiveChildMap;

    if (undefined !== instance.panels[instance.previousIndex]) {
      if (undefined === previousChildren) {
        interactiveChildMap[instance.previousIndex] = (
          interactiveChildren(instance.panels[instance.previousIndex])
        );
      }

      interactiveChildMap[instance.previousIndex].forEach((item) => instance.updateAttribute(item, 'tabindex', '-1'));
    }

    if (undefined !== instance.panels[instance.activeIndex]) {
      if (undefined === activeChildren) {
        interactiveChildMap[instance.activeIndex] = (
          interactiveChildren(instance.panels[instance.activeIndex])
        );
      }

      interactiveChildMap[instance.activeIndex].forEach((item) => instance.updateAttribute(item, 'tabindex', null));
    }
  };

  // Initial setup.
  rovingTabIndex();

  // Handle state changes.
  instance.on('tablist.stateChange', rovingTabIndex);

  // Clean up.
  return () => {
    Object.values(interactiveChildMap)
      .flat()
      .forEach((child) => instance.removeAttributes(child));

    instance.off('tablist.stateChange', rovingTabIndex);
  };
}
