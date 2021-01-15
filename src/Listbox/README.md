Listbox
=======

Class to set up an interactive Listbox element.

## Config Object

```javascript
const config = {
  /**
   * The element used to trigger the Listbox Popup.
   *
   * @type {HTMLButtonElement}
   */
  controller: null,

  /**
   * The Listbox element.
   *
   * @type {HTMLUListElement}
   */
  target: null,

  /**
   * Callback to run after the component initializes.
   *
   * @callback initCallback
   */
  onInit: () => {},

  /**
   * Callback to run after component state is updated.
   *
   * @callback stateChangeCallback
   */
  onStateChange: () => {},

  /**
   * Callback to run after the component is destroyed.
   *
   * @callback destroyCallback
   */
  onDestroy: () => {},
};
```

## Methods

> See also [`src/README`](../).

```javascript
/**
 * Show the Listbox.
 */
show();
```

```javascript
/**
 * Hide the Listbox.
 */
hide();
```

```javascript
/**
 * Return the current component state.
 *
 * @return {object}
 */
getState();
```

```javascript
/**
 * Collect and configure ListBox options.
 */
setListBoxOptions();
```

```javascript
/**
 * Collect and prepare the target element's interactive child elements.
 * 
 * @see Popup component
 */
setInteractiveChildren();
```

```javascript
/**
 * Destroy the Listbox and Popup.
 */
destroy();
```

## Instance Properties

```javascript
/**
 * The config.controller property.
 *
 * @type {HTMLButtonElement}
 */
controller
```

```javascript
/**
 * The config.target property.
 *
 * @type {HTMLUListElement}
 */
target
```

```javascript
/**
 * The target list items.
 *
 * @type {array}
 */
options
```

```javascript
/**
 * The first Listbox option.
 *
 * @type {HTMLLIElement}
 */
firstOption
```

```javascript
/**
 * The last Listbox option.
 *
 * @type {HTMLLIElement}
 */
lastOption
```

```javascript
/**
 * The Popup instance controlling the ListBox.
 * 
 * @type {Popup}
 * {@link https://github.com/goodguyry/AriaComponents/blob/master/src/Popup}
 */
popup
```

## Example

```html
<button>Choose</button>
<ul>
  <li>Anchorage</li>
  <li>Baltimore</li>
  <li>Chicago</li>
  <li>Dallas</li>
  <li>El Paso</li>
  <li>Fort Lauderdale</li>
  <li>Grand Rapids</li>
  <li>Hartford</li>
  <li>Idaho Falls</li>
</ul>
```

```javascript
import { Listbox } from 'aria-components';

const controller = document.querySelector('button');
const target = document.querySelector('ul');

const listbox = new Listbox({
  controller,
  target,
  onInit: () => {
    console.log('Listbox initialized.');
  },
  onStateChange: () => {
    console.log('Listbox state was updated.');
  },
  onDestroy: () => {
    console.log('Listbox destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
- https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant
