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
import { Menu } from 'aria-components';

const menu = document.querySelector('.menu');
const menu = new Menu(menu);
```

## Constructor

```jsx
Menu(menuListElement = null, options = {});
```

_**`menuListElement`**_ `HTMLUListElement`  
> The list element containing menu items.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`autoClose`**_`= false`  
> Automatically close the Disclosure when its contents lose focus.

## API

### Instance Methods

See also [`src/README`](../).

_**`destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`toString()`**_  
> Returns `'[object Menu]'`.

_**`on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`element`**_  
> Returns the list element passed to the constructor.

_**`disclosures`**_  
> Returns an array of submenu Disclosures.

### Events

Events are namespaced by their component to avoid clashes with nested components.

#### `'menu.init'`

Fired after the component is initialized.

> `event.detail.instance` {Menu}  
> The instance from which the event originated.

#### `'menu.stateChange'`

Fired after component state is updated.

> `event.detail.instance` {Menu}  
> The instance from which the event originated.
>
> `event.detail.state` {object}  
> The current component state.
>
> `event.detail.props` {array}  
> The state properties that changed.

#### `'menu.destroy'`

Fired after the component is destroyed.

> `event.detail.instance` {Menu}  
> The instance from which the event originated.
>
> `event.detail.element` {HTMLElement}  
> the element passed to the constructor

## References

- https://www.w3.org/WAI/ARIA/apg/example-index/disclosure/disclosure-navigation.html
