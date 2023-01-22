/**
 * Mimic button element for a non-button controller.
 *
 * @param {Dialog} options.instance The Dialog component.
 */
export default function UseButtonRole({ instance }) {
  /**
   * Mimic button keyboard support.
   *
   * @param {Event} event The event object.
   */
  const patchButtonKeydown = (event) => {
    /*
     * Treat the Spacebar and Return keys as clicks in case the controller is
     * not a <button>.
     */
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();

      instance.expanded = true;
    }
  }

  // Patch button role and behavior for non-button controller.
  if ('BUTTON' !== instance.controller.nodeName) {
    /*
     * Some elements semantics conflict with the button role. You really
     * should just use a button.
     */
    instance.addAttribute(instance.controller, 'role', 'button');
    instance.controller.addEventListener('keydown', patchButtonKeydown);

    // Ensure we can Tab to the controller even if it's not a button nor anchor.
    if ('A' !== instance.controller.nodeName) {
      instance.addAttribute(instance.controller, 'tabindex', '0');
    }
  }

  instance.on('dialog.destroy', () => {
    instance.controller.removeEventListener('keydown', patchButtonKeydown);
  });
}
