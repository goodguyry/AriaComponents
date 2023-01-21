/**
 * Dialog extension for managing tabIndex for target interactive children.
 *
 * @param {Dialog} options.instance The instance of Dialog.
 */
export default function ManageTabIndex({ instance }) {
  /**
   * Prevent focus on interactive elements in the target when the target is
   * hidden.
   *
   * This isn't such an issue when the target is hidden with `display:none`, but
   * is necessary if the target is hidden by other means, such as minimized height
   * or width.
   */
  const stateChangeHandler = () => {
    if (instance.expanded) {
      instance.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
    } else {
      instance.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));
    }
  };

  // Initial setup.
  // Focusable content should initially have tabindex='-1'.
  instance.interactiveChildElements.forEach((item) => item.setAttribute('tabindex', '-1'));

  // Handle state changes.
  instance.on('dialog.stateChange', stateChangeHandler);

  // Handle destroy.
  instance.on('dialog.destroy', () => {
    instance.interactiveChildElements.forEach((item) => item.removeAttribute('tabindex'));
    instance.off('dialog.stateChange', stateChangeHandler);
  });
}
