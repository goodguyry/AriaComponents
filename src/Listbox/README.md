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

_**`element`**_  
> Either the element used to activate the Listbox target, or the Listbox target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

## API

### Instance Methods

Global methods and properties documented at [`src/README`](../).

_**`show()`**_  
> Updates component state to show the target element.

_**`hide()`**_  
> Updates component state to hide the target element.

_**`toString()`**_  
> `'[object Listbox]'`

### Properties

_**`expanded`**_ `boolean`  
> Set and get the component state.

_**`controller`**_ `HTMLButtonElement`  
> The Listbox's activating element.

_**`target`**_ `HTMLElement`  
> The Listbox's target element.

_**`options`**_ `array`  
> The target element's list items.

_**`activeDescendant`**_ `HTMLElement`  
> Set and get selected option.

### Events

Events are namespaced by their component to avoid clashes with nested components.

_**`'listbox.init'`**_

> Fired after the component is initialized.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |

_**`'listbox.stateChange'`**_

> Fired after component state is updated.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.expanded` | The current expanded component state. | `boolean` |

_**`'listbox.destroy'`**_

> Fired after the component is destroyed.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.element` | The element passed to the constructor. | `HTMLElement` |

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant
