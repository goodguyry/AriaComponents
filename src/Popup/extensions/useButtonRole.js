/**
 * Mimic button element for a non-button controller.
 *
 * @param {Popup} options.instance The Popup component.
 */
export default function UseButtonRole({ instance }) {
  /**
   * Treat the Spacebar and Return keys as clicks in case the controller is
   * not a <button>.
   *
   * @param {Event} event The event object.
   */
  const patchButtonKeydown = (event) => {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();

      // @todo Use the same extension for all components.
      if (Object.prototype.hasOwnProperty.call(instance, 'toggle')) {
        instance.toggle();
      } else {
        instance.show();
      }
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

  // Clean up.
  () => instance.controller.removeEventListener('keydown', patchButtonKeydown);
}
