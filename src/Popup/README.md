Popup
=====

Class for setting up an interactive popup element that can be triggered by a 
controlling element.

## Config Object

```javascript
const config = {
  /**
   * The element used to trigger the Popup element.
   *
   * @type {HTMLButtonElement}
   */
  controller: null,

  /**
   * The Popup's target element.
   *
   * @type {HTMLElement}
   */
  target: null,

  /**
   * The value of `aria-haspopup` must match the role of the Popup container.
   * Options: menu, listbox, tree, grid, or dialog,
   *
   * @type {string}
   */
  type: 'true', // 'true' === 'menu' in UAs that don't support WAI-ARIA 1.1

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
class Popup extends AriaComonents {
  /**
   * Update component state to show the target element.
   */
  show();

  /**
   * Update component state to hide the target element.
   */
  hide();

  /**
   * Return the current component state.
   *
   * @return {object}
   */
  getState();

  /**
   * Collect and prepare the target element's interactive child elements.
   */
  setInteractiveChildren();

  /**
   * Remove all attributes and event listeners added by this class.
   */
  destroy();
}
```

## Properties

```javascript
/**
 * The config.controller property.
 *
 * @type {HTMLButtonElement}
 */
Popup.controller
```

```javascript
/**
 * The config.target property.
 *
 * @type {HTMLElement}
 */
Popup.target

/**
 * The target's first interactive child element.
 *
 * @type {HTMLElement}
 */
Popup.firstInteractiveChild

/**
 * The target's last interactive child element.
 *
 * @type {HTMLElement}
 */
Popup.lastInteractiveChild
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
import { Popup } from 'aria-components';

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

const popup = new Popup({
  controller,
  target,
  onInit: () => {
    console.log('Popup initialized.');
  },
  onStateChange: () => {
    console.log('Popup state was updated.');
  },
  onDestroy: () => {
    console.log('Popup destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
