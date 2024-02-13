Menu
====

Class to set up a Menu with collapsible submenus.

## Contents

* [Example](#example)
* [Constructor](#constructor)
* [Instance Methods](#instance-methods)
* [Properties](#properties)
* [Events](#events)
* [Modules](#modules)
* [References](#references)

## Example

```html
<ul class="menu">
  <li><a href="example.com"></a>
    <ul>
      <li><a href="example.com">Menu Item</a></li>
      <li><a href="example.com">Menu Item</a></li>
      <li><a href="example.com">Menu Item</a></li>
    </ul>
  </li>
  <li><a href="example.com">Menu Item</a></li>
  <li><a href="example.com">Menu Item</a>
    <ul>
      <li><a href="example.com">Menu Item</a></li>
      <li><a href="example.com">Menu Item</a></li>
      <li><a href="example.com">Menu Item</a></li>
      <li><a href="example.com">Menu Item</a></li>
    </ul>
  </li>
  <li><a href="example.com">Menu Item</a></li>
  <li><a href="example.com">Menu Item</a></li>
</ul>
```

```jsx
import Menu from 'aria-components/menu';

const menu = document.querySelector('.menu');
const menu = new Menu(menu);
```

## Constructor

```jsx
Menu(menuListElement: HTMLUListElement, options: object);
```

**`menuListElement`** _(Required)_ The list element containing menu items.

**`options`** _(Optional)_ Configuration options.

### Available Options

**`itemsMatch`** A CSS selector used to validate interactive menu items. When this option is not specified, the first matching interactive element in each list item will be used as the menu item. This option can also be used to exclude items that would otherwise be interpreted as an interactive menu item (e.g., `:not(.hidden)`). _Default is `undefined`_

## Instance Methods

Global methods and properties documented at [`src/README`](../).

**`toString()`** Returns `'[object Menu]'`.

## Properties

**`activeDisclosure`** The active submenu Disclosure, if any.

**`activeDisclosureId`** _(setter)_ Set the active submenu Disclosure by ID and update submenu attributes.

**`activeDisclosureId`** _(getter)_ Get the active submenu Disclosure ID.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'menu.init'`** Fired after the component is initialized.

**`'menu.stateChange'`** Fired after inner Disclosure state is updated.

**`'menu.destroy'`** Fired after the component is destroyed.

### Properties of `event.detail`

| Property           | Description                                        | init | stateChange | destroy |
|:-------------------|:---------------------------------------------------|:----:|:-----------:|:-------:|
| `instance`         | The class instance from which the event originated | •    | •           | •       |
| `element`          | The element passed to the constructor              |      |             | •       |
| `activeDisclosure` | The current expanded submenu                       |      | •           |         |

## Modules

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Menu, { WithKeyboardSupport } from 'aria-components/menu';
```

**`WithKeyboardSupport`**

Adds optional support for arrow, Home, and End keys as outlined in the [Keyboard Support](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/#kbd_label) section of the Disclosure Navigation example.

**`UseMenubarRole`**

Adds the `menubar`, `menu`, and `menuitem` roles as outlined in the [Navigation Menubar Example](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/), along with the [Keyboard Support](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/#kbd_label) these roles require.

**`UseMenuRole`**

Adds the `menu` and `menuitem` roles as outlined in the [MenuButton Example](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-links/), along with the [Keyboard Support](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-links/#kbd_label) these roles require.

## References

- https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
