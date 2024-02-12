/**
 * Tablist module to use the hidden attribute to hide hidden content :)
 *
 * @param {Tablist} arg.component An instance of Tablist.
 * @return {function} The cleanup function.
 */
export default function UseHiddenAttribute({ component }) {
  /**
   * Update the hidden attribute for inactive tabpanels.
   */
  const handleStateChange = () => {
    component.panels.forEach((panel, index) => {
      component.updateAttribute(panel, 'hidden', (index === component.activeIndex ? null : ''));
    });
  };

  // Set up.
  handleStateChange();
  component.on('tablist.stateChange', handleStateChange);

  // Clean up.
  return () => component.off('tablist.stateChange', handleStateChange);
}
