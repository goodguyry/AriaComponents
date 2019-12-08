MenuButton
==========

Class for setting up an interactive popup menu that can be triggered by a 
controlling element.

## Config Object

```javascript
const config = {
  /**
   * The element used to trigger the Menu Popup.
   *
   * @type {HTMLButtonElement}
   */
  controller: null,

  /**
   * The Menu wrapper element.
   *
   * @type {HTMLElement}
   */
  target: null,

  /**
   * The Menu element.
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
};
```

## Methods

> See also [`src/README`](../).

```javascript
class MenuButtton extends AriaComponent {
  /**
   * Show the menu Popup.
   */
  show();

  /**
   * Hide the menu Popup.
   */
  hide();

  /**
   * Destroy the Popup and Menu.
   */
  destroy();
}
```

## Properties

```javascript
/**
 * The Popup instance controlling the MenuButton.
 * 
 * @type {Popup}
 * {@link https://github.com/goodguyry/AriaComponents/blob/master/src/Popup}
 */
MenuButton.popup
```

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
import { MenuButton } from 'AriaComponents';

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');
const list = document.querySelector('.wrapper ul');

const menuButton = new MenuButton({
  controller,
  target,
  list,
  onInit: () => {
    console.log('MenuButton initialized.');
  },
  onStateChange: () => {
    console.log("MenuButton's Popup state was updated.");
  },
  onDestroy: () => {
    console.log('MenuButton destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/menu-button/menu-button-links.html
