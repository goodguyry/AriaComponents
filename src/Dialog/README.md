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
Dialog(element = null, options = {});
```
_**`element`**_ `HTMLElement`  
> Either the element used to activate the Dialog target, or the Dialog target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`content`**_`= null`  
> The element or NodeList of elements that should be inaccessible when the Dialog element is open.

## API

### Instance Methods

See also [`src/README`](../).

_**`setCloseButton(closeButton)`**_
> Helper for setting up the close button.  
> 
> _**`closeButton`**_ `HTMLButtonElement`  
> The button used to close the Dialog.

_**`show()`**_
> Updates component state to show the target element.

_**`hide()`**_
> Updates component state to hide the target element.

_**`getState()`**_
> Returns an object representing the current component state.
>
> _`state.expanded`_ `boolean`  
> Whether or not the Dialog target is visible.

_**`destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`toString()`**_  
> Returns `'[object Dialog]'`.

_**`on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`element`**_  
> Returns the element passed to the constructor.

_**`controller`**_  
> Returns the Dialog's activating element.

_**`target`**_  
> Returns the Dialog's target element.

_**`content`**_
> An array of elements to be hidden while the Dialog is visible.

### Events

Events are namespaced by their component to avoid clashes with nested components.

#### `'dialog.init'`

Fired after the component is initialized.

> `event.detail.instance` {Dialog}  
> The instance from which the event originated.

#### `'dialog.stateChange'`

Fired after component state is updated.

> `event.detail.instance` {Dialog}  
> The instance from which the event originated.
>
> `event.detail.state` {object}  
> The current component state.
>
> `event.detail.props` {array}  
> The state properties that changed.

#### `'dialog.destroy'`

Fired after the component is destroyed.

> `event.detail.instance` {Dialog}  
> The instance from which the event originated.
>
> `event.detail.element` {HTMLElement}  
> the element passed to the constructor

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
