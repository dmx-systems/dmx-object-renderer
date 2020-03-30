<template>
  <div :class="['dm5-html-field', mode]" v-if="infoMode" v-html="object.value" ref="info"></div>
  <quill :class="['dm5-html-field', mode]" v-else v-model="object.value" :options="quillOptions" ref="quill"
    @quill-imported="registerExtensions" @quill-ready="quillReady">
  </quill>
</template>

<script>
export default {

  created () {
    // console.log('dm5-html-field created()', this.mode)
  },

  mounted () {
    // console.log('dm5-html-field mounted()', this.mode, this.$refs.html)
    // Note: if a topic is edited for the first time the dm5-html-field component is mounted in "form" mode
    this.domReady()
    this.trackImages()
  },

  updated () {
    // console.log('dm5-html-field updated()', this.mode)
    this.domReady()
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  computed: {

    quillOptions () {
      return this.context.quillConfig.options       // TODO: make "quillConfig" optional
    },

    quillExtensions () {
      return this.context.quillConfig.extensions    // TODO: make "quillConfig" optional
    }
  },

  watch: {
    // update Quill instance manually when user changes selection while in form mode
    object () {
      // Note: when switching from info mode to form mode the object watcher fires as "objectToEdit" changes
      // (see dm5-info-tab.vue in dm5-detail-panel module). In this case the quill instance is not yet available,
      // not even at next tick. Anyways no manual update is required in this case.
      if (this.formMode && this.$refs.quill) {
        this.$refs.quill.setHTML(this.object.value)
      }
    }
  },

  methods: {

    registerExtensions (Quill) {
      this.forEachExtension(ext => Quill.register(ext.extension(Quill)))
    },

    quillReady (quill) {
      this.forEachExtension(ext => {
        quill.getModule('toolbar').addHandler(ext.name, ext.toolbarHandler)
        ext.quillReady(quill)
      })
    },

    domReady () {
      if (this.infoMode) {
        this.forEachExtension(ext => ext.infoDOMReady(this.$refs.info))
      }
    },

    forEachExtension (visitor) {
      this.quillExtensions && this.quillExtensions.forEach(ext => visitor(ext))
    },

    /**
     * Emits `updated` event once loading of embedded image completes. Note: image rendering responds to load state,
     * not to data change; so the updated() lifecycle method would not be suitable.
     * Allows e.g. the dm5-detail component to resize in-map details (see dm5-cytoscape-renderer module).
     */
    trackImages () {
      if (this.infoMode) {
        this.$refs.info.querySelectorAll('img').forEach(img => {
          img.addEventListener('load', this.context.updated)
        })
      }
    }
  },

  components: {
    quill: () => ({
      component: import('vue-quill-minimum' /* webpackChunkName: "vue-quill-minimum" */),
      loading: require('./dm5-spinner')
    })
  }
}
</script>

<style>
.dm5-html-field {
  line-height: var(--line-height);
}

.dm5-html-field p {
  margin: 0;
}

.dm5-html-field p + p {
  margin-top: var(--paragraph-spacing);
}

.dm5-html-field img {
  max-width: 100%;
}

.dm5-html-field a {
  color: var(--highlight-color);
  text-decoration: none;
}

.dm5-html-field a:hover {
  color: var(--highlight-color-2);
}

/* Adopt Quill list style in info mode */

.dm5-html-field.info ol > li,
.dm5-html-field.info ul > li {
  list-style-type: none;
}

.dm5-html-field.info ul > li::before {
  content: '\2022';
}

.dm5-html-field.info li::before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
  margin-left: -1.5em;
  margin-right: 0.3em;
  text-align: right;
}

.dm5-html-field.info li.ql-indent-1 { padding-left:  3em; }
.dm5-html-field.info li.ql-indent-2 { padding-left:  6em; }
.dm5-html-field.info li.ql-indent-3 { padding-left:  9em; }
.dm5-html-field.info li.ql-indent-4 { padding-left: 12em; }
.dm5-html-field.info li.ql-indent-5 { padding-left: 15em; }
.dm5-html-field.info li.ql-indent-6 { padding-left: 18em; }

.dm5-html-field.info ol li             { counter-increment: list-0; counter-reset: list-1; }
.dm5-html-field.info ol li.ql-indent-1 { counter-increment: list-1; counter-reset: list-2; }
.dm5-html-field.info ol li.ql-indent-2 { counter-increment: list-2; counter-reset: list-3; }
.dm5-html-field.info ol li.ql-indent-3 { counter-increment: list-3; counter-reset: list-4; }
.dm5-html-field.info ol li.ql-indent-4 { counter-increment: list-4; counter-reset: list-5; }
.dm5-html-field.info ol li.ql-indent-5 { counter-increment: list-5; counter-reset: list-6; }

.dm5-html-field.info ol li:before             { content: counter(list-0, decimal)     '.'; }
.dm5-html-field.info ol li.ql-indent-1:before { content: counter(list-1, lower-alpha) '.'; }
.dm5-html-field.info ol li.ql-indent-2:before { content: counter(list-2, lower-roman) '.'; }
.dm5-html-field.info ol li.ql-indent-3:before { content: counter(list-3, decimal)     '.'; }
.dm5-html-field.info ol li.ql-indent-4:before { content: counter(list-4, lower-alpha) '.'; }
.dm5-html-field.info ol li.ql-indent-5:before { content: counter(list-5, lower-roman) '.'; }

/* Quill Overrides */

.ql-container {
  font-family: var(--main-font-family) !important;    /* Quill default is "Helvetica, Arial, sans-serif" */
  font-size:   var(--main-font-size)   !important;    /* Quill default is 13px */
  border: 1px solid var(--border-color);
}

.ql-container .ql-editor {
  line-height: inherit !important;                    /* Quill default is 1.42; inherit from dm5-html-field */
  padding: 6px 8px !important;                        /* Quill default is 12px 15px */
  background-color: white;
}

.ql-container .ql-editor h1 {
  margin-top: 0.67em;                                 /* Restore user agent style; Quill default is 0 */
  margin-bottom: 0.67em;                              /* Restore user agent style; Quill default is 0 */
}

.ql-container .ql-editor h2 {
  margin-top: 0.83em;                                 /* Restore user agent style; Quill default is 0 */
  margin-bottom: 0.83em;                              /* Restore user agent style; Quill default is 0 */
}

.ql-container .ql-editor h3 {
  margin-top: 1em;                                    /* Restore user agent style; Quill default is 0 */
  margin-bottom: 1em;                                 /* Restore user agent style; Quill default is 0 */
}

.ql-container .ql-editor ol,
.ql-container .ql-editor ul {
  margin-top: 1em;                                    /* Restore user agent style; Quill default is 0 */
  margin-bottom: 1em;                                 /* Restore user agent style; Quill default is 0 */
}

.ql-container .ql-tooltip {
  width: 250px;         /* fixed toolbar width */
  z-index: 2;           /* stack toolbar above adjacent detail panel fields and el-checkboxes (z-index 1) */
}

.ql-container .ql-tooltip .ql-toolbar .ql-formats:nth-child(4) {
  margin-left: 12px;    /* margin for 2nd toolbar row */
}
</style>
