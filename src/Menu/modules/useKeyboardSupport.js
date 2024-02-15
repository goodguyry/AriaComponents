import nextPrevious from '../../shared/nextPrevious';

/**
 * Add support to Menu for arrow, Home, and End keys.
 *
 * @param  {Menu} arg.component The component instance.
 * @return {Function} The cleanup function.
 */
export default function UseKeyboardSupport({ component }) {
  // ArrowDown
  // ArrowLeft
  // ArrowRight
  // ArrowUp
  // End
  // Home

  // @todo Get interactive element.
  // @todo Get first and last items from menu.
  // @todo Make it reusable for submenus?

  const { menuItems } = component;

  const [firstItem, lastItem] = component.constructor.getFirstAndLastItems(menuItems);
  component.firstItem = firstItem;
  component.lastItem = lastItem;

  // @todo Loop through component.disclosures and listen for controller down/right.
  //       Move to target first item.
  //       Prevent propagation
  const controllerHandleKeydown = (event) => {
    event.preventDefault();

    if (
      ['ArrowDown', 'ArrowRight'].includes(event.key)
      && component.activeDisclosureId === event.target?.id
    ) {
      const { target } = component.activeDisclosure;
      const firstItem = target.firstElementChild.querySelector('a,button');

      if (null !== firstItem) {
        event.stopPropagation();
        firstItem.focus();
      }
    }
  };

  /**
   * Handle keydown events on menu items.
   *
   * @param {Event} event The event object.
   */
  function menuHandleKeydown(event) {
    const { key } = event;
    const { activeElement } = document;

    if (component.element.contains(activeElement)) {
      switch (key) {
        /*
         * Move through sibling list items.
         */
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowDown': {
          const nextItem = nextPrevious(key, activeElement, component.menuItems, false);

          if (nextItem) {
            event.stopPropagation();
            event.preventDefault();

            nextItem.focus();
          }

          break;
        }

        /*
         * Select the first Menu item.
         */
        case 'Home': {
          event.preventDefault();

          component.firstItem.focus();

          break;
        }

        /*
         * Select the last Menu item.
         */
        case 'End': {
          event.preventDefault();

          component.lastItem.focus();

          break;
        }

        default:
          break;
      }
    }
  }

  // @todo Listen on all top-level menu items for down/right, up/left, home, end.
  //       Move through with no cycling.
  component.element.addEventListener('keydown', menuHandleKeydown);

  component.disclosures.forEach((disclosure) => {
    disclosure.controller.addEventListener('keydown', controllerHandleKeydown);
  });

  // @todo Maybe just make Menu recursive?
  // @todo Listen for submenu down/right, up/left, home, end.
  //       Move through with no cycling.

  // Cleanup.
  return () => {
    component.disclosures.forEach((disclosure) => {
      disclosure.controller.removeEventListener('keydown', controllerHandleKeydown);
    });
  };
}
