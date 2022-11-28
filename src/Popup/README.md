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

```javascript
import { Popup } from 'aria-components';

const controller = document.querySelector('button[target]');
const popup = new Popup(controller);
```

## Constructor

```javascript
Popup(controller = null, options = {});
```

_**`controller`**_ `HTMLElement`  
> The element used to activate the Popup target; required to have a `aria-controls`  
attribute with a value matching the `id` attribute value of the target element.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`type`**_`= 'true'`  
> The string value of the Popup's `aria-haspopup` attribute, required to  
match the `role` attribute of the Popup container.

_**`useHiddenAttribute`**_`= true`  
> Whether to use the `hidden` attribute to manage the target element's visibility.
>
> Set to `false` if the target element needs to animate between states.

## API

### Instance Methods

See also [`src/README`](../).

_**`Popup.show()`**_  
> Updates component state to show the target element.

_**`Popup.hide()`**_  
> Updates component state to hide the target element.

_**`Popup.getState()`**_  
> Returns an object representing the current component state.
>
> _`state.expanded`_ `boolean`  
> Whether or not the Popup target is visible.

_**`Popup.destroy()`**_  
> Removes all attributes and event listeners added by this class.

_**`Popup.toString()`**_  
> Returns `'[object Popup]'`.

_**`Popup.on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`Popup.off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`Popup.controller`**_  
> Returns the Popup's activating element.

_**`Popup.target`**_  
> Returns the Popup's target element.

_**`Popup.firstInteractiveChild`**_  
> Returns the target's first interactive child element.

_**`Popup.lastInteractiveChild`**_  
> Returns the target's last interactive child element.

### Events

_**`init`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Popup` instance from which the event originated.  

_**`stateChange`**_  
> Fired after component state is updated.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Popup` instance from which the event originated.  
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
> Returns the element passed to the `Popup` instance.  
> 
> _**`detail.instance`**_  
> Returns the `Popup` instance from which the event originated.  

## References

- https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
