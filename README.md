# DeepaMehta 5 Object Renderer

## Version History

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
Mar 25, 2018
