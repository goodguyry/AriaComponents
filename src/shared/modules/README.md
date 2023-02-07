Modules
=======

Optional features and functionality available for contexts in which they'll simplify and/or improve UX.

## Using modules

Pass an array of modules, or a single module, in the `options.modules` property.

```jsx
import Disclosure, { UseHiddenAttribute } from 'aria-components/disclosure';

const controller = document.querySelector('.disclosure');
const disclosure = new Disclosure(controller, { modules: [UseHiddenAttribute] });
```

## Shared modules

### ComponentConnector

Forces tab focus between a controller and target pair when they are not adjacent siblings.

**Compatiblility:**

|                      | Dialog | Disclosure | Listbox | Menu | Popup | Tablist |
|:---------------------|:------:|:----------:|:-------:|:----:|:-----:|:-------:|
| `ComponentConnector` |        |      •     |         |      |   •   |         |

### ManageTabIndex

Removes the target element's interactive children from the tab index when the 
target is hidden.

**Compatiblility:**

|                      | Dialog | Disclosure | Listbox | Menu | Popup | Tablist |
|:---------------------|:------:|:----------:|:-------:|:----:|:-----:|:-------:|
| `ManageTabIndex`     |    •   |      •     |         |      |   •   |         |

### UseButtonRole

Mimics a button for non-button controllers by using `role=button` and mapping the 
Space and Enter keys to `click` events

**Compatiblility:**

|                      | Dialog | Disclosure | Listbox | Menu | Popup | Tablist |
|:---------------------|:------:|:----------:|:-------:|:----:|:-----:|:-------:|
| `UseButtonRole`      |    •   |      •     |         |      |   •   |         |

### UseHiddenAttribute

Hides the target element with the `hidden` attribute, removing the need to do it 
with CSS. Note that the use of the hidden attribute can hinder animations.

**Compatiblility:**

|                      | Dialog | Disclosure | Listbox | Menu | Popup | Tablist |
|:---------------------|:------:|:----------:|:-------:|:----:|:-----:|:-------:|
| `UseHiddenAttribute` |    •   |      •     |         |      |   •   |         |

## Writing a module

A module is a function that accepts an object of component properties and returns
a cleanup function.

```jsx
export default function DoSomethingHelpful({ instance }) {
  // Do things with `instance` ...

  return () => {
    // Remove attributes and event listeners.
  }
}
```

The following properties are passed to modules:

| Property    | Type          | Description                           |
|:------------|:-------------:|:--------------------------------------|
| `instance`  | `object`      | The component instance                |
| `namespace` | `string`      | The component's event namespace       |
| `element`   | `HTMLElement` | The component element                 |
| `options`   | `object`      | The options passed into the component |
