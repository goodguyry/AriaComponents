Menu
====

Class to set up an vertically oriented interactive Menu element.

## Config Object

```javascript
const config = {
  /**
   * The menu list element.
   *
   * @type {HTMLUListElement}
   */
  list: null,

  /**
   * Instantiate submenus as Disclosures.
   *
   * @type {Boolean}
   */
  collapse: false,

  /**
   * Callback to run after the component initializes.
   * 
   * @callback initCallback
   */
  onInit: () => {},

  /**
   * Callback to run after the component is destroyed.
   * 
   * @callback destroyCallback
   */
  onDestroy: () => {},

  /**
   * Callback to run after each Disclosure initializes.
   * 
   * @callback disclosureInitCallback
   */
  onDisclosureInit: () => {},
};
```

## Methods

> See also [`src/README`](../).

```javascript
class Menu extends AriaComponent {
  /**
   * Destroy the Menu and any submenus.
   */
  destroy();
}
```

## Properties

```javascript
/**
 * The config.menu property.
 *
 * @type {HTMLUListElement}
 */
Menu.menu
```

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

const list = document.querySelector('.menu');

const menu = new Menu({
  list,
  collapse: true,
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
