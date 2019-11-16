MenuButton
==========

Class for setting up an interactive popup menu that can be triggered by a 
controlling element.

## Config `object`

**config.controller** `HTMLElement`  
The element used to trigger the MenuButton's target element.

**config.target** `HTMLElement`  
The MenuButton's target element.

**config.list** `HTMLElement`  
The MenuButton's menu element.

### Callbacks

**config.onInit**  
Callback to run after the component initializes.

**config.onStateChange**  
Callback to run after component state is updated.

**config.onDestroy**  
Callback to run after the component is destroyed.

## Methods

> See also [`src/README`](../).

**show()**  
Update component state to show the target element.

**hide()**  
Update component state to hide the target element.

**destroy()**  
Destroy the Popup, removing attributes, event listeners, and element properties.

## Example

```html
<button>Open</button>
<div class="wrapper">
  <ul>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
  </ul>
</div>
```

```javascript
import { MenuButton } from 'AriaComponents';

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');
const list = document.querySelector('.wrapper ul');

const menuButton = new MenuButton({
  controller,
  target,
  list,
  onInit: () => {
    console.log('MenuButton initialized.');
  },
  onStateChange: () => {
    console.log("MenuButton's Popup state was updated.");
  },
  onDestroy: () => {
    console.log('MenuButton destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/menu-button/menu-button-links.html
