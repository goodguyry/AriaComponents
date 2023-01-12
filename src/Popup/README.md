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
Popup(element = null, options = {});
```

_**`element`**_ `HTMLElement`  
> Either the element used to activate the Popup target, or the Popup target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`type`**_`= 'true'`  
> The string value of the Popup's `aria-haspopup` attribute, required to  
match the `role` attribute of the Popup container.

## API

### Instance Methods

See also [`src/README`](../).

_**`show()`**_  
> Updates component state to show the target element.

_**`hide()`**_  
> Updates component state to hide the target element.

_**`getState()`**_  
> Returns an object representing the current component state.
>
> _`state.expanded`_ `boolean`  
> Whether or not the Popup target is visible.

_**`destroy()`**_  
> Removes all attributes and event listeners added by this class.

_**`toString()`**_  
> Returns `'[object Popup]'`.

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
> Returns the Popup's activating element.

_**`target`**_  
> Returns the Popup's target element.

_**`firstInteractiveChild`**_  
> Returns the target's first interactive child element.

_**`lastInteractiveChild`**_  
> Returns the target's last interactive child element.

### Events

Events are namespaced by their component to avoid clashes with nested components.

#### `'popup.init'`

Fired after the component is initialized.

> `event.detail.instance` {Popup}  
> The instance from which the event originated.

#### `'popup.stateChange'`

Fired after component state is updated.

> `event.detail.instance` {Popup}  
> The instance from which the event originated.
>
> `event.detail.state` {object}  
> The current component state.
>
> `event.detail.props` {array}  
> The state properties that changed.

#### `'popup.destroy'`

Fired after the component is destroyed.

> `event.detail.instance` {Popup}  
> The instance from which the event originated.
>
> `event.detail.element` {HTMLElement}  
> the element passed to the constructor

## References

- https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
