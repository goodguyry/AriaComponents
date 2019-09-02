MenuBar
=======

MenuBar class for managing a visually persistent (horizontally-oriented) menubar.

Each submenu item is instantiated as a Popup.

## Config `object`

**config.menu** `HTMLElement`  
The menubar element.

### Callbacks

**config.onInit** `Function`  
Callback to run after the component initializes.

**config.onStateChange** `Function`  
Callback to run after component state is updated.

**config.onDestroy** `Function`  
Callback to run after the component is destroyed.

**config.onPopupInit** `Function`  
Callback to run after a Popup initializes.

**config.onPopupStateChange** `Function`  
Callback to run after a Popup state is updated.

**config.onPopupDestroy** `Function`  
Callback to run after a Popup is destroyed.

## Methods

> See also [`src/README`](../).

**getHelpIds()** `static`  
Get HTML IDs for elements containing help text.

**destroy()**  
Destroy the MenuBar, removing attributes, event listeners, and element 
properties. Also destroys submenu Popup instances.

## Example

```html
<ul class="menubar">
  <li>
    <a href="example.com"></a>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </li>
  <li><a href="example.com"></a></li>
  <li>
    <a href="example.com"></a>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </li>
  <li><a href="example.com"></a></li>
  <li><a href="example.com"></a></li>
</ul>
```

```javascript
import { MenuBar } from 'AriaComponents';

const menu = document.querySelector('.menubar');

const menuBar = new MenuBar({
  menu,
  onInit: () => {
    console.log('MenuBar initialized.');
  },
  onStateChange: () => {
    console.log('MenuBar state was updated.');
  },
  onDestroy: () => {
    console.log('MenuBar destroyed.');
  },
  onPopupInit: () => {
    console.log('MenuBar Popup initialized.');
  },
  onPopupStateChange: () => {
    console.log('MenuBar Popup state was updated.');
  },
  onPopupDestroy: () => {
    console.log('MenuBar Popup destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-1.1/#menubar
- https://www.w3.org/TR/wai-aria-practices-1.1/#menu
