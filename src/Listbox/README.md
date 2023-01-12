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
Listbox(element = null, options = {});
```

_**`element`**_ `HTMLElement`  
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

See also [`src/README`](../).

_**`show()`**_  
> Updates component state to show the target element.

_**`hide()`**_  
> Updates component state to hide the target element.

_**`getState()`**_  
> Returns an object representing the current component state.
>
> _`state.activeDescendant`_ `HTMLElement`  
> The active Listbox option.

_**`destroy()`**_  
> Removes all attributes and event listeners added by this class.

_**`toString()`**_  
> Returns `'[object Listbox]'`.

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
> Returns the Listbox's activating element.

_**`target`**_  
> Returns the Listbox's target element.

_**`options`**_  
> Returns an array of the target element's list items.

_**`firstOption`**_  
> Returns the first Listbox option element.

_**`lastOption`**_  
> Returns the last Listbox option element.

### Events

Events are namespaced by their component to avoid clashes with nested components.

#### `'listbox.init'`

Fired after the component is initialized.

> `event.detail.instance` {Listbox}  
> The instance from which the event originated.

#### `'listbox.stateChange'`

Fired after component state is updated.

> `event.detail.instance` {Listbox}  
> The instance from which the event originated.
>
> `event.detail.state` {object}  
> The current component state.
>
> `event.detail.props` {array}  
> The state properties that changed.

#### `'listbox.destroy'`

Fired after the component is destroyed.

> `event.detail.instance` {Listbox}  
> The instance from which the event originated.
>
> `event.detail.element` {HTMLElement}  
> the element passed to the constructor

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant
