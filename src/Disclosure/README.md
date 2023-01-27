Disclosure
==========

Class for independently revealing and hiding inline content.

## Constructor

```jsx
new Disclosure(element: HTMLElement, options: object);
```

_**`element`**_  
> Either the element used to activate the Disclosure target, or the Disclosure target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

_**`options`**_  
> Configuration options.

### Available Options

_**`loadOpen`**_`= false`  
> Set the Disclosure open on load.

_**`allowOutsideClick`**_`= true`  
> Keep the Disclosure open when the user interacts with external content.

_**`autoClose`**_`= false`  
> Automatically close the Disclosure after tabbing from its last child.

## API

### Instance Methods

Global methods and properties documented at [`src/README`](../).

_**`show()`**_
> Updates component state to show the target element.

_**`hide()`**_
> Updates component state to hide the target element.

_**`toString()`**_  
> `'[object Disclosure]'`.

### Properties

_**`expanded`**_ `boolean`  
> Set and get the component state.

_**`controller`**_ `HTMLButtonElement`  
> The Disclosure's activating element.

_**`target`**_ `HTMLElement`  
> The Disclosure's target element.

### Events

| Event | Description |
|:-----|:----|
| `'disclosure.init'` | Fired after the component is initialized. |
| `'disclosure.stateChange'` | Fired after component state is updated. |
| `'disclosure.destroy'` | Fired after the component is destroyed. |

> **Note** Full event details documented at [`src/README`](../).

## Modules

```jsx
import Disclosure, { ManageTabIndex } from 'aria-components/disclosure';

const disclosure = new Disclosure(element, { modules: [ManageTabIndex] });
```

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
