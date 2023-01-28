[![npm version][npmjs-img]][npmjs] [![Build Status][ci-img]][ci]

AriaComponents
==============

Quickly create accessible interactive components based on the W3C spec and examples

- https://www.w3.org/WAI/ARIA/apg/patterns/
- https://www.w3.org/WAI/ARIA/apg/example-index/
- https://www.w3.org/TR/wai-aria/

## Installation

```shell
npm i aria-components
```

## Usage

Each component accepts an element and an `options` object.

```jsx
new Disclosure(element, { loadOpen: true })
```

The base class, [AriaComponent](src/), provides properties and methods available 
to all components.

Each component's supplemental documentation can be found in its directory:

- [Dialog](src/Dialog/)
- [Disclosure](src/Disclosure/)
- [Listbox](src/Listbox/)
- [Menu](src/Menu/)
- [Popup](src/Popup/)
- [Tablist](src/Tablist/)

## Modules

Each component exports modules that add optional features and functionality that, 
depending on the context, may simplify and/or improve UX.

General module documentation is at [`src/shared/modules/`](src/shared/modules/). 
Some compoennts have additional documentation within their local modules directory.

## Contributing

`npm run watch`  
Run Jest and watch files for changes.

`npm run dev`  
Run Webpack in `development` mode and Jekyll serve the example page at http://127.0.0.1:8080/AriaComponents/

`npm run build`  
Run Webpack in `production` mode. This is required prior to merging to ensure assets are ready for GitHub Pages.

[npmjs-img]: https://badge.fury.io/js/aria-components.svg
[npmjs]: https://badge.fury.io/js/aria-components
[ci-img]: https://github.com/goodguyry/AriaComponents/actions/workflows/action-test.yml/badge.svg?branch=master
[ci]: https://github.com/goodguyry/AriaComponents/actions/
