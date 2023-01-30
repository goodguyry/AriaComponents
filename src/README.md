AriaComponent
=============

The base class from which all components are extended.

## API

### Instance Methods

_**`toString()`**_  
> `'[object AriaComponent]'`

_**`on(event: string, listener: function, options: object)`**_  
> Registers an event handler for the given event type.  
>
> **Note**: It is not possible to respond to the `init` event using the `on` and `off` methods.

_**`off(event: string, listener: function, options: object)`**_  
> Unregisters an event handler for the given event type.

### Properties

_**`element`**_ `HTMLElement`  
> Returns the element passed to the constructor.
