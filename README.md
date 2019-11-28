[![npm version][npmjs-img]][npmjs]

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
- [MenuBar](src/MenuBar/)
- [MenuButton](src/MenuButton/)
- [Popup](src/Popup/)
- [Tablist](src/Tablist/)

Each of the above extends [AriaComponent](src/), which provides
basic state management and component structure.

## Help text elements

> Elements used for keyboard navigation description and referenced on the 
element via `aria-labelledby` need to exist in the DOM. 

The Menu and MenuBar components reference such elements. As a result, authors 
will need to manually add the elements to their page(s). 

Examples can be found in the docs directory:

- [docs/\_includes/help-text.html](docs/_includes/help-text.html)
- [docs/\_includes/help-text.php](docs/_includes/help-text.php)

See also the [Menu](src/Menu/) and [Menubar](src/MenuBar/) components' README

Aside from the help text examples above, authors are responsible for adding all 
necessary `aria-labelledby`, `aria-label` and `aria-describedby` to the revelant 
elements.

**Note**:  
<!-- @todo is this still true? -->
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
