Menu
====

Class to set up an vertically oriented interactive Menu element.

## Config `object`

**config.menu** `HTMLElement`  
The Menu element.

### Callbacks

**config.onInit**  
Callback to run after the component initializes.

**config.onDestroy**  
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

<!--
  These elements are required by this component, but must be added manually.
  Feel free to update the text how you see fit, but make sure it's helpful and
  the elements have the correct `id` attribute.
-->
<div class="screen-reader-only">
  <span id="ac-describe-submenu-help">Use right arrow key to move into submenus.</span>
  <span id="ac-describe-esc-help">Use escape to exit the menu.</span>
  <span id="ac-describe-submenu-explore">Use up and down arrow keys to explore.</span>
  <span id="ac-describe-submenu-back">Use left arrow key to move back to the parent list.</span>
</div>
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
