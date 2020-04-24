import { toArray } from './rovingTabIndex';

/**
 * Get the first and last items from and Array or NodeList.
 *
 * @param  {array|NodeList} items The Array or NodeList from which to retrieve the items.
 * @return {array}                The first and last items.
 */
export default function getFirstAndLastItems(items) {
  // Ensure we're working with an Array;
  const arrayOfItems = toArray(items);
  const lastIndex = (arrayOfItems.length - 1);

  // Get the first and last items by index.
  const {
    0: firstItem,
    [lastIndex]: lastItem,
  } = arrayOfItems;

  return [firstItem, lastItem];
}
