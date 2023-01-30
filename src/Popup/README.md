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

```jsx
import Popup from 'aria-components/popup';

const controller = document.querySelector('button[target]');
const popup = new Popup(controller);
```

## Constructor

```jsx
Popup(element: HTMLElement, options: object);
```

_**`element`**_  
> Either the element used to activate the Popup target, or the Popup target element.
> 
> The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element.
>
> **Note** The component's events will dispatch from this element.

_**`options`**_  
> Configuration options.

### Available Options

_**`type`**_`= 'true'`  
> The string value of the Popup's `aria-haspopup` attribute, required to  
match the `role` attribute of the Popup container.

## API

### Instance Methods

Global methods and properties documented at [`src/README`](../).

_**`show()`**_  
> Updates component state to show the target element.

_**`hide()`**_  
> Updates component state to hide the target element.

_**`toString()`**_  
> `'[object Popup]'`

### Properties

_**`expanded`**_ `boolean`  
> Set and get the component state.

_**`controller`**_ `HTMLButtonElement`  
> The Popup's activating element.

_**`target`**_ `HTMLElement`  
> The Popup's target element.

### Events

Events are namespaced by their component to avoid clashes with nested components.

_**`'popup.init'`**_

> Fired after the component is initialized.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |

_**`'popup.stateChange'`**_

> Fired after component state is updated.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.expanded` | The current expanded component state. | `boolean` |

_**`'popup.destroy'`**_

> Fired after the component is destroyed.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.element` | The element passed to the constructor. | `HTMLElement` |

## Modules

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Popup, { ManageTabIndex } from 'aria-components/popup'
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

- https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
