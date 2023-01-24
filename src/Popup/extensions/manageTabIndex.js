/**
 * Popup extension for managing tabIndex for target interactive children.
 *
 * @param {Popup} options.component The instance of Popup.
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
    component.interactiveChildElements.forEach((item) => (
      component.updateAttribute(item, 'tabindex', (component.expanded ? null : '-1')))
    );
  };

  // Initial setup.
  component.interactiveChildElements.forEach((item) => component.updateAttribute(item, 'tabindex', '-1'));

  // Handle state changes.
  component.on('popup.stateChange', stateChangeHandler);

  // Clean up.
  return () => {
    component.off('popup.stateChange', stateChangeHandler);
    component.interactiveChildElements.forEach((item) => component.removeAttributes(item, 'tabindex'));
  };
}
