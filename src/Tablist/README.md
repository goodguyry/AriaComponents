Tablist
=======

Class for implimenting a tabs widget for sectioning content and displaying one 
at a time.

## Example

```html
<ul class="tabs">
  <li><a aria-controls="first-panel" href="#first-panel"></a></li>
  <li><a aria-controls="second-panel" href="#second-panel"></a></li>
  <li><a aria-controls="third-panel" href="#third-panel"></a></li>
</ul>
<div id="first-panel" class="panel">
  <h3>The First Panel Title</h3>
  <p>Lorem ipsum dolor sit amet, <a href="example.com/first">consectetur</a>
  adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat.</p>
</div>
<div id="second-panel" class="panel">
  <h3>The Second Panel Title</h3>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
  in culpa qui officia deserunt mollit anim id est laborum, 
  <a href="example.com/second">consectetur</a> adipisicing elit. Sed do eiusmod 
  tempor incididunt ut labore et dolore magna aliqua. </p>
</div>
<div id="third-panel" class="panel">
  <h3>The Third Panel Title</h3>
  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
  officia deserunt mollit anim id est laborum.</p>
</div>
```

```jsx
import { Tablist } from 'aria-components';

const tabs = document.querySelector('.tabs');
const tablist = new Tablist(tabs);
```

## Constructor

```jsx
Tablist(tabsListElement = null);
```

_**`tabsListElement`**_ `HTMLUListElement`  
> The list element containing tab links; each link must contain an \`aria-controls\`  
> attribute referencing the ID of the associated tabPanel.

## API

### Instance Methods

See also [`src/README`](../).

_**`switchTo(index)`**_
> Activate a tab based on its index.
>
> `index`  
> Zero-based integer value representing the index of the tab to activate.

_**`toString()`**_  
> Returns `'[object Tablist]'`.

### Properties

_**`tabs`**_  
> Returns the list element containing tab links (alias of `element`).

_**`panels`**_  
> Returns an array of panel elements.

_**`tabLinks`**_  
> Returns an array of anchors collected from inside of each list items.

### Events

Events are namespaced by their component to avoid clashes with nested components.

#### `'tablist.init'`

Fired after the component is initialized.

> `event.detail.instance` {Tablist}  
> The instance from which the event originated.

#### `'tablist.stateChange'`

Fired after component state is updated.

> `event.detail.instance` {Tablist}  
> The instance from which the event originated.
>
> `event.detail.state` {object}  
> The current component state.
>
> `event.detail.props` {array}  
> The state properties that changed.

#### `'tablist.destroy'`

Fired after the component is destroyed.

> `event.detail.instance` {Tablist}  
> The instance from which the event originated.
>
> `event.detail.element` {HTMLElement}  
> the element passed to the constructor

## References

- https://www.w3.org/TR/wai-aria-1.1/#tablist
- https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
