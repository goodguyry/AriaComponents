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

_**`menuListElement`**_  
> The list element containing menu items.

_**`options`**_  
> Configuration options.

### Available Options

_**`autoClose`**_`= false`  
> Automatically close the Disclosure when its contents lose focus.

## API

### Instance Methods

Global methods and properties documented at [`src/README`](../).

_**`toString()`**_  
> `'[object Menu]'`

### Properties

_**`disclosures`**_ `array`  
> The submenu Disclosures, if any.

### Events

Events are namespaced by their component to avoid clashes with nested components.

_**`'menu.init'`**_

> Fired after the component is initialized.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |

_**`'menu.destroy'`**_

> Fired after the component is destroyed.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.element` | The element passed to the constructor. | `HTMLElement` |

> **Note** Full event details documented at [`src/README`](../).

## References

- https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
