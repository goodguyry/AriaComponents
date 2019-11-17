/**
 * Check for elements required by `aria-describedby` ID references.
 *
 * @param {Array} helpIds HTML ID_REFs for elements containing help text.
 * @return {bool}
 */
function ariaDescribedbyElementsFound(helpIds) {
  const describeElements = document.querySelectorAll(helpIds.join());
  return (helpIds.length === describeElements.length);
}

/**
 * Warn if aria-decribedby elements are not found.
 * Without these elements, the references will be broken and potentially
 * confusing to users.
 *
 * @param {Array} helpIds HTML ID_REFs for elements containing help text.
 */
function missingDescribedByWarning(helpIds) {
  if (! ariaDescribedbyElementsFound(helpIds)) {
    // eslint-disable-next-line no-console, max-len
    console.warn('Some or all elements referenced by `aria-describedby` attributes are missing');
  }
}

export {
  ariaDescribedbyElementsFound,
  missingDescribedByWarning,
};
