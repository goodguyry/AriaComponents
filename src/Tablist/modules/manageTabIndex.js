import { interactiveChildren } from '../../shared/interactiveChildren';

/**
 * Tablist module for managing tabIndex for target interactive children.
 *
 * @param  {Tablist} arg.component An instance of Tablist.
 * @return {Function} The cleanup function.
 */
export default function ManageTabIndex({ component }) {
  /*
   * Initial setup.
   *
   * Cache panels' interactive elements, then set initial tabindex.
   */
  const interactiveChildMap = component.panels
    .reduce((acc, panel, index) => (
      { ...acc, [index]: interactiveChildren(panel) }
    ), {});

  /**
   * Allow the selected tabpanel's active elements to have focus.
   */
  const rovingTabIndex = () => {
    const { previousIndex, activeIndex } = component;
    const {
      [previousIndex]: previousChildren = [],
      [activeIndex]: activeChildren = [],
    } = interactiveChildMap;

    if (0 < previousChildren.length) {
      previousChildren.forEach((item) => component.updateAttribute(item, 'tabindex', '-1'));
    }

    if (0 < activeChildren.length) {
      activeChildren.forEach((item) => component.updateAttribute(item, 'tabindex', null));
    }
  };

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
