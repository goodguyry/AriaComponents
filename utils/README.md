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

## `rovingTabIndex`

```javascript
import { 
  rovingTabIndex, 
  tabIndexAllow, 
  tabIndexDeny,
  interactiveChildren,
} from 'aria-components/utils';

const element = document.querySelector('div');
const interactiveChildElements = interactiveChildren(element);

// Allow tabbing to interactive child elements.
tabIndexAllow(interactiveChildElements);

// Deny tabbing to interactive child elements.
tabIndexDeny(interactiveChildElements);

// Deny tabbing to all but the first interactive child element.
const [firstChild] = interactiveChildElements;
rovingTabIndex(interactiveChildElements, firstChild);
```

## `uniqueId`

```javascript
import { setUniqueId, getUniqueId } from 'aria-components/utils';

const button = document.querySelector('button');
setUniqueId(button); // button.id = 'id_5c16045tmd'

button.id = getUniqueId(); // 'id_9y0541qs1tk'
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
