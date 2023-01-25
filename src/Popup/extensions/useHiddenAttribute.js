/**
 * Use the hidden attribute to hide hidden content :)
 *
 * @param  {Popup} options.component The Popup component.
 * @return {Function}                The cleanup function.
 */
export default function({ component }) {
  /**
   * Update the hidden attribute after state changes.
   */
  const handleStateChange = () => (
    component.updateAttribute(component.target, 'hidden', (component.expanded ? null : ''))
  );

  // Set up.
  handleStateChange();
  component.on('popup.stateChange', handleStateChange);

  // Clean up.
  return () => {
    component.off('popup.stateChange', handleStateChange);
  };
}
