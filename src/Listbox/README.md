Listbox
=======

Class for setting up an interactive Listbox element.

## Example

```html
<button aria-controls="options">Choose</button>
<ul id="options">
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

```jsx
import { Listbox } from 'aria-components';

const controller = document.querySelector('button[aria-controls]');
const listbox = new Listbox(controller);
```

## Constructor

```jsx
Listbox(element: HTMLElement, options: object);
```

_**`element`**_  
> Either the element used to activate the Listbox target, or the Listbox target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

### Available Options

`Listbox` extends `Popup` and passes its own `type` option, which can't be 
overriden. All other [`Popup` options](../Popup/README.md) are available for `Listbox`.

## API

### Instance Methods

Global methods and properties documented at [`src/README`](../).

_**`show()`**_  
> Updates component state to show the target element.

_**`hide()`**_  
> Updates component state to hide the target element.

_**`toString()`**_  
> `'[object Listbox]'`

### Properties

_**`expanded`**_ `boolean`  
> Set and get the component state.

_**`controller`**_ `HTMLButtonElement`  
> The Listbox's activating element.

_**`target`**_ `HTMLElement`  
> The Listbox's target element.

_**`options`**_ `array`  
> The target element's list items.

_**`activeDescendant`**_ `HTMLElement`  
> Set and get selected option.

### Events

| Event | Description |
|:-----|:----|
| `'listbox.init'` | Fired after the component is initialized. |
| `'listbox.stateChange'` | Fired after component state is updated. |
| `'listbox.destroy'` | Fired after the component is destroyed. |

> **Note** Full event details documented at [`src/README`](../).

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant
