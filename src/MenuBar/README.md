MenuBar
=======

Class for managing a visually persistent (horizontally-oriented) menubar, with 
each submenu instantiated as a Disclosure.

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
import { MenuBar } from 'aria-components';

const menu = document.querySelector('.menu');
const menuBar = new MenuBar(menu);
```

## Constructor

```javascript
MenuBar(menuListElement = null, options = {});
```

_**`menuBarListElement`**_ `HTMLUListElement`  
> The list element containing menu items.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`itemMatches`**_`= 'a,button'`  
> A selector string used to validate menu items.
> 
> This can also be used to exclude items that would otherwise be given a  
> "menuitem" role; e.g., `':not(.hidden)'`.

## API

### Instance Methods

See also [`src/README`](../).

_**`MenuBar.getState()`**_
> Returns an object representing the current component state.
> 
> _`state.menubarItem`_ `HTMLElement`  
> The active menu bar item.
>
> _`state.disclosure`_ `Disclosure`  
> The currently active Disclosure, if any; `false` if none.
> 
> _`state.expanded`_ `boolean`  
> Whether or not the Disclosure target is visible.

_**`MenuBar.destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`MenuBar.toString()`**_  
> Returns `'[object MenuBar]'`.

_**`MenuBar.on(event, listener, options)`**_  
> Registers an event handler for the given event type.

_**`MenuBar.off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`MenuBar.menu`**_  
> Returns the list element containing menu items.

_**`MenuBar.menuBarItems`**_  
> Returns an array of top-level MenuBar links.

### Events

_**`init`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `MenuBar` instance from which the event originated.  

_**`stateChange`**_  
> Fired after component state is updated.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `MenuBar` or `Popup` instance from which the event originated.  
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
> Returns the element passed to the `MenuBar` instance.  
> 
> _**`detail.instance`**_  
> Returns the `MenuBar` instance from which the event originated.  

## Additional Notes

The first anchor or button element found in each item will be used as the 
`role="menuitem"`.

If a `menuitem` has a `nextElementSibling`, that element will be turned into a 
"submenu popup". If a submenu popup's element is not a UL element, the script 
will search the popup target with `Element.querySelector('ul')` and use that as 
the `list` passed to the `Menu` component.

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
- https://www.w3.org/TR/wai-aria-1.1/#menubar
- https://www.w3.org/TR/wai-aria-practices-1.1/#menu
