# DeepaMehta 5 Object Renderer

## Version History

**0.13** -- Jan 29, 2019

* Editor toolbar has fixed layout/size
* Fix: disable inline editing for DMX value types
* Change license to `GPL-3.0-or-later`

**0.12** -- Jan 5, 2019

* Adapt to `dm5` library

**0.11** -- Nov 24, 2018

* Improvements:
    * Composability: new component property `types` (component does not access app state anymore)
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

* Feature: configurable value renderers. The `renderers` component prop contains both, `object` renderers and `value` renderers.
* Layout/CSS fixes:
    * Simple topics are rendered without heading
    * Don't show label if assoc value is empty
    * Revised vertical spacing between data fields

**0.8** -- Oct 6, 2018

* Component `dm5-object` renders object title, omittable by `noHeading` prop
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
    * New `quill-config` property allows parent component to customize the Quill editor in both ways, setting options, and providing extensions (e.g. formats)
    * Emit `child-topic-reveal` to signalize "user clicked 'Reveal' button"
* Code splitting: the Quill editor is loaded on-demand

**0.3** -- Mar 10, 2018

* Improved composability: don't dispatch into host application
* Style fix: white "edit" rect does not obscure blue "reveal" border

**0.2** -- Feb 21, 2018

* Also responsible for rendering *assoc* details
* Improved composability:
    * Component relies on explicit props instead of context injection
    * Props have reasonable defaults
    * Emit `inline` and `updated` events

**0.1** -- Feb 3, 2018

* Factored out as a standalone component from:  
  https://github.com/jri/dm5-detail-panel

------------
Jörg Richter  
Jan 29, 2019
