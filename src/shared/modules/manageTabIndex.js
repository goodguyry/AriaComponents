/**
 * Module for managing tabIndex for the target's interactive children.
 *
 * This isn't such an issue when the target is hidden with `display:none`, but
 * may be necessary if the target is hidden by other means.
 *
 * @param  {Dialog|Disclosure|Popup} arg.component The component instance.
 * @param  {String}                  arg.namespace The component's event namespace.
 * @return {Function} The cleanup function.
 */
export default function ManageTabIndex({ component, namespace }) {
  /**
   * Update the tabindex attribute based on component expanded state.
   */
  const stateChangeHandler = () => {
    component.interactiveChildElements.forEach((item) => (
      component.updateAttribute(item, 'tabindex', (component.expanded ? null : '-1'))));
  };

  /*
   * Initial setup.
   *
   * Focusable content should initially have tabindex='-1'.
   */
  component.interactiveChildElements.forEach((item) => {
    component.addAttribute(item, 'tabindex', '-1');
  });
  component.on(`${namespace}.stateChange`, stateChangeHandler);

  // Clean up.
  return () => {
    component.interactiveChildElements.forEach((item) => component.removeAttributes(item));
    component.off(`${namespace}.stateChange`, stateChangeHandler);
  };
}
