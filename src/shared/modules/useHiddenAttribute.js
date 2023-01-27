/**
 * Use the hidden attribute to hide hidden content :)
 *
 * @param {Dialog|Disclosure|Popup} args.component The Dialog component.
 * @param {String}                  args.namespace The component's namespace.
 * @return {Function} The cleanup function.
 */
export default function UseHiddenAttribute({ component, namespace }) {
  /**
   * Update the hidden attribute after state changes.
   */
  const handleStateChange = () => (
    component.updateAttribute(component.target, 'hidden', (component.expanded ? null : ''))
  );

  // Set up.
  handleStateChange();
  component.on(`${namespace}.stateChange`, handleStateChange);

  // Clean up.
  return () => component.off(`${namespace}.stateChange`, handleStateChange);
}
