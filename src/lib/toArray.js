/**
 * Create an array from a value.
 *
 * @param {Mixed} maybeAnArray An HTMLElement, NodeList, or Array of elements.
 */
export default function toArray(maybeAnArray) {
  if (Array.isArray(maybeAnArray)) {
    return maybeAnArray;
  }

  let shouldBeAnArray = [];

  if (maybeAnArray instanceof HTMLElement) {
    // Convert a single element to an Array.
    shouldBeAnArray = new Array(maybeAnArray);
  } else if (
    maybeAnArray instanceof NodeList
    || maybeAnArray instanceof HTMLCollection
  ) {
    shouldBeAnArray = Array.from(maybeAnArray);
  }

  return shouldBeAnArray;
}
