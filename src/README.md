src/
=============

## AriaComponent.js

Extend the `AriaComponent` class to get access to the methods below.

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

### Events

Events are namespaced by their component to avoid clashes with nested components.

_**`'_namespace_.init'`**_

> Fired after the component is initialized.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |

_**`'_namespace_.stateChange'`**_

> Fired after component state is updated.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.state` | The current component state. | `object` |
> | `event.detail.props` | The state properties that changed. | `array` |

_**`'_namespace_.destroy'`**_

> Fired after the component is destroyed.
> 
> | Detail Property | Description | Type |
> |:--|:--|:--|
> | `event.detail.instance` | The class instance from which the event originated. | Component class |
> | `event.detail.element` | The element passed to the constructor. | `HTMLElement` |

## lib/ Modules

The `src/lib/` directory contains modules available for use in creating 
additional classes extended from AriaComponent, or for general use outside of 
this package. See the source files for details.
