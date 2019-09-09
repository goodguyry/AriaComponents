/**
 * Formats classnames from a given namespace
 * Essentially just adds a '.' to the beginning of classnames
 *
 * @param {Object} namespace The namespace within which to format classnames.
 * @return {Object}
 */
export default function getClassnames(namespace) {
  return Object.keys(namespace).reduce((acc, key) => {
    acc[key] = `.${namespace[key]}`;
    return acc;
  }, {});
}
