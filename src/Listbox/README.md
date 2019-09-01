Listbox
=======

Class to set up an interactive Listbox element.

## Config `object`

**config.controller** `HTMLElement`  
The element used to trigger the Listbox Popup.

**config.target** `HTMLElement`  
The Listbox element.

### Callbacks

**config.onInit** `Function`  
Callback to run after the component initializes.

**config.onStateChange** `Function`  
Callback to run after component state is updated.

**config.onDestroy** `Function`  
Callback to run after the component is destroyed.

## Methods

**destroy()**  
Destroy the Listbox, removing attributes, event listeners, and element properties.

## Example

```html
<button>Choose</button>
<ul>
  <li>Anchorage</li>
  <li>Baltimore</li>
  <li>Chicago</li>
  <li>Dallas</li>
  <li>El Paso</li>
  <li>Fort Lauderdale</li>
  <li>Grand Rapids</li>
  <li>Hartford</li>
  <li>Idaho Falls</li>
</ul>
```

```javascript
const controller = document.querySelector('button');
const target = document.querySelector('ul');
const listItems = Array.from(target.children);

const listbox = new Listbox({
  controller,
  target,
  onInit: () => {
    console.log('Listbox initialized.');
  },
  onStateChange: () => {
    console.log('Listbox state was updated.');
  },
  onDestroy: () => {
    console.log('Listbox destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
- https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant
