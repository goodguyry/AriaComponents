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
class ListBox extends AriaComponent {
  /**
   * Show the Listbox.
   */
  show();

  /**
   * Hide the Listbox.
   */
  hide();

  /**
   * Return the current component state.
   *
   * @return {object}
   */
  getState();

  /**
   * Destroy the Listbox and Popup.
   */
  destroy();
}
```

## Properties

```javascript
/**
 * The config.controller property.
 *
 * @type {HTMLButtonElement}
 */
ListBox.controller
```

```javascript
/**
 * The config.target property.
 *
 * @type {HTMLUListElement}
 */
ListBox.target
```

```javascript
/**
 * The target list items.
 *
 * @type {array}
 */
Listbox.options
```

```javascript
/**
 * The first Listbox option.
 *
 * @type {HTMLLIElement}
 */
ListBox.firstOption
```

```javascript
/**
 * The last Listbox option.
 *
 * @type {HTMLLIElement}
 */
ListBox.lastOption
```

```javascript
/**
 * The Popup instance controlling the ListBox.
 * 
 * @type {Popup}
 * {@link https://github.com/goodguyry/AriaComponents/blob/master/src/Popup}
 */
ListBox.popup
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
import { Listbox } from 'AriaComponents';

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
