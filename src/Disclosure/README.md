Disclosure
==========

Class for independently revealing and hiding inline content.

## Constructor

```jsx
new Disclosure(element = null, options = {});
```

_**`element`**_ `HTMLElement`  
> Either the element used to activate the Disclosure target, or the Disclosure target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

_**`options`**_ `object`  
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
> Returns `'[object Disclosure]'`.

### Properties

_**`controller`**_  
> Returns the Disclosure's activating element.

_**`target`**_  
> Returns the Disclosure's target element.

### Events

Events are namespaced by their component to avoid clashes with nested components.

#### `'disclosure.init'`

Fired after the component is initialized.

> `event.detail.instance` {Disclosure}  
> The instance from which the event originated.

#### `'disclosure.stateChange'`

Fired after component state is updated.

> `event.detail.instance` {Disclosure}  
> The instance from which the event originated.
>
> `event.detail.state` {object}  
> The current component state.
>
> `event.detail.props` {array}  
> The state properties that changed.

#### `'disclosure.destroy'`

Fired after the component is destroyed.

> `event.detail.instance` {Disclosure}  
> The instance from which the event originated.
>
> `event.detail.element` {HTMLElement}  
> the element passed to the constructor

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
