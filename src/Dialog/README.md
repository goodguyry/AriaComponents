Dialog
======

Class for managing an interactive Dialog element.

## Contents

* [Example](#example)
* [Constructor](#constructor)
  * [Available Options](#available-options)
* [Instance Methods](#instance-methods)
* [Properties](#properties)
* [Events](#events)
* [Modules](#modules)
* [References](#references)
* [Additional Information](#additional-information)

## Example

```html
<body>
  <div class="site-wrapper">
    <header></header>
    <main>
      <article>
        <h1>The Article Title</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.</p>

        <button aria-controls="dialog">Open dialog</button>
      </article>
    </main>
  </div>

  <div id="dialog" hidden>
    <button>Close</button>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </div>
</body>
```

```jsx
import Dialog from 'aria-components/dialog';

const controller = document.querySelector('[aria-controls="dialog"]');
const dialog = new Dialog(controller);
```

## Constructor

```jsx
Dialog(element: HTMLElement, options: object);
```

**`element`** - _(Required)_ Either the element used to activate the Dialog target, or the Dialog target element.

The activating element is required to have an `aria-controls` attribute with a value matching the `id` attribute value of the target element; vice-versa for the target element. The component's events will dispatch from this element.

**`options`** - _(Optional)_ Configuration options.

### Available Options

**`closeButton`** - Designate a button element as the Dialog close button.

**`modules`** - A single module, or array of modules, to initialize. _Default is `[]`_

## Instance Methods

Global methods and properties documented at [`src/README`](../).

**`show()`** - Shortcut for `dialog.expanded = true`.

**`hide()`** - Shortcut for `dialog.expanded = false`.

**`toString()`** - Returns `'[object Dialog]'`.

## Properties

**`expanded`** - _(setter)_ Set the component state and update element attributes to show-to or hide-from assistive technology.

**`expanded`** - _(getter)_ Get the component state.

**`controller`** - The Dialog's activating element.

**`target`** - The Dialog's target element.

**`closeButton`** - _(setter)_ Set a button element as the Dialog close button.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'dialog.init'`** 

Fired after the component is initialized.

`event.detail.instance` - The class instance from which the event originated.

**`'dialog.stateChange'`** 

Fired after component state is updated.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.expanded` - The current expanded component state.

**`'dialog.destroy'`** 

Fired after the component is destroyed.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.element` - The element passed to the constructor.


## Modules

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Dialog, { UseHiddenAttribute } from 'aria-components/dialog';
```

**`ManageTabIndex`**

Removes the target element's interactive children from the tab index when the target is hidden.

**`UseButtonRole`**

Mimics a button for non-button controllers by using `role=button` and mapping the Space and Enter keys to `click` events

**`UseHiddenAttribute`**

Hides the target element with the `hidden` attribute, removing the need to do it with CSS. Note that the use of the hidden attribute can hinder animations.

**`UseLegacyDialog`**

Uses `aria-hidden` to hide outside content rather than using the `aria-model` attribute. See the section titled "Notes on aria-modal and aria-hidden" on [the Modal Dialog Example page](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/).

The `UseLegacyDialog` module adds support for a **`content`** option, which defines the `HTMLElement` or `NodeList` of elements that should be inaccessible when the Dialog element is open. _Default is `[]`_

## Additional Information

Authors are responsible for adding the `aria-labelledby` and `aria-describedby` attributes. See ["WAI-ARIA Roles, States, and Properties"](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#wai-ariaroles,states,andproperties) for more.

Additionally, the close button may not be the most appropriate element to focus when the Dialog opens:

> When a dialog opens, focus moves to an element contained in the dialog. Generally, focus is initially set on the first focusable element. However, the most appropriate focus placement will depend on the nature and size of the content.

If the close button is not the most appropriate element to focus when the Dialog opens, we can omit the `closeButton` option to prevent the Dialog from managing focus. We can then manage focus and the close button ourselves.

```jsx
// Set up the close button.
const cancelButton = dialog.target.querySelector('button.cancel');
cancelButton.addEventListener('click', dialog.hide);

dialog.on('dialog.stateChange', (event) => {
  const { detail } = event;
  if (detail.expanded) {
    // Manage focus.
  }
});
```

**DOM Mutations**

We can use `dialog.setInteractiveChildren()` to refresh the component after markup changes.

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
