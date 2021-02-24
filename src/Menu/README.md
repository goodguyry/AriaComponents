Menu
====

Class to set up an vertically oriented interactive Menu element.

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
const menu = new Menu(menu, { collapse: true });
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

_**`collapse`**_`= false`  
> Whether to instantiate submenus as Disclosures.

_**`itemMatches`**_`= '*'`  
> A selector string used to validate menu items.
> 
> This can also be used to exclude items that would otherwise be given a  
> "menuitem" role; e.g., `':not(.hidden)'`.

## API

### Instance Methods

See also [`src/README`](../).

_**`Menu.destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`Menu.toString()`**_  
> Returns `'[object Menu]'`.

### Properties

_**`Menu.menu`**_  
> Returns the list element containing menu items.

_**`Menu.disclosures`**_  
> Returns an array of submenu Disclosures.

### Events

_**`init`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Menu` instance from which the event originated.  

_**`stateChange`**_  
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

_**`destroy`**_  
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
