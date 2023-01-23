/**
 * Popup extension for managing tabIndex for target interactive children.
 *
 * @param {Popup} options.instance The instance of Popup.
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
    instance.interactiveChildElements.forEach((item) => (
      instance.updateAttribute(item, 'tabindex', (instance.expanded ? null : '-1')))
    );
  };

  // Initial setup.
  instance.interactiveChildElements.forEach((item) => instance.updateAttribute(item, 'tabindex', '-1'));

  // Handle state changes.
  instance.on('popup.stateChange', stateChangeHandler);

  // Handle destroy.
  instance.on('popup.destroy', () => {
    instance.off('popup.stateChange', stateChangeHandler);
    instance.interactiveChildElements.forEach((item) => instance.removeAttributes(item, 'tabindex'));
  });
}
