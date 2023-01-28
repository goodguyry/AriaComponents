/**
 * Collect all interactive child elements.
 *
 * @param {HTMLElement} target The element in which to search for interactive children.
 *
 * @return {Array}
 */
function interactiveChildren(target) {
  // List of possible active child element selectors
  const selectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
  ].join(',');

  const interactiveElements = target.querySelectorAll(selectors);

  return Array.from(interactiveElements);
}

export default interactiveChildren;
