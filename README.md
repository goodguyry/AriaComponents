AriaComponents
==============

Quickly create accessible interactive components based on the W3C spec and examples

- https://www.w3.org/TR/wai-aria-1.1/
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/

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
