/**
 * Manage items' tabindex.
 *
 * @param {NodeList|Array}             items The items whose tabindex may need updating.
 * @param {HTMLElement|NodeList|Array} allow The item to which we'll allow tabbing.
 */
function rovingTabIndex(items, allow) {
  let allowedElements = Array.isArray(allow) ? allow : [];

  // Convert allowed ellement(s) to an Array.
  if (allow instanceof HTMLElement || allow instanceof Node) {
    allowedElements = new Array(allow);
  } else if (allow instanceof NodeList) {
    // Array.from(allow);
    allowedElements = Array.prototype.slice.call(allow, 0);
  }

  Array.prototype.forEach.call(items, (item) => {
    if (allowedElements.includes(item)) {
      item.removeAttribute('tabindex');
    } else {
      item.setAttribute('tabindex', '-1');
    }
  });
}

export default rovingTabIndex;
