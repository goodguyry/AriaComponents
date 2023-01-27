Dialog
======

Class for setting up an interactive Dialog element.

## Example

```html
<body>
  <div class="site-wrapper">
    <header></header>
    <main>
      <article>
        <h1>The Article Title</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.</p>

        <button aria-controls="dialog">Open dialog</button>
      </article>
    </main>
  </div>

  <div id="dialog" hidden>
    <button>Close</button>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </div>
</body>
```

```jsx
import { Dialog } from 'aria-components';

const controller = document.querySelector('[aria-controls="dialog"]');
const dialog = new Dialog(controller);
```

## Constructor

```jsx
Dialog(element: HTMLElement, options: object);
```
_**`element`**_  
> Either the element used to activate the Dialog target, or the Dialog target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

_**`options`**_  
> Configuration options.

### Available Options

_**`content`**_`= null`  
> The element or NodeList of elements that should be inaccessible when the Dialog element is open.

## API

### Instance Methods

Global methods and properties documented at [`src/README`](../).

_**`show()`**_
> Updates component state to show the target element.

_**`hide()`**_
> Updates component state to hide the target element.

_**`toString()`**_  
> `'[object Dialog]'`

_**`setCloseButton(closeButton: HTMLButtonElement)`**_
> Sets the given button element as the Dialog close button.  

### Properties

_**`expanded`**_ `boolean`  
> Set and get the component state.

_**`controller`**_ `HTMLButtonElement`  
> The Dialog's activating element.

_**`target`**_ `HTMLElement`  
> The Dialog's target element.

## Modules

```jsx
import Dialog, { ManageTabIndex } from 'aria-components/dialog';

const dialog = new Dialog(element, { modules: [ManageTabIndex] });
```

### Events

| Event | Description |
|:-----|:----|
| `'dialog.init'` | Fired after the component is initialized. |
| `'dialog.stateChange'` | Fired after component state is updated. |
| `'dialog.destroy'` | Fired after the component is destroyed. |

> **Note** Full event details documented at [`src/README`](../).

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
