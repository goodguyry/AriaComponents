/**
 * Use the hidden attribute to hide hidden content :)
 *
 * @param  {Disclosure} options.component The Disclosure component.
 * @return {Function}                     The cleanup function.
 */
export default function({ component }) {
  /**
   * Update the hidden attribute after state changes.
   */
  const handleStateChange = () => (
    component.updateAttribute(component.target, 'hidden', (component.expanded ? null : ''))
  );

  // Set up.
  handleStateChange(); // Using this on load assures support for the `loadOpen` option.
  component.on('disclosure.stateChange', handleStateChange);

  // Clean up.
  return () => {
    component.off('disclosure.stateChange', handleStateChange);
  };
}
