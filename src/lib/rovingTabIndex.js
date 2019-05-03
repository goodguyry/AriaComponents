/**
 * Create an array from a value.
 *
 * @param {Mixed} maybeAnArray And HTMLElement, NodeList, or Array of elements.
 */
function toArray(maybeAnArray) {
  if (Array.isArray(maybeAnArray)) {
    return maybeAnArray;
  }

  let shouldBeAnArray = [];

  if (maybeAnArray instanceof HTMLElement) {
    // Convert element(s) to an Array.
    shouldBeAnArray = new Array(maybeAnArray);
  } else if (maybeAnArray instanceof NodeList) {
    // Array.from(maybeAnArray);
    shouldBeAnArray = Array.prototype.slice.call(maybeAnArray, 0);
  }

  return shouldBeAnArray;
}

/**
 * Remove the tabIndex attribute from all elements.
 *
 * @param  {Mixed} items And HTMLElement, NodeList, or Array of elements.
 */
function tabIndexAllow(items) {
  const allowedElements = Array.isArray(items) ? items : toArray(items);

  allowedElements.forEach((item) => {
    item.removeAttribute('tabindex');
  });
}

/**
 * Add a negative tabIndex attribute to all elements.
 *
 * @param  {Mixed} items And HTMLElement, NodeList, or Array of elements.
 */
function tabIndexDeny(items) {
  const deniedElements = Array.isArray(items) ? items : toArray(items);

  deniedElements.forEach((item) => {
    item.setAttribute('tabindex', '-1');
  });
}

/**
 * Manage items' tabindex.
 *
 * @param {NodeList|Array}             items The items whose tabindex may need updating.
 * @param {HTMLElement|NodeList|Array} allow The item to which we'll allow tabbing.
 */
function rovingTabIndex(items, allow) {
  const allowedElements = Array.isArray(allow) ? allow : toArray(allow);
  const allItems = Array.isArray(items) ? items : toArray(items);

  tabIndexAllow(allowedElements);

  if (0 < allItems.length) {
    const deniedElements = allItems.filter((item) => (
      ! allowedElements.includes(item)
    ));
    tabIndexDeny(deniedElements);
  }
}

export {
  rovingTabIndex,
  tabIndexAllow,
  tabIndexDeny,
  toArray,
};
