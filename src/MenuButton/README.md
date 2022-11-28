MenuButton
==========

Class for setting up an interactive popup button to activate a target menu element.

## Example

```html
<button aria-controls="menu">Open</button>
<div id="menu">
  <ul>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
  </ul>
</div>
```

```javascript
import { MenuButton } from 'aria-components';

const controller = document.querySelector('button[target]');
const menuButton = new MenuButton(controller);
```

## Constructor

```javascript
MenuButton(controller = null, options = {});
```

_**`controller`**_ `HTMLElement`  
> The element used to activate the MenuButton target; required to have a  
> `aria-controls` attribute with a value matching the `id` attribute value of the  
> target element.

_**`options`**_ `object`  
> Configuration options.

### Available Options

`MenuButton` extends `Popup` and passes its own `type` option, which can't be overriden.  
All other [`Popup` options](../Popup/README.md) are available for `MenuButton`.

#### Additional Options

_**`list`**_`= null`  
> Use this option if neither of the following should be used as the Menu list:  
> 1. The target element, if it is an instance of `HTMLUListElement`
> 2. The value returned by `target.querySelector('ul')`

## API

### Instance Methods

See also [`src/README`](../).

_**`MenuButton.show()`**_  
> Updates component state to show the target element.

_**`MenuButton.hide()`**_  
> Updates component state to hide the target element.

_**`MenuButton.getState()`**_  
> Returns an object representing the current component state.
>
> _`state.expanded`_ `boolean`  
> Whether or not the MenuButton's target is visible.

_**`MenuButton.destroy()`**_  
> Removes all attributes and event listeners added by this class.

_**`MenuButton.toString()`**_  
> Returns `'[object MenuButton]'`.

_**`MenuButton.on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`MenuButton.off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`MenuButton.controller`**_  
> Returns the MenuButton's activating element.

_**`MenuButton.target`**_  
> Returns the MenuButton's target element.

_**`MenuButton.list`**_  
> Returns the MenuButton's Menu list element.

_**`MenuButton.popup`**_  
> Returns the [Popup](https://github.com/goodguyry/AriaComponents/blob/master/src/Popup) instance controlling the MenuButton.

### Events

_**`init`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `MenuButton` instance from which the event originated.  

_**`stateChange`**_  
> Fired after component state is updated.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `MenuButton` instance from which the event originated.  
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
> Returns the element passed to the `MenuButton` instance.  
> 
> _**`detail.instance`**_  
> Returns the `MenuButton` instance from which the event originated.  

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/menu-button/menu-button-links.html
