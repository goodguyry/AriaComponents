Disclosure
==========

Class to set up a controller-target relationship for independently revealing and 
hiding content.

## Config `object`

**config.controller** `HTMLElement`  
The element used to trigger the dialog popup.

**config.target** `HTMLElement`  
The dialog element.

**config.loadOpen** `boolean`  
Load the Disclosure open by default.  
_Default:_ `false`

**config.allowOutsideClick** `boolean`  
Keep the Disclosure open when the user clicks outside of it.  
_Default:_ `true`

### Callbacks

**config.onInit** `Function`  
Callback to run after the component initializes.

**config.onStateChange** `Function`  
Callback to run after component state is updated.

**config.onDestroy** `Function`  
Callback to run after the component is destroyed.

## Methods

**open()**  
Update component state to show the target element.

**close()**  
Update component state to show the target element.

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
