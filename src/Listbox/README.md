Listbox
=======

Class for setting up an interactive Listbox element.

## Example

```html
<button target="options">Choose</button>
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

```javascript
import { Listbox } from 'aria-components';

const controller = document.querySelector('button[target]');
const listbox = new Listbox(controller);
```

## Constructor

```javascript
Listbox(controller = null);
```

_**`controller`**_ `HTMLElement`  
> The element used to activate the Listbox target; required to have a `target`  
attribute with a value matching the `id` attribute value of the target element.

## API

### Instance Methods

See also [`src/README`](../).

_**`Listbox.show()`**_  
> Updates component state to show the target element.

_**`Listbox.hide()`**_  
> Updates component state to hide the target element.

_**`Listbox.getState()`**_  
> Returns an object representing the current component state.
>
> _`state.activeDescendant`_ `HTMLElement`  
> The active Listbox option.

_**`Listbox.destroy()`**_  
> Removes all attributes and event listeners added by this class.

_**`Listbox.toString()`**_  
> Returns `'[object AriaListbox]'`.

### Properties

_**`Listbox.controller`**_  
> Returns the Listbox's activating element.

_**`Listbox.target`**_  
> Returns the Listbox's target element.

_**`Listbox.options`**_  
> Returns an array of the target element's list items.

_**`Listbox.firstOption`**_  
> Returns the first Listbox option element.

_**`Listbox.lastOption`**_  
> Returns the last Listbox option element.

_**`Listbox.popup`**_  
> Returns the [Popup](https://github.com/goodguyry/AriaComponents/blob/master/src/Popup) instance controlling the Listbox.

### Events

_**`init`**_  
> Fired after the component is initialized.

_**`stateChange`**_  
> Fired after component state is updated.

_**`destroy`**_  
> Fired after the component is destroyed.

#### Event Properties

_**`CustomEvent.detail.instance`**_
> Returns the `Listbox` instance from which the event originated.

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
- https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant
