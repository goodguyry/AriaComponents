# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 0.4.0

A complete rewrite.

### Highlights

* **Simplified component parameters**: For components with a controller-target pair, pass in either the controller or target. Just be sure to add the `aria-controls` attribute to the controlling element with a matching `id` attribute on the target element. (#51, #66, #65, #70)
* **Extend core functionality with Modules**: Modules contain optional features and functionality available for contexts in which they'll simplify and/or improve UX (#84, #86, #95)
* **Custom events**: Components dispatch custom `init`, `stateChange` and `destroy` events, rather than accepting callbacks (#55, #77)

... and more:

- Some options can be set on-the-fly via setters (#82)
- `instance.on()` and `instance.off()` methods for subscribing to events (#67)
- Components track attributes they add and will only overwrite existing attribute values where required (#73)
- Components are now exported from their own endpoint (#84)
- MenuBar and MenuButton components are now deprecated (#75)
- Component state now uses setter/getter pattern (#83)

**Changed**

- Loosens the Menu component's markup requirements (#48, 3385f2e)
- Dialog and Listbox no longer extend Popup (#59, #85)
- Use the `Dialog.closeButton` setter to configure the Dialog close button (#86)
- Removes scarcely-used utilities and incorporates widely-used utilities into the component that uses them (#80, #81)

**Added**

- Uses `[Symbol.toStringTag]` for component identification via `instance.toString()` (#52)
- Logs a configuration error for misconfigured components (#51)
- Adds an `autoClose` option to Disclosure and Menu (#75, #76)

**Fixed**

- MenuButton could attempt to focus the first Menu child even when the Popup is closed (14599f0)
- Component callbacks (now, Custom Events) could be run more than once (#54)
- Dialog no longer re-queries for interactive child elements on every TAB keydown (a964674)
- Corrects an issue where shift-tab from the Popup controller would focus the target's first child (#76)

**Removed**

- Components no longer set a reference to their instance on the component's HTML elements (#78)
- Dialog no longer requires a close button, and will not create one (#51)
- Components no longer manage the `hidden` attribute (#74)
- Components no longer set a reference to their instance on the component's HTML elements (#78)
- Utility functions are no longer exported (#80, #81)
- Components no longer accept `onInit`, `onStateChange`, nor `onDestroy` callbacks (#55)
- Removes the docs directory; example page now at [aria-components-examples](https://github.com/goodguyry/aria-components-examples/)

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
