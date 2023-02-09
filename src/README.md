AriaComponent
=============

The base class from which all components are extended.

## API

### Instance Methods

**`toString()`** - Returns `'[object AriaComponent]'`

**`on(event: string, listener: function, options: object)`** - Registers an event handler for the given event type. Parameters match those of [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). It is not possible to respond to the `init` event using the `on` and `off` methods.

**`off(event: string, listener: function, options: object)`** - Unregisters an event handler for the given event type. Parameters match those of [`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

### Properties

**`element`** - Returns the element passed to the constructor.

**`id`** - The component ID; matches `element.id`
