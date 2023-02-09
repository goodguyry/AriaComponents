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
import Tablist from 'aria-components/tablist';

const tabs = document.querySelector('.tabs');
const tablist = new Tablist(tabs, options);
```

## Constructor

```jsx
Tablist(tabsListElement: HTMLUListElement);
```

_**`tabsListElement`**_  
> The list element containing tab links; each link must contain an \`aria-controls\`  
> attribute referencing the ID of the associated tabPanel.

_**`options`**_  
> Configuration options.

### Available Options

_**`modules`**_`= []`  
> A single module, or array of modules, to initialize.

## API

### Instance Methods

See also [`src/README`](../).

_**`switchTo(index: Number)`**_
> Activate the tab at the given zero-based index.

_**`toString()`**_  
> `'[object Tablist]'`

### Properties

_**`activeIndex`**_ `Number`  
> Set and get the index of the active tab-panel pair.

_**`previousIndex`**_ `Number`  
> Get the index of the previously-active tab-panel pair.

_**`tabs`**_ `HTMLUListElement`  
> The list element containing tab links (alias of `element`).

_**`panels`**_ `array`  
> The tab panel elements.

_**`tabLinks`**_ `array`  
> The anchors collected from inside of each list items.

### Events

Events are namespaced by their component to avoid clashes with nested components.

_**`'tablist.init'`**_

> Fired after the component is initialized.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |

_**`'tablist.stateChange'`**_

> Fired after component state is updated.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.activeIndex` | The index of the currently active tab/panel. | `boolean` |

_**`'tablist.destroy'`**_

> Fired after the component is destroyed.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.element` | The element passed to the constructor. | `HTMLElement` |

> **Note** Full event details documented at [`src/README`](../).

## Modules

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Tablist, { AutomaticActivation } from 'aria-components/tablist';
```

### AutomaticActivation

Automatically activate the associated tabpanel when its tab is selected

### ManageTabIndex

Removes inactive tabpanels' interactive children from the tab index.

### UseHiddenAttribute

Hides inactive tabels with the `hidden` attribute, removing the need to do it 
with CSS. Note that the use of the hidden attribute can hinder animations.


## References

- https://www.w3.org/TR/wai-aria-1.1/#tablist
- https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
