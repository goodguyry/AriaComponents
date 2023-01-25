/**
 * Use the hidden attribute to hide hidden content :)
 *
 * @param  {Dialog} options.component The Dialog component.
 * @return {Function}                 The cleanup function.
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
  component.on('dialog.stateChange', handleStateChange);

  // Clean up.
  return () => {
    component.off('dialog.stateChange', handleStateChange);
  };
}
