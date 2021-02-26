/**
 * Create an array from a value.
 *
 * @param {Mixed} maybeAnArray An HTMLElement, NodeList, or Array of elements.
 */
export default function toArray(maybeAnArray) {
  if (Array.isArray(maybeAnArray)) {
    return maybeAnArray;
  }

  if (maybeAnArray instanceof HTMLElement) {
    // Convert a single element to an Array.
    return new Array(maybeAnArray);
  }

  if (
    maybeAnArray instanceof NodeList
    || maybeAnArray instanceof HTMLCollection
  ) {
    return Array.from(maybeAnArray);
  }

  return [];
}
