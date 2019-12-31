# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## Next

**Fixed**

- Updates NPM dependencies (#25)

## 0.2.0

**Changed**

- BREAKING: Moves helper functions to `utils/` (#17)
- BREAKING: Deprecates the Menu and MenuBar `menu` config property in favor of `list` (#20)
- BREAKING: Deprecates the Tablist `tablist` config property in favor of `tabs` (#20)
- BREAKING: Updates the way the `componentName` and self references are managed (#21)
- BREAKING: Deprecates MenuBar `onPopupStateChange` and `onPopupDestroy` callbacks (#22)
- Improves tracking of internal Popup state (#22)

**Added**

- Roving tabIndex helpers accept an HTMLCollection (#18)
- Merge nested component state with the parent component's state (#19)

**Fixed**

- Corrects the Popup's focusable elements' initial tabindex (#15)

## 0.1.2

**Fixed**

- Corrects Menu search scoping (#8)
- Shift-TAB from a Popup's last interactive child no longer closes the Popup (#10)
- Corrects `lib/` exports (#12)
- Corrects MenuBar static method reference (#13)

## 0.1.1

**Fixed**

- Prevents the Popup component from overwriting an existing role attribute (#2)
- Activates MenuBar sublist `menuitem` links with the spacebar or return key (#3)

## 0.1.0

Initial release.
