Tablist
=======

Class for implimenting a tabs widget for sectioning content and displaying one 
at a time.

## Example

```html
<ul class="tabs">
  <li><a href="#first-panel"></a></li>
  <li><a href="#second-panel"></a></li>
  <li><a href="#third-panel"></a></li>
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

```javascript
import { Tablist } from 'aria-components';

const tabs = document.querySelector('.tabs');
const tablist = new Tablist(tabs);
```

## Constructor

```javascript
Tablist(tabsListElement = null);
```

_**`tabsListElement`**_ `HTMLUListElement`  
> The list element containing tab links; each link's `href` is a fragment  
identifier linking to the associated panel.

## API

### Instance Methods

See also [`src/README`](../).

_**`Tablist.switchTo(index)`**_
> Activate a tab based on its index.
>
> `index`  
> Zero-based integer value representing the index of the tab to activate.

_**`Tablist.getState()`**_
> Returns an object representing the current component state.
>
> _`state.activeIndex`_ `number`  
> The active tab's index.

_**`Tablist.destroy()`**_
> Removes all attributes and event listeners added by this class.

_**`Tablist.toString()`**_  
> Returns `'[object Tablist]'`.

### Properties

_**`Tablist.tabs`**_  
> Returns the list element containing tab links.

_**`Tablist.panels`**_  
> Returns an array of panel elements.

_**`Tablist.tabLinks`**_  
> Returns an array of anchors collected from inside of each list items.

### Events

_**`init`**_  
> Fired after the component is initialized.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Tablist` instance from which the event originated.  

_**`stateChange`**_  
> Fired after component state is updated.

> **Event Properties**
> 
> _**`detail.instance`**_  
> Returns the `Tablist` instance from which the event originated.  
>
> _**`detail.props`**_  
> Returns an array of state properties that were updated.  
>
> _**`detail.state`**_  
> Returns an object representing the current component state.

_**`destroy`**_  
> Fired after the component is destroyed.

> **Event Properties**
> 
> _**`detail.element`**_  
> Returns the element passed to the `Tablist` instance.  

## References

- https://www.w3.org/TR/wai-aria-1.1/#tablist
- https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
