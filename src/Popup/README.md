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

**`element`** - _(Required)_ Either the element used to activate the Popup target, or the Popup target element.

The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element. The component's events will dispatch from this element.

**`options`** - _(Optional)_ Configuration options.

### Available Options

**`type`** - The string value of the Popup's `aria-haspopup` attribute, required to match the `role` attribute of the Popup container. _Default is `'true'`_

**`modules`** - A single module, or array of modules, to initialize. _Default is `[]`_

## Instance Methods

Global methods and properties documented at [`src/README`](../).

**`show()`** - Sets the target element as visible to assistive technology.

**`hide()`** - Sets the target element as hidden from assistive technology.

**`toString()`** - Returns `'[object Popup]'`.

## Properties

**`expanded`** - Set and get the component state.

**`controller`** - The Popup's activating element.

**`target`** - The Popup's target element.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'popup.init'`**

Fired after the component is initialized.

`event.detail.instance` - The class instance from which the event originated.

**`'popup.stateChange'`**

Fired after component state is updated.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.expanded` - The current expanded component state.

**`'popup.destroy'`**

Fired after the component is destroyed.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.element` - The element passed to the constructor.

## Modules

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Popup, { ManageTabIndex } from 'aria-components/popup'
```

**`ComponentConnector`**

Forces tab focus between a controller and target pair when they are not adjacent siblings.

**`ManageTabIndex`**

Removes the target element's interactive children from the tab index when the target is hidden.

**`UseButtonRole`**

Mimics a button for non-button controllers by using `role=button` and mapping the Space and Enter keys to `click` events

**`UseHiddenAttribute`**

Hides the target element with the `hidden` attribute, removing the need to do it with CSS. Note that the use of the hidden attribute can hinder animations.

## References

- https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
