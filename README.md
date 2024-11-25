# DMX 5 Object Renderer

## Version History

**4.0** -- Nov 20, 2024

* BREAKING CHANGES
    * Make use of `vue-quill-minimum` 2.x which incorporates Quill 2

**3.0.1** -- Jun 21, 2023

* Chore:
    * Use semantic versioning for the 1st-party dependencies, e.g. `dmx-api`

**3.0** -- May 20, 2023

* BREAKING CHANGES
    * Make use of `dmx-api` 3.0
* Feature:
    * User can reorder multi-values by the means of drag handles
* Fixes:
    * Fixed a bug where nested entities loose their child values while update request

**2.2** -- Aug 27, 2021

* Improvements:
    * Add component attribute `no-field-label` (boolean)
    * Custom renderers can provide model customizers

**2.1** -- Jun 14, 2021

* Improvements:
    * Add component attribute `no-heading` (boolean)
    * Bigger Reveal and Edit buttons

**2.0** -- Dec 30, 2020

* BREAKING CHANGES
    * Make use of `dmx-api` 2.0
    * Various `dm5` -> `dmx` renamings
* Improvements:
    * DMX Quill extensions:
        * Make all configs optional (`toolbarHandler`, `quillReady`, `infoDOMReady`)
        * Support overwriting of existing Quill formats
* Chore:
    * Adapt URLs to `github.com/dmx-systems`
    * Code run through `eslint`

**1.0.2** -- Aug 6, 2020

* Fix imports

**1.0.1** -- Aug 5, 2020

* Fix imports

**1.0** -- Aug 4, 2020

* Fixes:
    * An association's retype-into-Membership command is disabled if a) players are not Username/Workspace, or b) the Workspace player is not writable
* Chore:
    * Rename this package `dm5-object-renderer` -> `dmx-object-renderer`

**0.21** -- Mar 30, 2020

* Fixes:
    * HTML fields use same stylesheet for info mode and form mode

**0.20** -- Nov 21, 2019

* Improvements:
    * Enrich field labels by custom assoc type names
    * Auto-focus 1st input field when entering form
* Fixes:
    * Render composite details when topic label is empty

**0.19** -- Aug 26, 2019

* Improvements:
    * Auto-complete fields allow single-letter search
* Fixes:
    * Show proper value for "Select" fields

**0.18** -- Aug 15, 2019

* Improvements:
    * Revised query strategy for auto-complete fields
    * Increase width of input and select fields

**0.17** -- Jul 22, 2019

* Improvements:
    * Replace "Reveal"/"Add"/"Remove" text buttons by icons; place icons outside content field
    * Reposition "Add" button; show only on hover
    * Explicit "Edit" button
    * Adjust Quill link style to Element UI style
* Fixes:
    * Clicking an HTML link does not trigger inline edit
* Chore:
    * Adapt to `dm5` library ("compDef", "player", "children" renamings)
    * Change license to `AGPL-3.0`

**0.16** -- May 27, 2019

* Improvements:
    * Improve assoc detail rendering (topic icons and assoc background color)
    * Pressing Enter in a suggestion menu does not submit form
    * New value entered in a Select is implicitly hovered and can be selected by Enter key
* Fixes:
    * Sorting number/boolean values in Select menus
    * Images embedded in HTML fields have a max-width
    * Update Quill instance on selection change while in form mode
    * The`updated` event is also emitted when image loading completes

**0.15** -- Apr 22, 2019

* Improvement: add tooltips to "Reveal" and "Remove" buttons and to inline edit opportunity
* Fix: serialization of `Number` field values
* Chore: adapt to Element UI 2.7.1 (a cleared `<el-select>` has `null` value, not `''`)

**0.14** -- Mar 2, 2019

* Adjust style when displayed inside `dm5-detail-panel` component (fixed tabs)

**0.13** -- Jan 29, 2019

* Editor toolbar has fixed layout/size
* Fix: disable inline editing for DMX value types
* Change license to `GPL-3.0-or-later`

**0.12** -- Jan 5, 2019

* Adapt to `dm5` library

**0.11** -- Nov 24, 2018

* Improvements:
    * Composability: new component attribute `types` (component does not access app state anymore)
    * Sort custom assoc type menu and role type menu
    * Revised reduced details rendering logic

**0.10** -- Nov 7, 2018

* Feature: auto completion for all single line text fields
* Improvements:
    * Reduced detail rendering for nested identities
    * New event `submit` fired on Enter key
    * Pass `assoc-def` also to *composite* value renderers
* Fix: adapt Cytoscape node size on detail DOM change

**0.9** -- Oct 21, 2018

* Feature: configurable value renderers. The `renderers` component attribute contains both, `object` renderers and `value` renderers.
* Layout/CSS fixes:
    * Simple topics are rendered without heading
    * Don't show label if assoc value is empty
    * Revised vertical spacing between data fields

**0.8** -- Oct 6, 2018

* Component `dm5-object` renders object title, omittable by `no-heading` attribute
* Fixes:
    * Display of multi-valued objects after update
    * Render real value instead of `ref_id:...`

**0.7** -- Aug 18, 2018

* Sort assoc type menu
* Fix width of HTML editor fields
* Fix HTML editor save button layout

**0.6** -- Jul 31, 2018

* CSS fix: margin of Reveal/Remove buttons
* Change type URI prefixes `dm4` -> `dmx`
* Add GitLab CI/CD

**0.5** -- Apr 10, 2018

* Show spinner when quill chunk loads

**0.4** -- Mar 25, 2018

* Fix: clicking a topic-link does not activate inline edit
* Improved composability:
    * New `quill-config` attribute allows parent component to customize the Quill editor in both ways, setting options, and providing extensions (e.g. formats)
    * Emit `child-topic-reveal` to signalize "user clicked 'Reveal' button"
* Code splitting: the Quill editor is loaded on-demand

**0.3** -- Mar 10, 2018

* Improved composability: don't dispatch into host application
* Style fix: white "edit" rect does not obscure blue "reveal" border

**0.2** -- Feb 21, 2018

* Also responsible for rendering *assoc* details
* Improved composability:
    * Component relies on attributes instead of context injection
    * Attributes have reasonable defaults
    * Emit `inline` and `updated` events

**0.1** -- Feb 3, 2018

* Factored out as a standalone component from:  
  https://github.com/jri/dm5-detail-panel
