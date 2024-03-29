Disclosure
==========

Class for independently revealing and hiding inline content.

## Contents

* [Constructor](#constructor)
  * [Available Options](#available-options)
* [Instance Methods](#instance-methods)
* [Properties](#properties)
* [Events](#events)
* [Modules](#modules)
* [Additional Information](#additional-information)
* [References](#references)

## Constructor

```jsx
new Disclosure(element: HTMLElement, options: object);
```

**`element`** - _(Required)_ Either the element used to activate the Disclosure target, or the Disclosure target element.

The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element. The component's events will dispatch from this element.

**`options`** - _(Optional)_ Configuration options.

### Available Options

**`modules`** - A single module, or array of modules, to initialize. _Default is `[]`_

## Instance Methods

Global methods and properties documented at [`src/README`](../).

**`open()`** - Shortcut for `disclosure.expanded = true`.

**`close()`** - Shortcut for `disclosure.expanded = false`.

**`toggle()`** - Shortcut for reversing `expanded` state.

**`toString()`** - Returns `'[object Disclosure]'`.

## Properties

**`expanded`** - _(setter)_ Set the component state and update element attributes to show-to or hide-from assistive technology.

**`expanded`** - _(getter)_ Get the component state.

**`controller`** - The Disclosure's activating element.

**`target`** - The Disclosure's target element.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'disclosure.init'`**

Fired after the component is initialized.

`event.detail.instance` -  The class instance from which the event originated.

**`'disclosure.stateChange'`**

Fired after component state is updated.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.expanded` - The current expanded component state.

**`'disclosure.destroy'`**

Fired after the component is destroyed.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.element` - The element passed to the constructor.

## Modules

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Disclosure, { ManageTabIndex } from 'aria-components/disclosure';
```

**`ComponentConnector`**

Forces tab focus between a controller and target pair when they are not adjacent siblings.

**`ManageTabIndex`**

Removes the target element's interactive children from the tab index when the  target is hidden.

**`UseButtonRole`**

Mimics a button for non-button controllers by using `role=button` and mapping the  Space and Enter keys to `click` events

**`UseHiddenAttribute`**

Hides the target element with the `hidden` attribute, removing the need to do it  with CSS. Note that the use of the hidden attribute can hinder animations.

## Additional Information

Previously, there existsed a `loadOpen` option for initializing a Disclosure in the expanded state. To achieve the same result: Add `aria-expanded="true"` to the controling element and `aria-hidden="false"` to the target element.

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
