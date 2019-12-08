Disclosure
==========

Class to set up a controller-target relationship for independently revealing and 
hiding inline content.

## Config Object

```javascript
const config = {
  /**
   * The element used to trigger the Disclosure Popup.
   *
   * @type {HTMLButtonElement}
   */
  controller: null,
  
  /**
   * The Disclosure element.
   *
   * @type {HTMLElement}
   */
  target: null,
  
  /**
   * Load the Disclosure open by default.
   *
   * @type {boolean}
   */
  loadOpen: false,
  
  /**
   * Keep the Disclosure open when the user clicks outside of it.
   *
   * @type {boolean}
   */
  allowOutsideClick: true,
  
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
class Dialog extends AriaComponent {
  /**
   * Update component state to open the Disclosure.
   */
  open();

  /**
   * Update component state to close the Disclosure.
   */
  close();

  /**
   * Return the current component state.
   *
   * @return {object}
   */
  getState();

  /**
   * Remove all ARIA attributes added by this class.
   */
  destroy();
}
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
import { Disclosure } from 'AriaComponents';

const controller = document.querySelector('button');
const target = document.querySelector('.wrapper');

const disclosure = new Disclosure({ 
  controller, 
  target,
  onInit: () => {
    console.log('Disclosure initialized.');
  },
  onStateChange: () => {
    console.log('Disclosure state was updated.');
  },
  onDestroy: () => {
    console.log('Disclosure destroyed.');
  }, 
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure
