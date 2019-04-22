/**
 * Check if an element has been instantiated as an A11Y class.
 *
 * @param  {HTMLElement} element  The element to check.
 * @param  {Object}      instance The class instance to check against.
 *
 * @return {Boolean}
 */
export default function instanceOf(element, instance) {
  if (undefined === element || null === element) {
    return false;
  }

  const propName = instance.getClassName();

  return (
    Object.prototype.hasOwnProperty.call(element, propName)
    && (element[propName] instanceof instance)
  );
}
