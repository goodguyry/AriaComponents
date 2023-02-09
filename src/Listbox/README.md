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
import Listbox from 'aria-components/listbox';

const controller = document.querySelector('button[aria-controls]');
const listbox = new Listbox(controller);
```

## Constructor

```jsx
Listbox(element: HTMLElement);
```

**`element`** _(Required)_ Either the element used to activate the Listbox target, or the Listbox target element.

The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element. The component's events will dispatch from this element.

## Instance Methods

Global methods and properties documented at [`src/README`](../).

**`show()`** Sets the target element as visible to assistive technology.

**`hide()`** Sets the target element as hidden from assistive technology.

**`toString()`** Returns`'[object Listbox]'`.

## Properties

**`expanded`** Set and get the component state.

**`controller`** The Listbox's activating element.

**`target`** The Listbox's target element.

**`activeDescendant`** Set and get selected option.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'listbox.init'`**

Fired after the component is initialized.

`event.detail.instance` The class instance from which the event originated.

**`'listbox.stateChange'`**

Fired after component state is updated.

`event.detail.instance` The class instance from which the event originated.

`event.detail.expanded` The current expanded component state.

**`'listbox.destroy'`**

Fired after the component is destroyed.

`event.detail.instance` The class instance from which the event originated.

`event.detail.element` The element passed to the constructor.

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant
