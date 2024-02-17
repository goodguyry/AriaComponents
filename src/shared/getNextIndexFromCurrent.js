/**
 * Returns the next index based on the key pressed.
 *
 * @param {number} arg.index  The current item's index.
 * @param {number} arg.last   The index of the last item.
 * @param {string} key        The Event.key value.
 * @param {bool}   cycle:true Whether or not to cycle around from the ends.
 * @return {number} The next or previous item.
 */
export default function getNextIndexFromCurrent({ index, last }, key, cycle = true) {
  switch (key) {
    // Move to the first item.
    case 'Home': {
      return 0;
    }

    // Move to previous sibling, or the end if we're moving from the first child.
    case 'ArrowUp':
    case 'ArrowLeft': {
      if (0 === index) {
        return cycle ? last : 0;
      }

      return (index - 1);
    }

    // Move to the next sibling, or the first child if we're at the end.
    case 'ArrowDown':
    case 'ArrowRight': {
      if (last === index) {
        return cycle ? 0 : last;
      }

      return (index + 1);
    }

    // Move to the last item.
    case 'End': {
      return last;
    }

    default:
      // Do nothing.
      return index;
  }
}

/**
 * Returns an object mapping the curent index and index of the last item.
 *
 * @param {any}   item  An array item.
 * @param {array} items The array in which to locate item.
 * @return {object} The current index and last item index.
 */
function findIn(item, items) {
  return {
    index: items.indexOf(item),
    last: items.length - 1,
  };
}

export { findIn };
