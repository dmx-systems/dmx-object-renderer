<template>
  <div :class="['dmx-html-field', mode]" v-if="infoMode" v-html="object.value" ref="info"></div>
  <quill :class="['dmx-html-field', mode]" v-else v-model="object.value" :options="quillOptions" ref="quill"
    @quill-imported="registerExtensions" @quill-ready="quillReady">
  </quill>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {

  created () {
    // console.log('dmx-html-field created()', this.mode)
  },

  mounted () {
    // console.log('dmx-html-field mounted()', this.mode, this.$refs.html)
    // Note: if a topic is edited for the first time the dmx-html-field component is mounted in "form" mode
    this.domReady()
    this.trackImages()
  },

  updated () {
    // console.log('dmx-html-field updated()', this.mode)
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
      // (see dmx-info-tab.vue in dmx-detail-panel module). In this case the quill instance is not yet available,
      // not even at next tick. Anyways no manual update is required in this case.
      if (this.formMode && this.$refs.quill) {
        this.$refs.quill.setHTML(this.object.value)
      }
    }
  },

  methods: {

    registerExtensions (Quill) {
      this.forEachExtension(ext => Quill.register(ext.extension(Quill), ext.overwrite))
    },

    quillReady (quill) {
      this.forEachExtension(ext => {
        if (ext.name && ext.toolbarHandler) {
          quill.getModule('toolbar').addHandler(ext.name, ext.toolbarHandler)
        }
        if (ext.quillReady) {
          ext.quillReady(quill)
        }
      })
    },

    domReady () {
      if (this.infoMode) {
        this.forEachExtension(ext => {
          if (ext.infoDOMReady) {
            ext.infoDOMReady(this.$refs.info)
          }
        })
      }
    },

    forEachExtension (visitor) {
      this.quillExtensions && this.quillExtensions.forEach(ext => visitor(ext))
    },

    /**
     * Emits `updated` event once loading of embedded image completes. Note: image rendering responds to load state,
     * not to data change; so the updated() lifecycle method would not be suitable.
     * Allows e.g. the dmx-detail component to resize in-map details (see dmx-cytoscape-renderer module).
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
    quill: defineAsyncComponent({
      loader: () => import('vue-quill-minimum'),
      loadingComponent: require('./dmx-spinner')
    })
  }
}
</script>

<style>
.dmx-html-field {
  line-height: var(--line-height);
}

.dmx-html-field p {
  margin: 0;
}

.dmx-html-field p + p {
  margin-top: var(--paragraph-spacing);
}

.dmx-html-field img {
  max-width: 100%;
}

.dmx-html-field a {
  color: var(--highlight-color);
  text-decoration: none;
}

.dmx-html-field a:hover {
  color: var(--highlight-color-2);
}

/* Adopt Quill list style in info mode */

.dmx-html-field.info ol > li,
.dmx-html-field.info ul > li {
  list-style-type: none;
}

.dmx-html-field.info ul > li::before {
  content: '\2022';
}

.dmx-html-field.info li::before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
  margin-left: -1.5em;
  margin-right: 0.3em;
  text-align: right;
}

.dmx-html-field.info li.ql-indent-1 { padding-left:  3em; }
.dmx-html-field.info li.ql-indent-2 { padding-left:  6em; }
.dmx-html-field.info li.ql-indent-3 { padding-left:  9em; }
.dmx-html-field.info li.ql-indent-4 { padding-left: 12em; }
.dmx-html-field.info li.ql-indent-5 { padding-left: 15em; }
.dmx-html-field.info li.ql-indent-6 { padding-left: 18em; }

.dmx-html-field.info ol li             { counter-increment: list-0; counter-reset: list-1; }
.dmx-html-field.info ol li.ql-indent-1 { counter-increment: list-1; counter-reset: list-2; }
.dmx-html-field.info ol li.ql-indent-2 { counter-increment: list-2; counter-reset: list-3; }
.dmx-html-field.info ol li.ql-indent-3 { counter-increment: list-3; counter-reset: list-4; }
.dmx-html-field.info ol li.ql-indent-4 { counter-increment: list-4; counter-reset: list-5; }
.dmx-html-field.info ol li.ql-indent-5 { counter-increment: list-5; counter-reset: list-6; }

.dmx-html-field.info ol li:before             { content: counter(list-0, decimal)     '.'; }
.dmx-html-field.info ol li.ql-indent-1:before { content: counter(list-1, lower-alpha) '.'; }
.dmx-html-field.info ol li.ql-indent-2:before { content: counter(list-2, lower-roman) '.'; }
.dmx-html-field.info ol li.ql-indent-3:before { content: counter(list-3, decimal)     '.'; }
.dmx-html-field.info ol li.ql-indent-4:before { content: counter(list-4, lower-alpha) '.'; }
.dmx-html-field.info ol li.ql-indent-5:before { content: counter(list-5, lower-roman) '.'; }

/* Quill Overrides */

.ql-container {
  font-family: var(--main-font-family) !important;    /* Quill default is "Helvetica, Arial, sans-serif" */
  font-size:   var(--main-font-size)   !important;    /* Quill default is 13px */
  border: 1px solid var(--border-color);
}

.ql-container .ql-editor {
  line-height: inherit !important;                    /* Quill default is 1.42; inherit from dmx-html-field */
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
