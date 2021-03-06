MenuBar
=======

Class for managing a visually persistent (horizontally-oriented) menubar, with 
each submenu item is instantiated as a Popup.

## Config Object

```javascript
const config = {
  /**
   * The menubar menu list element.
   *
   * @type {HTMLUListElement}
   */
  list: null,

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
   * Callback to run after component state is updated.
   * 
   * @callback stateChangeCallback
   */
  onStateChange: () => {},

  /**
   * Callback to run after the component is destroyed.
   * 
   * @callback destroyCallback
   */
  onDestroy: () => {},

  /**
   * Callback to run after Popup initializes.
   * 
   * @callback popupInitCallback
   */
  onPopupInit: () => {},
};
```

## Methods

> See also [`src/README`](../).

```javascript
class MenuBar extends AriaComponent {
  /**
   * Return the current component state.
   *
   * @return {object}
   */
  getState();

  /**
   * Destroy the MenuBar and any submenu Popups.
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
MenuBar.menu
```

```javascript
/**
 * Collected menubar links.
 *
 * @type {array}
 */
MenuBar.menuBarItems
```

## Additional Notes

The first anchor or button element found in each item will be used as the 
`role="menuitem"`.

If a `menuitem` has a `nextElementSibling`, that element will be turned into a 
"submenu popup". If a submenu popup's element is not a UL element, the script 
will search the popup target with `Element.querySelector('ul')` and use that as 
the `list` passed to the `Menu` component.

## Example

```html
<ul class="menu">
  <li>
    <a href="example.com"></a>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </li>
  <li><a href="example.com"></a></li>
  <li>
    <a href="example.com"></a>
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
import { MenuBar } from 'aria-components';

const list = document.querySelector('.menu');

const menuBar = new MenuBar({
  list,
  onInit: () => {
    console.log('MenuBar initialized.');
  },
  onStateChange: () => {
    console.log('MenuBar state was updated.');
  },
  onDestroy: () => {
    console.log('MenuBar destroyed.');
  },
  onPopupInit: () => {
    console.log('MenuBar Popup initialized.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
- https://www.w3.org/TR/wai-aria-1.1/#menubar
- https://www.w3.org/TR/wai-aria-practices-1.1/#menu
