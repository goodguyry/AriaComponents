Menu
====

Class to set up a Menu with collapsible submenus.

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

**`autoClose`** Automatically close the Disclosure when its contents lose focus. _Default is `false`_

## Instance Methods

Global methods and properties documented at [`src/README`](../).

**`toString()`** Returns `'[object Menu]'`.

## Properties

**`disclosures`** The array of submenu Disclosures, if any.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'menu.init'`**

> Fired after the component is initialized.

`event.detail.instance` The class instance from which the event originated.

**`'menu.destroy'`**

> Fired after the component is destroyed.

`event.detail.instance` The class instance from which the event originated.

`event.detail.element` The element passed to the constructor.

## References

- https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
