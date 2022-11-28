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

```javascript
import { Dialog } from 'aria-components';

const target = document.getElementById('dialog');
const dialog = new Dialog(target);
```

## Constructor

```javascript
Dialog(target = null, options = {});
```

_**`target`**_ `HTMLElement`  
> The element used as the Dialog; required to have an `id` attribute with a value  
> matching the `aria-controls` attribute value of the controlling element.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`content`**_`= null`  
> The element or NodeList of elements that should be inaccessible when the Dialog element is open.

_**`useHiddenAttribute`**_`= true`  
> Whether to use the `hidden` attribute to manage the target element's visibility.
>
> Set to `false` if the target element needs to animate between states.

## API

### Instance Methods

See also [`src/README`](../).

_**`Dialog.setCloseButton(closeButton)`**_
> Helper for setting up the close button.  
> 
> _**`closeButton`**_ `HTMLButtonElement`  
> The button used to close the Dialog.

_**`Dialog.show()`**_
> Updates component state to show the target element.

_**`Dialog.hide()`**_
> Updates component state to hide the target element.

_**`Dialog.getState()`**_
> Returns an object representing the current component state.
>
> _`state.expanded`_ `boolean`  
> Whether or not the Dialog target is visible.

_**`Dialog.destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`Dialog.toString()`**_  
> Returns `'[object Dialog]'`.

_**`Dialog.on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`Dialog.off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`Dialog.controller`**_  
> Returns the Dialog's activating element.

_**`Dialog.target`**_  
> Returns the Dialog's target element.

_**`Dialog.content`**_
> An array of elements to be hidden while the Dialog is visible.

### Events

_**`init`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Dialog` instance from which the event originated.  

_**`stateChange`**_  
> Fired after component state is updated.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Dialog` instance from which the event originated.  
>
> _**`detail.props`**_  
> Returns an array of state properties that were updated.  
>
> _**`detail.state`**_  
> Returns an object representing the current component state.

_**`destroy`**_  
> Fired after the component is destroyed.

> **Event Properties**
> 
> _**`detail.element`**_  
> Returns the element passed to the `Dialog` instance.  
> 
> _**`detail.instance`**_  
> Returns the `Dialog` instance from which the event originated.  

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
