/**
 * Check if a given element's property has been instantiated as an AriaComponent class.
 *
 * @param {Object}   component The class instance to check against.
 * @param {String}   name      The name of the expected component.
 * @return {Boolean}
 */
export default function isInstanceOf(component, name) {
  if (null == component || null == name || 'string' !== typeof name) {
    return false;
  }

  const toStringTag = component?.[Symbol.toStringTag];

  return toStringTag?.toLowerCase() === name.toLowerCase();
}
