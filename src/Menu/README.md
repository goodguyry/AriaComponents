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
   * Selector used to validate menu items.
   * 
   * This can also be used to exclude items that would otherwise be given a
   * "menuitem" role; e.g., `:not(.hidden)`.
   *
   * @type {string}
   */
  itemMatches: '*',

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
/**
 * Set menu items.
 *
 * Use this if your menu is dynamically updated.
 */
setMenuItems();
```

```javascript
/**
 * Destroy the Menu and any submenus.
 */
destroy();
```

## Instance Properties

```javascript
/**
 * The config.menu property.
 *
 * @type {HTMLUListElement}
 */
menu
```

```javascript
/**
 * The submenu Disclosures.
 *
 * @type {array}
 */
disclosures
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
import { Menu } from 'aria-components';

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
