Popup
=====

Class for setting up an interactive popup element that can be triggered by a 
controlling element.

## Config `object`

**config.controller** `HTMLElement`  
The element used to trigger the Popup element.

**config.target** `HTMLElement`  
The Popup's target element.

**config.type** `string`  
The value of `aria-haspopup` must match the role of the Popup container.  
_Default:_ `'true'`  
_Options:_ `'menu'`, `'listbox'`, `'tree'`, `'grid'`, `'dialog'`

### Callbacks

**config.onInit** `Function`  
Callback to run after the component initializes.

**config.onStateChange** `Function`  
Callback to run after component state is updated.

**config.onDestroy** `Function`  
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
import { Popup } from 'AriaComponents';

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

const popup = new Popup({
  controller,
  target,
  onInit: () => {
    console.log('Popup initialized.');
  },
  onStateChange: () => {
    console.log('Popup state was updated.');
  },
  onDestroy: () => {
    console.log('Popup destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
