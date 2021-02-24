src/
=============

## AriaComponent.js

Extend the `AriaComponent` class to get access to the methods below.

## Constructor

```javascript
AriaComponent(controller = null, options = {});
```

_**`controller`**_ `HTMLElement`
> The component element.

_**`options`**_ `object`
> Configuration options.

### Available Options

_**`watch`**_`= false`
> When `true`, monitors DOM changes via MutationObserver and updates component
> attributes and properties as-needed.

## API

### Instance Methods

_**`AriaComponent.setState(newState)`**_
> Set component state.
>
> `newState`  
> The new state object to merge with existing state.

_**`AriaComponent.getState()`**_
> Returns an object representing the current component state.

_**`AriaComponent.toString()`**_  
> Returns `'[object AriaComponent]'`.

## lib/ Modules

The `src/lib/` directory contains modules available for use in creating 
additional classes extended from AriaComponent, or for general use outside of 
this package. See the source files for details.
