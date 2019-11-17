MenuBar
=======

Class for managing a visually persistent (horizontally-oriented) menubar, with 
each submenu item is instantiated as a Popup.

## Config `object`

**config.menu** `HTMLElement`  
The menubar element.

### Callbacks

**config.onInit**  
Callback to run after the component initializes.

**config.onStateChange**  
Callback to run after component state is updated.

**config.onDestroy**  
Callback to run after the component is destroyed.

**config.onPopupInit**  
Callback to run after a Popup initializes.

**config.onPopupStateChange**  
Callback to run after a Popup state is updated.

**config.onPopupDestroy**  
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

<!--
  These elements are required by this component, but must be added manually.
  Feel free to update the text how you see fit, but make sure it's helpful and
  the elements have the correct `id` attribute.
-->
<div class="screen-reader-only">
  <span id="ac-describe-top-level-help">Use left and right arrow keys to navigate between menu items.</span>
  <span id="ac-describe-submenu-help">Use right arrow key to move into submenus.</span>
  <span id="ac-describe-esc-help">Use escape to exit the menu.</span>
</div>
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

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
- https://www.w3.org/TR/wai-aria-1.1/#menubar
- https://www.w3.org/TR/wai-aria-practices-1.1/#menu
