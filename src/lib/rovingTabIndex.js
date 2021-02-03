import toArray from './toArray';

/**
 * Remove the tabIndex attribute from all elements.
 *
 * @param {Mixed} items An HTMLElement, NodeList, or array of elements.
 */
function tabIndexAllow(items) {
  const allowedElements = toArray(items);

  allowedElements.forEach((item) => {
    item.removeAttribute('tabindex');
  });
}

/**
 * Add a negative tabIndex attribute to all elements.
 *
 * @param {Mixed} items An HTMLElement, NodeList, or Array of elements.
 */
function tabIndexDeny(items) {
  const deniedElements = toArray(items);

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
  const allowedElements = toArray(allow);
  const allItems = toArray(items);

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
};
