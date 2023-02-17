/* eslint-disable no-console */

/**
 * Get the controller and target elements based on the given element's attributes.
 *
 * @param  {HTMLElement} element Either the controller or target element.
 * @return {object} The controller and target elements.
 */
const getElementPair = (element) => {
  let controller = null;
  let target = null;

  // Use the aria-controls attribute value to find the target element.
  if (element.hasAttribute('aria-controls')) {
    const elementControls = element.getAttribute('aria-controls');
    target = document.getElementById(elementControls);

    if (null === target) {
      // eslint-disable-next-line max-len
      console.error(`Configuration error: A target element with \`id="${elementControls}"\` is not found`);
    }

    return {
      controller: element,
      target,
    };
  }

  // Find the controlling element based on the target element's id attribute.
  if (element.hasAttribute('id')) {
    const elementId = element.id;
    controller = document.querySelector(`[aria-controls="${elementId}"]`);

    if (null === controller) {
      // eslint-disable-next-line max-len
      console.error(`Configuration error: A controlling element with \`aria-controls="${elementId}"\` is not found`);
    }

    return {
      controller,
      target: element,
    };
  }

  console.error('Configuration error: The element is missing the required attributes');
  return { controller: null, target: null };
};

export default getElementPair;
