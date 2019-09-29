Listbox
=======

Class to set up an interactive Listbox element.

## Config `object`

**config.controller** `HTMLElement`  
The element used to trigger the Listbox.

**config.target** `HTMLElement`  
The Listbox element.

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
import { Listbox } from 'AriaComponents';

const controller = document.querySelector('button');
const target = document.querySelector('ul');

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

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
- https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant
