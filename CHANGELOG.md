# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.3.1

**Changed**

- Loosens MenuBar Popups' markup requirements (#45)

## 0.3.0

**Changed**

- Uses `aria-hidden="false"` rather than removing the attribute (#28)
- Uses documented methods for nested classes (4e58d45)

**Added**

- Menu submenus can be instantiated as Disclosures by passing `collapse: true` (#27)
- Uses the `hidden` attribute where `aria-hidden="true"` (#29)
- Documents additional class properties (#34)
- Adds a helper function for getting the first and last item from an Array or NodeList (#35)

**Removed**

- Menu and MenuBar components no longer require the `aria-describedby` help text (#33)

**Fixed**

- Updates NPM dependencies (#25)
- Corrects issues with the reliability of `destroy` methods (#26 & #31)
- Updates NPM dependencies (...again) (#36)

**BREAKING CHANGES**

- MenuBar no longer tracks internal Popup state (51ab17c)
- Corrects ambiguity with native DOM `firstChild` and `lastChild` properties (4795b2a, 1312a99)

## 0.2.0

**Changed**

- Improves tracking of internal Popup state (#22)

**Added**

- Roving tabIndex helpers accept an HTMLCollection (#18)
- Merge nested component state with the parent component's state (#19)

**Fixed**

- Corrects the Popup's focusable elements' initial tabindex (#15)

**BREAKING CHANGES**

- Moves helper functions to `utils/` (#17)
- Deprecates the Menu and MenuBar `menu` config property in favor of `list` (#20)
- Deprecates the Tablist `tablist` config property in favor of `tabs` (#20)
- Updates the way the `componentName` and self references are managed (#21)
- Deprecates MenuBar `onPopupStateChange` and `onPopupDestroy` callbacks (#22)

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
