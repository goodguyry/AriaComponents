/**
 * Check if a given element's property has been instantiated as an AriaComponent class.
 *
 * @param  {HTMLElement} prop      The property to check.
 * @param  {Object}      component The class instance to check against.
 *
 * @return {Boolean}
 */
export default function instanceOf(prop, component) {
  if (undefined === prop || null === prop) {
    return false;
  }

  return (prop instanceof component);
}
