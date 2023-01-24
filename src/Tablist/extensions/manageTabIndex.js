import interactiveChildren from '../../lib/interactiveChildren';

/**
 * Tablist extension for managing tabIndex for target interactive children.
 *
 * @param {Tablist} options.component The instance of Tablist.
 */
export default function ManageTabIndex({ component }) {
  const interactiveChildMap = {};

  /**
   * Allow the active tab panel's active elements to have focus.
   */
  const rovingTabIndex = () => {
    const {
      [component.previousIndex]: previousChildren,
      [component.activeIndex]: activeChildren,
    } = interactiveChildMap;

    if (undefined !== component.panels[component.previousIndex]) {
      if (undefined === previousChildren) {
        interactiveChildMap[component.previousIndex] = (
          interactiveChildren(component.panels[component.previousIndex])
        );
      }

      interactiveChildMap[component.previousIndex].forEach((item) => component.updateAttribute(item, 'tabindex', '-1'));
    }

    if (undefined !== component.panels[component.activeIndex]) {
      if (undefined === activeChildren) {
        interactiveChildMap[component.activeIndex] = (
          interactiveChildren(component.panels[component.activeIndex])
        );
      }

      interactiveChildMap[component.activeIndex].forEach((item) => component.updateAttribute(item, 'tabindex', null));
    }
  };

  // Initial setup.
  rovingTabIndex();

  // Handle state changes.
  component.on('tablist.stateChange', rovingTabIndex);

  // Clean up.
  return () => {
    Object.values(interactiveChildMap)
      .flat()
      .forEach((child) => component.removeAttributes(child));

    component.off('tablist.stateChange', rovingTabIndex);
  };
}
