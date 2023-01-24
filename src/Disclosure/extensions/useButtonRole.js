/**
 * Mimic button element for a non-button controller.
 *
 * @param {Disclosure} options.component The Disclosure component.
 */
export default function UseButtonRole({ component }) {
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

      component.expanded = true;
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
  return () => component.controller.removeEventListener('keydown', patchButtonKeydown);
}
