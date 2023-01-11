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

## `isInstanceOf`

```javascript
import { isInstanceOf } from 'aria-components/utils';

const navUlElement = document.querySelectory('nav ul');

// Check if the nav list is an instance of the Menu component.
const isMenuBar = isInstanceOf('Menu', navUlElement.menu);
```
