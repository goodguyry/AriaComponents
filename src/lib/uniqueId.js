/**
 * Create a passably unique `id` attribute.
 *
 * @param {Number} radix An optional base for converting the Number to a String.
 *
 * @returns {String}
 */
function getUniqueId(radix = 36) {
  const [, attr] = Math.random().toString(radix).split('.');
  return `id_${attr}`;
}

/**
 * Set the ID attribute if the element does not already have one.
 *
 * @param {HTMLElement} element the element upon which to act.
 */
function setUniqueId(element) {
  if (null !== element && '' === element.id) {
    element.setAttribute('id', getUniqueId());
  }
}

export {
  getUniqueId,
  setUniqueId,
};
