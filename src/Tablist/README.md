Tablist
=======

Class for implimenting a tabs widget for sectioning content and displaying one 
at a time.

## Config `object`

**config.tablist** `HTMLElement`  
The UL parent of the Tablist tabs.

**config.panels** `NodeList`  
The Tablist panel elements.

### Callbacks

**config.onInit** `Function`  
Callback to run after the component initializes.

**config.onStateChange** `Function`  
Callback to run after component state is updated.

**config.onDestroy** `Function`  
Callback to run after the component is destroyed.

## Methods

**switchTo(index)**  
Switch directly to a given tab.

**destroy()**  
Destroy the Tablist, removing attributes, event listeners, and element properties.

## Example

```html
<ul class="tablist">
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
const tabs = document.querySelector('.tablist');
const panels = document.querySelectorAll('.panel');

const tablist = new Tablist({
  tablist: tabs,
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
