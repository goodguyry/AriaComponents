/**
 * Dialog extension for managing tabIndex for target interactive children.
 *
 * @param {Dialog} options.component The instance of Dialog.
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
  // Focusable content should initially have tabindex='-1'.
  component.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));

  // Handle state changes.
  component.on('dialog.stateChange', stateChangeHandler);

  // Handle destroy.
  return () => {
    component.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
    component.off('dialog.stateChange', stateChangeHandler);
  };
}
