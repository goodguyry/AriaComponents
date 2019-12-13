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

  /**
   * Callback to run after Popup state is updated.
   * 
   * @callback popupStateChangeCallback
   */
  onPopupStateChange: () => {},

  /**
   * Callback to run after Popup is destroyed.
   * 
   * @callback popupDestroyCallback
   */
  onPopupDestroy: () => {},
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

<!--
  These elements are required by this component, but must be added manually.
  Feel free to update the text how you see fit, but make sure it's helpful and
  the elements have the correct `id` attribute.
-->
<div class="screen-reader-only">
  <span id="ac-describe-top-level-help">Use left and right arrow keys to navigate between menu items.</span>
  <span id="ac-describe-submenu-help">Use right arrow key to move into submenus.</span>
  <span id="ac-describe-esc-help">Use escape to exit the menu.</span>
</div>
```

```javascript
import { MenuBar } from 'AriaComponents';

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
  onPopupStateChange: () => {
    console.log('MenuBar Popup state was updated.');
  },
  onPopupDestroy: () => {
    console.log('MenuBar Popup destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html
- https://www.w3.org/TR/wai-aria-1.1/#menubar
- https://www.w3.org/TR/wai-aria-practices-1.1/#menu
