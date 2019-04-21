/**
 * Create a passably unique `id` attribute.
 *
 * @param {Number} radix An optional base for converting the Number to a String.
 *
 * @returns {String}
 */
function uniqueId(radix = 36) {
  const [, attr] = Math.random().toString(radix).split('.');
  return `id_${attr}`;
}

export default uniqueId;
