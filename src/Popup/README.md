Popup
=====

Class for setting up an interactive popup button to activate a target element.

## Example

```html
<button aria-controls="popup">Open</button>
<div id="popup">
  <ul>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
  </ul>
</div>
```

```jsx
import { Popup } from 'aria-components';

const controller = document.querySelector('button[target]');
const popup = new Popup(controller);
```

## Constructor

```jsx
Popup(element: HTMLElement, options: object);
```

_**`element`**_  
> Either the element used to activate the Popup target, or the Popup target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

_**`options`**_  
> Configuration options.

### Available Options

_**`type`**_`= 'true'`  
> The string value of the Popup's `aria-haspopup` attribute, required to  
match the `role` attribute of the Popup container.

## API

### Instance Methods

Global methods and properties documented at [`src/README`](../).

_**`show()`**_  
> Updates component state to show the target element.

_**`hide()`**_  
> Updates component state to hide the target element.

_**`toString()`**_  
> `'[object Popup]'`

### Properties

_**`expanded`**_ `boolean`  
> Set and get the component state.

_**`controller`**_ `HTMLButtonElement`  
> The Popup's activating element.

_**`target`**_ `HTMLElement`  
> The Popup's target element.

### Events

| Event | Description |
|:-----|:----|
| `'popup.init'` | Fired after the component is initialized. |
| `'popup.stateChange'` | Fired after component state is updated. |
| `'popup.destroy'` | Fired after the component is destroyed. |

> **Note** Full event details documented at [`src/README`](../).

## References

- https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
