Tablist
=======

Class for implimenting a tabs widget for sectioning content and displaying one 
at a time.

## Config Object

```javascript
const config = {
  /**
   * The UL parent of the Tablist tabs.
   *
   * @type {HTMLUListElement}
   */
  tabs: null,

  /**
   * The Tablist panel elements.
   *
   * @type {NodeList}
   */
  panels: null,

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
class Tablist extends AriaComponent {
  /**
   * Switch directly to a tab.
   *
   * @param {number} index The zero-based tab index to activate.
   */
  switchTo(index);

  /**
   * Return the current component state.
   *
   * @return {object}
   */
  getState();

  /**
   * Destroy the tablist, removing ARIA attributes and event listeners
   */
  destroy();
}
```

## Properties

```javascript
/**
 * The config.tabs property.
 *
 * @type {HTMLUListElement}
 */
Tablist.tabs
```

```javascript
/**
 * The config.panels property.
 *
 * @type {array}
 */
Tablist.panels
```

```javascript
/**
 * Collected anchors from inside of each list items.
 *
 * @type {array}
 */
Tablist.tabLinks
```

## Example

```html
<ul class="tabs">
  <li><a href="#first-panel"></a></li>
  <li><a href="#second-panel"></a></li>
  <li><a href="#third-panel"></a></li>
</ul>
<div id="first-panel" class="panel">
  <h1>The Article Title</h1>
  <p>Lorem ipsum dolor sit amet, <a href="example.com/first">consectetur</a>
  adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
  officia deserunt mollit anim id est laborum.</p>
</div>
<div id="second-panel" class="panel">
  <h1>The Article Title</h1>
  <p>Lorem ipsum dolor sit amet, <a href="example.com/second">consectetur</a>
  adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
  officia deserunt mollit anim id est laborum.</p>
</div>
<div id="third-panel" class="panel">
  <h1>The Article Title</h1>
  <p>Lorem ipsum dolor sit amet, <a href="example.com/third">consectetur</a>
  adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
  officia deserunt mollit anim id est laborum.</p>
</div>
```

```javascript
import { Tablist } from 'AriaComponents';

const tabs = document.querySelector('.tabs');
const panels = document.querySelectorAll('.panel');

const tablist = new Tablist({
  tabs,
  panels,
  onInit: () => {
    console.log('Tablist initialized.');
  },
  onStateChange: () => {
    console.log('Tablist state was updated.');
  },
  onDestroy: () => {
    console.log('Tablist destroyed.');
  },
});
```

## References

- https://www.w3.org/TR/wai-aria-1.1/#tablist
- https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
