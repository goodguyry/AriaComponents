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

**`tabsListElement`** - _(Required)_ The list element containing tab links. Each interactive element must contain an `aria-controls` attribute referencing the ID of the associated tabPanel.

**`options`** - _(Optional)_ Configuration options.

### Available Options

**`modules`** - A single module, or array of modules, to initialize. _Default is `[]`_

## Instance Methods

See also [`src/README`](../).

**`switchTo(index: Number)`** - Activate the tab at the given zero-based index.

**`toString()`** - Returns `'[object Tablist]'`.

## Properties

**`activeIndex`** - Set and get the index of the active tab-panel pair.

**`previousIndex`** - Get the index of the previously-active tab-panel pair.

**`tabs`** - The list element containing tab links (alias of `element`).

**`panels`** - The tab panel elements.

**`tabLinks`** - The anchors collected from inside of each list items.

## Events

Events are namespaced by their component to avoid clashes with nested components.

**`'tablist.init'`**

Fired after the component is initialized.

`event.detail.instance` - The class instance from which the event originated.


**`'tablist.stateChange'`**

Fired after component state is updated.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.activeIndex` - The index of the currently active tab/panel.

**`'tablist.destroy'`**

Fired after the component is destroyed.

`event.detail.instance` - The class instance from which the event originated.

`event.detail.element` - The element passed to the constructor.

## Modules

Full modules documentation at [`src/shared/modules/`](..//shared/modules/).

```jsx
import Tablist, { AutomaticActivation } from 'aria-components/tablist';
```

**`AutomaticActivation`**

Automatically activate the associated tabpanel when its tab is selected

**`ManageTabIndex`**

Removes inactive tabpanels' interactive children from the tab index.

**`UseHiddenAttribute`**

Hides inactive tabels with the `hidden` attribute, removing the need to do it with CSS. Note that the use of the hidden attribute can hinder animations.


## References

- https://www.w3.org/TR/wai-aria-1.1/#tablist
- https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
