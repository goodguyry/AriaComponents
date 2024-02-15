/**
 * Returns the next or previous item from the array.
 *
 * @param  {bool}        key           The Event.key value.
 * @param  {HTMLElement} activeElement The currently active item.
 * @param  {array}       menuItems     The collective menu items.
 * @param  {bool}        cycle:true    Whether or not to cycle around from the ends.
 * @return {HTMLElement} The next or previous item.
 */
export default function nextPrevious(key, activeElement, menuItems, cycle = true) {
  const activeIndex = menuItems.indexOf(activeElement);
  const menuLastIndex = (menuItems.length - 1);

  if ('undefined' === typeof key) {
    return activeElement;
  }

  // Determine the direction.
  let newIndex = ['ArrowDown', 'ArrowRight'].includes(key)
    ? activeIndex + 1
    : activeIndex - 1;

  /*
   * When cycling, move to the last item if we've moved out of the lower bounds
   * of the array. Otherwise, correct the index to remain within the bounds.
   */
  if (0 > newIndex) {
    newIndex = cycle ? menuLastIndex : 0;
  }

  /*
   * When cycling, move to first item if we've moved out of the upper bounds of
   * the array. Otherwise, correct the index to remain within the bounds.
   */
  if (menuLastIndex < newIndex) {
    newIndex = cycle ? 0 : menuLastIndex;
  }

  return menuItems[newIndex];
}
