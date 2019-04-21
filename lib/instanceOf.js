/**
 * Check if an element has been instantiated as an A11Y class.
 *
 * @param  {HTMLElement} element  The element to check.
 * @param  {String}      instance The property to check for.
 *
 * @return {Boolean}
 */
export default function instanceOf(element, property) {
  const classes = {};

  if (null !== element && Object.keys(classes).includes(property)) {
    const classInstance = classes[property];

    return (
      Object.prototype.hasOwnProperty.call(element, property)
      && (element[property] instanceof classInstance)
    );
  }

  return false;
}
