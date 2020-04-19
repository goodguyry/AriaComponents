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

/**
 * The submenu Disclosures.
 *
 * @type {array}
 */
Menu.disclosures
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
