Menu
====

Class to set up an vertically oriented interactive Menu element.

## Config `object`

**config.menu** `HTMLElement`  
The Menu element.

### Callbacks

**config.onInit** `Function`  
Callback to run after the component initializes.

**config.onDestroy** `Function`  
Callback to run after the component is destroyed.

## Methods

> See also [`src/README`](../).

**getHelpIds()** `static`  
Get HTML IDs for elements containing help text.

**nextElementIsUl(element)** `static`  
Test for a list as the next sibling element.  

**destroy()**  
Destroy the Menu, removing attributes, event listeners, and element properties.

## Example

```html
<ul class="menu">
  <li><a href="example.com"></a>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </li>
  <li><a href="example.com"></a></li>
  <li><a href="example.com"></a>
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
import { Menu } from 'AriaComponents';

const menu = document.querySelector('.menu');

const menu = new Menu({
  menu,
  onInit: () => {
    console.log('Menu initialized.');
  },
  onDestroy: () => {
    console.log('Menu destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#menu
