Dialog
======

Class to set up an interactive Dialog element.

## Config Object

```javascript
const config = {
  /**
   * The button element used to trigger the dialog popup.
   *
   * @type {HTMLButtonElement}
   */
  controller: null,

  /**
   * The element used as the dialog window.
   *
   * @type {HTMLElement}
   */
  target: null,

  /**
   * The site content wrapper. 
   * NOT necessarily <main>, but the element wrapping all site content (including 
   * header and footer) with the sole exception of the dialog element.
   *
   * @type {HTMLElement}
   */
  content: null,

  /**
   * The button used to close the dialog.
   * Required to be the very first element inside the dialog. If none is passed, 
   * one will be created.
   * 
   * @type {HTMLButtonElement}
   * @see createCloseButton
   */
  close: Dialog.createCloseButton(),

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
   * Create the dialog close button.
   *
   * @return {HTMLElement} The HTML button element with 'Close' as its label.
   * @static
   */
  createCloseButton();

  /**
   * Show the Dialog.
   */
  show();

  /**
   * Hide the Dialog.
   */
  hide();

  /**
   * Return the current component state.
   *
   * @return {object}
   */
  getState();

  /**
   * Destroy the Dialog and Popup.
   */
  destroy();
}
```

## Properties

```javascript
/**
 * The config.controller property.
 */
Dialog.controller
```

```javascript
/**
 * The config.target property.
 */
Dialog.target
```

```javascript
/**
 * The config.content property.
 */
Dialog.content
```

```javascript
/**
 * The Popup instance controlling the Dialog.
 * 
 * @type {Popup}
 * {@link https://github.com/goodguyry/AriaComponents/blob/master/src/Popup}
 */
Dialog.popup
```

## Example

```html
<body>
  <div class="site-wrapper">
    <header></header>
    <main>
      <article>
        <h1>The Article Title</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.</p>

        <a class="link" href="#dialog">Open dialog</a>
      </article>
    </main>
  </div>

  <div id="dialog">
    <button>Close</button>
    <ul>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
      <li><a href="example.com"></a></li>
    </ul>
  </div>
</body>
```

```javascript
import { Dialog } from 'AriaComponents';

const controller = document.querySelector('.link');
const target = document.getElementById('dialog');
const close = target.querySelector('button');
const content = document.querySelector('.site-wrapper');

const dialog = new Dialog({
  controller,
  target,
  close,
  content,
  onInit: () => {
    console.log('Dialog initialized.');
  },
  onStateChange: () => {
    console.log('Dialog state was updated.');
  },
  onDestroy: () => {
    console.log('Dialog destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
