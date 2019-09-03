Disclosure
==========

Class to set up a controller-target relationship for independently revealing and 
hiding inline content.

## Config `object`

**config.controller** `HTMLElement`  
The element used to trigger the Disclosure.

**config.target** `HTMLElement`  
The Disclosure element.

**config.loadOpen** `boolean`  
Load the Disclosure open.  
_Default:_ `false`

**config.allowOutsideClick** `boolean`  
Keep the Disclosure open when the user clicks outside of it.  
_Default:_ `true`

### Callbacks

**config.onInit**  
Callback to run after the component initializes.

**config.onStateChange**  
Callback to run after component state is updated.

**config.onDestroy**  
Callback to run after the component is destroyed.

## Methods

> See also [`src/README`](../).

**open()**  
Update component state to show the target element.

**close()**  
Update component state to hide the target element.

**destroy()**  
Destroy the Disclosure, removing attributes, event listeners, and element 
properties.

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
import { Disclosure } from 'AriaComponents';

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

const disclosure = new Disclosure({ 
  controller, 
  target,
  onInit: () => {
    console.log('Disclosure initialized.');
  },
  onStateChange: () => {
    console.log('Disclosure state was updated.');
  },
  onDestroy: () => {
    console.log('Disclosure destroyed.');
  }, 
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
