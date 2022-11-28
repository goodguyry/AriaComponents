Disclosure
==========

Class for independently revealing and hiding inline content.

## Example

```html
<button aria-controls="disclosure">Open</button>
<div id="disclosure">
  <ul>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
  </ul>
</div>
```

```javascript
import { Disclosure } from 'aria-components';

const controller = document.querySelector('button[target]');
const disclosure = new Disclosure(controller);
```

## Constructor

```javascript
Disclosure(controller = null, options = {});
```

_**`controller`**_ `HTMLElement`  
> The element used to activate the Disclosure target; required to have a `aria-controls`  
attribute with a value matching the `id` attribute value of the target element.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`loadOpen`**_`= false`  
> Whether to load the Disclosure open.

_**`allowOutsideClick`**_`= true`  
> Whether to keep the Disclosure open when clicking outside of it.

_**`useHiddenAttribute`**_`= true`  
> Whether to use the `hidden` attribute to manage the target element's visibility.
>
> Set to `false` if the target element needs to animate between states.

## API

### Instance Methods

See also [`src/README`](../).

_**`Disclosure.show()`**_
> Updates component state to show the target element.

_**`Disclosure.hide()`**_
> Updates component state to hide the target element.

_**`Disclosure.getState()`**_
> Returns an object representing the current component state.
>
> _`state.expanded`_ `boolean`  
> Whether or not the Disclosure target is visible.

_**`Disclosure.destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`Disclosure.toString()`**_  
> Returns `'[object Disclosure]'`.

_**`Disclosure.on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`Disclosure.off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`Disclosure.controller`**_  
> Returns the Disclosure's activating element.

_**`Disclosure.target`**_  
> Returns the Disclosure's target element.

### Events

_**`init`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Disclosure` instance from which the event originated.  

_**`stateChange`**_  
> Fired after component state is updated.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Disclosure` instance from which the event originated.  
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
> Returns the element passed to the `Disclosure` instance.  
> 
> _**`detail.instance`**_  
> Returns the `Disclosure` instance from which the event originated.  

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
