Menu
====

Class to set up a Menu with collapsible submenus.

## Contents

* [Example](#example)
* [Constructor](#constructor)
* [Instance Methods](#instance-methods)
* [Properties](#properties)
* [Events](#events)
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
Menu(menuListElement: HTMLUListElement);
```

**`menuListElement`** _(Required)_ The list element containing menu items.

## Instance Methods

Global methods and properties documented at [`src/README`](../).

**`toString()`** Returns `'[object Menu]'`.

## Properties

**`activeDisclosure`** The active submenu Disclosure, if any.

**`activeDisclosureId`** _(setter)_ Set the active submenu Disclosure by ID and update submenu attributes.

**`activeDisclosureId`** _(getter)_ Get the active submenu Disclosure ID.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'menu.init'`**

Fired after the component is initialized.

`event.detail.instance` The class instance from which the event originated.

**`'menu.stateChange'`**

Fired after inner Disclosure state is updated.

`event.detail.instance` The class instance from which the event originated.

`event.detail.activeDisclosure` The current expanded submenu.

**`'menu.destroy'`**

Fired after the component is destroyed.

`event.detail.instance` The class instance from which the event originated.

`event.detail.element` The element passed to the constructor.

## References

- https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
