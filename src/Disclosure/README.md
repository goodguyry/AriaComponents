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

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Disclosure, { ManageTabIndex } from 'aria-components/disclosure';
```

### ComponentConnector

Forces tab focus between a controller and target pair when they are not adjacent siblings.

### ManageTabIndex

Removes the target element's interactive children from the tab index when the 
target is hidden.

### UseButtonRole

Mimics a button for non-button controllers by using `role=button` and mapping the 
Space and Enter keys to `click` events

### UseHiddenAttribute

Hides the target element with the `hidden` attribute, removing the need to do it 
with CSS. Note that the use of the hidden attribute can hinder animations.

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
