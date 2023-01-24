export default function ComponentConnector({ component }) {
  /**
   * Move focus to the target's first interactive child in cases where the
   * markup is disconnected or out-of-order.
   *
   * @param {Event} event The Event object.
   */
  const tabtoTarget = (event) => {
    const { key, shiftKey } = event;

    if (
      component.expanded
      && ! shiftKey
      && 'Tab' === key
    ) {
      event.preventDefault();

      component.firstInteractiveChild.focus();
    }
  }

  /**
   * Move focus back to the controller from the target's first interactive child
   * in cases where the markup is disconnected or out-of-order.
   *
   * @param {Event} event The Event object.
   */
  const tabBackToController = (event) => {
    const { key, shiftKey } = event;
    const { activeElement } = document;

    if (
      component.firstInteractiveChild === activeElement
      && shiftKey
      && 'Tab' === key
    ) {
      event.preventDefault();

      component.controller.focus();
    }
  }

  /*
   * Establish a relationship when the DOM heirarchy doesn't represent that
   * a relationship exists.
   */
  if (component.target !== component.controller.nextElementSibling) {
    component.addAttribute(component.controller, 'aria-owns', component.target.id);

    component.controller.addEventListener('keydown', tabtoTarget);
    component.target.addEventListener('keydown', tabBackToController);
  }

  // Clean up.
  return () => {
    component.controller.removeEventListener('keydown', tabtoTarget);
    component.target.removeEventListener('keydown', tabBackToController);
  };
}
