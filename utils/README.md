src/lib/
=============

## `interactiveChildren`

```javascript
/**
 * Collect all interactive child elements.
 *
 * @param {HTMLElement} target The element in which to search for interactive children.
 *
 * @return {Array}
 */
import { interactiveChildren } from 'aria-components/utils';

const element = document.querySelector('div');
const interactiveChildElements = interactiveChildren(element);
```

## `Search`

```javascript
import { Search } from 'aria-components/utils';

const list = document.querySelector('ul');
const search = new Search(list);

list.addEventListener('keydown', (event) => {
  /**
   * Select the item that matches a search string.
   * If a match is found, return it so that it can be selected.
   *
   * @param {Number} key A keyCode value.
   * @return {HTMLElement|null} The matched element or null if no match.
   */
  const foundItem = search.getItem(event.keyCode);
});
```

## `isInstanceOf`

```javascript
import { isInstanceOf } from 'aria-components/utils';

const navUlElement = document.querySelectory('nav ul');

// Check if the nav list is an instance of the Menu component.
const isMenuBar = isInstanceOf('Menu', navUlElement.menu);
```
