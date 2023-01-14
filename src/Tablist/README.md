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
Tablist(tabsListElement: HTMLUListElement);
```

_**`tabsListElement`**_  
> The list element containing tab links; each link must contain an \`aria-controls\`  
> attribute referencing the ID of the associated tabPanel.

## API

### Instance Methods

See also [`src/README`](../).

_**`switchTo(index: Number)`**_
> Activate the tab at the given zero-based index.

_**`toString()`**_  
> `'[object Tablist]'`

### Properties

_**`tabs`**_ `HTMLUListElement`  
> The list element containing tab links (alias of `element`).

_**`panels`**_ `array`  
> The tab panel elements.

_**`tabLinks`**_ `array`  
> The anchors collected from inside of each list items.

### Events

| Event | Description |
|:-----|:----|
| `'tablist.init'` | Fired after the component is initialized. |
| `'tablist.stateChange'` | Fired after component state is updated. |
| `'tablist.destroy'` | Fired after the component is destroyed. |

> **Note** Full event details documented at [`src/README`](../).

## References

- https://www.w3.org/TR/wai-aria-1.1/#tablist
- https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
