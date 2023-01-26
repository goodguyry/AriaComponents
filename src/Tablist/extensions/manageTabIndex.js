import interactiveChildren from '../../lib/interactiveChildren';

/**
 * Tablist extension for managing tabIndex for target interactive children.
 *
 * @param {Tablist} options.component The instance of Tablist.
 */
export default function ManageTabIndex({ component }) {
  /**
   * Allow the active tabpanel's active elements to have focus.
   */
  const rovingTabIndex = () => {
    const { previousIndex, activeIndex } = component;
    const {
      [previousIndex]: previousChildren = [],
      [activeIndex]: activeChildren = [],
    } = interactiveChildMap;

    if (previousChildren.length > 0) {
      previousChildren.forEach((item) => (
        component.updateAttribute(item, 'tabindex', '-1'))
      );
    }

    if (activeChildren.length > 0) {
      activeChildren.forEach((item) => (
        component.updateAttribute(item, 'tabindex', null))
      );
    }
  };

  /*
   * Initial setup.
   *
   * Cache panels' interactive elements, then set initial tabindex.
   */
  const interactiveChildMap = component.panels
    .reduce((acc, panel, index) => (
      { ...acc, [index]: interactiveChildren(panel) }
    ), {});

  rovingTabIndex();

  // Handle state changes.
  component.on('tablist.stateChange', rovingTabIndex);

  // Clean up.
  return () => {
    // Combine all interactive child arrays and rip through them in one go.
    Object.values(interactiveChildMap)
      .flat()
      .forEach((child) => component.removeAttributes(child));

    component.off('tablist.stateChange', rovingTabIndex);
  };
}
