[![npm version][npmjs-img]][npmjs] [![Build Status][ci-img]][ci]

AriaComponents
==============

Quickly create accessible interactive components based on the W3C spec and examples

- https://www.w3.org/TR/wai-aria-1.1/
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/

## Installation

```shell
npm i aria-components
```

## Component documentation:

- [Dialog](src/Dialog/)
- [Disclosure](src/Disclosure/)
- [Listbox](src/Listbox/)
- [Menu](src/Menu/)
- [Popup](src/Popup/)
- [Tablist](src/Tablist/)

Each of the above extends [AriaComponent](src/), which provides
basic state management and component structure.

**Note**:  
This package is provided without processing; you'll likely need to run these 
through [Babel](https://babeljs.io) to use them in your projects.

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
