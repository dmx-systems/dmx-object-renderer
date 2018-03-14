<template>
  <div class="dm5-html-field" v-if="infoMode" v-html="object.value" ref="html"></div>
  <div v-else>
    <!-- Without this wrapper <div> the Quill toolbar remains visible when switching to info mode.   -->
    <!-- This is because the Quill toolbar becomes a *sibling* (not a child) of the <quill> element. -->
    <quill v-model="object.value" :options="quillOptions" @quill-imported="registerExtensions"
      @quill-ready="quillReady">
    </quill>
  </div>
</template>

<script>
export default {

  created () {
    // console.log('dm5-html-field created()', this.mode)
  },

  mounted () {
    // console.log('dm5-html-field mounted()', this.mode, this.$refs.html)
    // Note: if a topic is edited for the first time the dm5-html-field component is mounted in "form" mode
    this.infoDOMReady()
  },

  updated () {
    // console.log('dm5-html-field updated()', this.mode)
    this.infoDOMReady()
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  computed: {

    quillOptions () {
      return this.context.quillConfig.options
    },

    quillExtensions () {
      return this.context.quillConfig.extensions
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

    infoDOMReady () {
      if (this.infoMode) {
        this.forEachExtension(ext => ext.infoDOMReady(this.$refs.html))
      }
    },

    forEachExtension (visitor) {
      this.quillExtensions && this.quillExtensions.forEach(ext => visitor(ext))
    }
  },

  components: {
    quill: () => import(/* webpackChunkName: "quill" */ 'vue-quill-minimum')
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

.ql-container {
  font-family: var(--main-font-family) !important;    /* Quill default is "Helvetica, Arial, sans-serif" */
  font-size:   var(--main-font-size) !important;      /* Quill default is 13px */
}

.ql-editor {
  line-height: var(--line-height) !important;         /* Quill default is 1.42 */
  padding-left: 8px !important;                       /* Quill default is 15px */
  padding-right: 8px !important;                      /* Quill default is 15px */
  background-color: white;
}

.ql-editor p + p {
  margin-top: var(--paragraph-spacing);
}

.ql-toolbar.ql-snow {
  padding: 4px 0 !important;                          /* Quill default is 8px */
}

.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:hover,
.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow.ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item:hover,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected {
  color: var(--highlight-color) !important;           /* Quill default is #06c */
}

.ql-snow.ql-toolbar button:hover .ql-fill,
.ql-snow .ql-toolbar button:hover .ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
  fill: var(--highlight-color) !important;            /* Quill default is #06c */
}

.ql-snow.ql-toolbar button:hover .ql-stroke,
.ql-snow .ql-toolbar button:hover .ql-stroke,
.ql-snow.ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow.ql-toolbar button:hover .ql-stroke-miter,
.ql-snow .ql-toolbar button:hover .ql-stroke-miter,
.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
  stroke: var(--highlight-color) !important;          /* Quill default is #06c */
}
</style>
