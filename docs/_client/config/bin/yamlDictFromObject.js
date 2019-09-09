/**
 * Convert a JavaScript object to a YAML Dictionary.
 *
 * @param  {Object} obj A map of value pairs.
 *
 * @return {String}
 */
module.exports = (obj) => Object.keys(obj).reduce((acc, key) => {
  const pairs = Object.keys(obj[key])
    .reduce((pairAcc, assetKey) => (
      pairAcc.length
        ? `${pairAcc}, ${assetKey}: '${obj[key][assetKey]}'`
        : `${assetKey}: '${obj[key][assetKey]}'`
    ), '');

  return `${acc}${key}: { ${pairs} }\n`;
}, '');
