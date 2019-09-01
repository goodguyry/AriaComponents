Dialog
======

Class to set up an interactive Popup Dialog element.

## Config `object`

**config.controller** `HTMLElement`  
The element used to trigger the dialog popup.

**config.target** `HTMLElement`  
The dialog element.

**config.content** `HTMLElement`  
The site content wrapper. The element wrapping all site content (including 
header and footer) with the sole exception of the dialog element.

**config.close** `HTMLElement`  
The button used to close the dialog. Required to be the very first element 
inside the dialog. If none is passed, one will be created.  
_Default:_ `<button>Close</button>`

### Callbacks

**config.onInit** `Function`  
Callback to run after the component initializes.

**config.onStateChange** `Function`  
Callback to run after component state is updated.

**config.onDestroy** `Function`  
Callback to run after the component is destroyed.

## Methods

**createCloseButton()**  `static`  
Static method to create a button element with 'Close' as its label.

**destroy()**  
Destroy the Dialog, removing attributes, event listeners, and element properties.

## Example

```html
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

<div id="dialog">
  <button>Close</button>
  <ul>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
    <li><a href="example.com"></a></li>
  </ul>
</div>
```
```javascript
const controller = document.querySelector('.link');
const target = document.getElementById('dialog');
const close = target.querySelector('button');
const content = document.querySelector('main');

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
