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

```javascript
import { Menu } from 'aria-components';

const menu = document.querySelector('.menu');
const menu = new Menu(menu);
```

## Constructor

```javascript
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

_**`Menu.destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`Menu.toString()`**_  
> Returns `'[object Menu]'`.

_**`Menu.on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`Menu.off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`Menu.element`**_  
> Returns the element passed to the constructor.

_**`Menu.list`**_  
> Returns the list element containing menu items.

_**`Menu.disclosures`**_  
> Returns an array of submenu Disclosures.

### Events

_**`'menu.init'`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Menu` instance from which the event originated.  

_**`'menu.stateChange'`**_  
> Fired after any `Disclosure` state is updated.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Disclosure` instance from which the event originated.  
>
> _**`detail.props`**_  
> Returns an array of state properties that were updated.  
>
> _**`detail.state`**_  
> Returns an object representing the current component state.

_**`'menu.destroy'`**_  
> Fired after the component is destroyed.

> **Event Properties**
> 
> _**`detail.element`**_  
> Returns the element passed to the `Menu` instance.  
> 
> _**`detail.instance`**_  
> Returns the `Menu` instance from which the event originated.  

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#menu
