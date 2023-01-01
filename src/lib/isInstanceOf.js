/**
 * Check if a given element's property has been instantiated as an AriaComponent class.
 *
 * @param {String}   name      The name of the expected component.
 * @param {Object}   component The class instance to check against.
 * @return {Boolean}
 */
export default function isInstanceOf(name, component) {
  if (null == component || null == name || 'string' !== typeof name) {
    return false;
  }

  // e.g., '[object Dialog]'.
  return component.toString().toLowerCase() === `[object ${name.toLowerCase()}]`;
}
