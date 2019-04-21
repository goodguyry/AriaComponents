/**
 * Create an element for displaying text to screen readers.
 *
 * @param {String} id        The id for the containing element.
 * @param {String} innerText The text to display to screen readers.
 *
 * @return {HTMLElement}
 */
function createScreenReaderText(id, innerText) {
  const span = document.createElement('span');
  span.classList.add('screen-reader-text');
  Object.assign(span, { id, innerText });

  return span;
}

export default createScreenReaderText;
