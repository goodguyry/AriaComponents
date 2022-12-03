# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.4.0

**Changed**

- Changes constructor parameters to accept a component element and an object of options (#51)
- Requires activating elements to have an `aria-current` attribute matching the ID value of the target element (#51, #66)
- MenuButton and ListBox now _extend_ Popup, rather than using it internally (#54)
- Dialog is no longer a Popup (#59)
- Dialog focuses the target element on open (#51)
- Loosens MenuBar and Menu components' markup requirements (#48, 3385f2e)
- Moves docs site packages and scripts to the docs directory (#57)
- Removes Travis, adds GitHub Action (#58)
- Dialog accepts a target element, rather than controller (#65)

**Added**

- Component element fires `init`, `stateChange` and `destroy` events (#55)
- Uses `[Symbol.toStringTag]` for component identification via `instance.toString()` (#52)
- Adds `itemMatches` option for validating Menu & MenuBar menu items (#49, 75bcb56)
- Gets Dialog content element(s) if none provided (#51)
- Throws a configuration error for misconfigured components (#51)
- Exports `isInstanceOf` helper function (#52)
- Allows authors to disable the use of the hidden attribute in Dialog, Disclosure, and Popup state changes via the `useHiddenAttribute` option. (#61)
- `instance.on()` and `instance.off()` methods for subscribing to events (#67)
- Menu, MenuBar, and MenuButton will log a warning if used for website navigation (#68)

**Fixed**

- MenuButton could attempt to focus the first Menu child even when the Popup is closed (14599f0)
- Component callbacks (now, Custom Events) could be run more than once (#54)
- MenuBar wasn't tracking the current Popup (6c2fe90)
- MenuBar keydown could trigger an unexpected Popup `stateChange` event (e86d06e, 8001226)
- Dialog no longer re-queries for interactive child elements on every TAB keydown (a964674)

**Removed**

- Dialog no longer requires a close button, and will not create one (#51)
- Components no longer accept `onInit`, `onStateChange`, nor `onDestroy` callbacks; additionally, MenuBar no longer acepts `onPopupInit` (#54, #55)
- MenuBar no longer tracks Popup `expanded` state separately (e86d06e)

## 0.3.1

**Changed**

- Loosens MenuBar Popups' markup requirements (#45)

**Fixed**

- Updates docs site dependencies (#47)

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
