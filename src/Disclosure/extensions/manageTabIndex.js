/**
 * Disclosure extension for managing tabIndex for target interactive children.
 *
 * @param {Disclosure} options.component The instance of Disclosure.
 */
export default function ManageTabIndex({ component }) {
  /**
   * Prevent focus on interactive elements in the target when the target is
   * hidden.
   *
   * This isn't such an issue when the target is hidden with `display:none`, but
   * is necessary if the target is hidden by other means, such as minimized height
   * or width.
   */
  const stateChangeHandler = () => {
    if (component.expanded) {
      component.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
    } else {
      component.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));
    }
  };

  // Initial setup.
  component.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));

  // Handle state changes.
  component.on('disclosure.stateChange', stateChangeHandler);

  // Clean up.
  return () => {
    component.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
    component.off('disclosure.stateChange', stateChangeHandler);
  };
}
