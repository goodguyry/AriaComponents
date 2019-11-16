AriaComponents
==============

Quickly create accessible interactive components based on the W3C spec and examples

- https://www.w3.org/TR/wai-aria-1.1/
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/

Component documentation:

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

**Note**:  
<!-- @todo is this still true? -->
This package is provided without processing; you'll likely need to run these 
through [Babel](https://babeljs.io) to use them in your projects.
