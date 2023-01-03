src/
=============

## AriaComponent.js

Extend the `AriaComponent` class to get access to the methods below.

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

_**`AriaComponent.getTrackedAttributesFor(element)`**_  
> Returns tracked attributes for the given element after ensuring it  
> has the required ID attribute.
>
> `element`  
> The element for which attributes are being retrieved.

_**`AriaComponent.addAttribute(element, attribute, value)`**_  
> Adds an attribute for the given element and tracks it for later removal.
>
> `element`  
> The element to which attributes should be added.
>
> `attribute`  
> The attribute name.
>
> `value`  
> The attribute value.

_**`AriaComponent.updateAttribute(element, attribute, value)`**_  
> Updates an attribute for the given element and tracks it for later removal.
>
> `element`  
> The element to which attributes should be updated.
>
> `attribute`  
> The attribute name.
>
> `value`  
> The attribute value. A `null` value will result in the attribute being removed.

_**`AriaComponent.removeAttributes(element)`**_  
> Removes tracked attributes added to the given element.
>
> `element`  
> The elemen on which attributes were added.

_**`AriaComponent.on(event, listener, options)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the  
> `on` and `off` methods.

_**`AriaComponent.off(event, listener, options)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`AriaComponent.element`**_  
> Returns the element passed to the constructor.

## lib/ Modules

The `src/lib/` directory contains modules available for use in creating 
additional classes extended from AriaComponent, or for general use outside of 
this package. See the source files for details.
