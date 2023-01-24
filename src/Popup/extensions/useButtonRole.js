/**
 * Mimic button element for a non-button controller.
 *
 * @param {Popup} options.component The Popup component.
 */
export default function UseButtonRole({ component }) {
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
      if (Object.prototype.hasOwnProperty.call(component, 'toggle')) {
        component.toggle();
      } else {
        component.show();
      }
    }
  }

  // Patch button role and behavior for non-button controller.
  if ('BUTTON' !== component.controller.nodeName) {
    /*
     * Some elements semantics conflict with the button role. You really
     * should just use a button.
     */
    component.addAttribute(component.controller, 'role', 'button');
    component.controller.addEventListener('keydown', patchButtonKeydown);

    // Ensure we can Tab to the controller even if it's not a button nor anchor.
    if ('A' !== component.controller.nodeName) {
      component.addAttribute(component.controller, 'tabindex', '0');
    }
  }

  // Clean up.
  () => component.controller.removeEventListener('keydown', patchButtonKeydown);
}
