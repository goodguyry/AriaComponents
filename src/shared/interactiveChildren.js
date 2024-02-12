// List of possible active child element selectors
const interactiveChildSelector = [
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

/**
 * Returns true if the target contains an interactive element.
 *
 * @param {HTMLElement} target   The element in which to search for interactive children.
 * @param {string}      selector The interactive child selector.
 * @return {bool}
 */
function hasInteractiveChildren(target, selector = interactiveChildSelector) {
  return (null !== target.querySelector(selector));
}

/**
 * Collect all interactive child elements.
 *
 * @param {HTMLElement} target   The element in which to search for interactive children.
 * @param {string}      selector The interactive child selector.
 * @return {array}
 */
function interactiveChildren(target, selector = interactiveChildSelector) {
  return Array.from(target.querySelectorAll(selector));
}

export {
  interactiveChildren,
  hasInteractiveChildren,
};
