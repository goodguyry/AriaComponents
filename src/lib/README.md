src/lib/
=============

The following modules are likely the most suitable in this directory for general use.

## `interactiveChildren`

```javascript
/**
 * Collect all interactive child elements.
 *
 * @param {HTMLElement} target The element in which to search for interactive children.
 *
 * @return {Array}
 */
import { interactiveChildren } from 'aria-components/src/lib';

const element = document.querySelector('div');
const interactiveChildElements = interactiveChildren(element);
```

## `keyCodes`

```javascript
/**
 * Event keyCode values mapped to a key name.
 */
import { keyCodes } from 'aria-components/src/lib';

document.querySelector('ul').addEventListener('keydown', (event) => {
  const { SPACE, RETURN } = keyCodes;

  if ([SPACE, RETURN].includes(event.keyCode)) {
    this.popup.hide();
  }
});
```

## `rovingTabIndex`

```javascript
import { 
  rovingTabIndex, 
  tabIndexAllow, 
  tabIndexDeny,
  interactiveChildren,
} from 'aria-components/src/lib';

const element = document.querySelector('div');
const interactiveChildElements = interactiveChildren(element);

// Allow tabbing to interactive child elements.
tabIndexAllow(interactiveChildElements);

// Deny tabbing to interactive child elements.
tabIndexDeny(interactiveChildElements);

// Denay tabbing to all but the first interactive child element.
const [firstChild] = interactiveChildElements;
rovingTabIndex(interactiveChildElements, firstChild);
```

## `setUniqueId`

```javascript
import { setUniqueId } from 'aria-components/src/lib';

const button = document.querySelector('button');
setUniqueId(button); // button.id = 'id_5c16045tmd'
```

## `Search`

```javascript
import { Search } from 'aria-components/src/lib';

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
