Dialog
======

Class for setting up an interactive Dialog element.

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

        <button target="dialog">Open dialog</button>
      </article>
    </main>
  </div>

  <div id="dialog" hidden>
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
import { Dialog } from 'aria-components';

const button = document.querySelector('button[target]');
const dialog = new Dialog(button);
```

## Constructor

```javascript
Dialog(activatingElement = null, options = {});
```

_**`activatingElement`**_ `HTMLElement`  
> The element used to activate the Dialog target; required to have a `target`  
attribute with a value matching the `id` attribute value of the target element.

_**`options`**_ `object`  
> Configuration options.

### Available Options

_**`content`**_`= null`  
> The element or NodeList of elements that should be inaccessible when the Dialog element is open.

## API

### Instance Methods

See also [`src/README`](../).

_**`Dialog.show()`**_
> Updates component state to show the target element.

_**`Dialog.hide()`**_
> Updates component state to hide the target element.

_**`Dialog.getState()`**_
> Returns an object representing the current component state.
>
> _`state.expanded`_ `boolean`  
> Whether or not the Dialog target is visible.

_**`Dialog.destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`Dialog.toString()`**_  
> Returns `'[object AriaDialog]'`.

### Properties

_**`Dialog.activatingElement`**_  
> Returns the Dialog's activating element.

_**`Dialog.target`**_  
> Returns the Dialog's target element.

_**`Dialog.content`**_
> An array of elements to be hidden while the Dialog is visible.

### Events

_**`init`**_  
> Fired after the component is initialized.

_**`stateChange`**_  
> Fired after component state is updated.

_**`destroy`**_  
> Fired after the component is destroyed.

#### Event Properties

_**`CustomEvent.detail.instance`**_
> Returns the `Dialog` instance from which the event originated.

## References

- https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
- https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
