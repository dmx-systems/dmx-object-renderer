<template>
  <div class="dm5-html-field" v-if="infoMode" v-html="object.value" ref="info"></div>
  <div class="dm5-html-field" v-else>
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
    this.domReady()
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
    }
  },

  components: {
    quill: () => ({
      component: import('vue-quill-minimum' /* webpackChunkName: "quill" */),
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

.ql-container {
  font-family: var(--main-font-family) !important;    /* Quill default is "Helvetica, Arial, sans-serif" */
  font-size:   var(--main-font-size)   !important;    /* Quill default is 13px */
}

.ql-container.ql-bubble {
  border: 1px solid var(--border-color)
}

.ql-container.ql-bubble .ql-tooltip {
  width: 250px;     /* fixed toolbar width */
  z-index: 2;       /* stack toolbar above adjacent detail panel fields and el-checkboxes (z-index 1) */
}

.ql-editor {
  line-height: inherit !important;                    /* Quill default is 1.42; inherit from dm5-html-field */
  padding: 6px 8px !important;                        /* Quill default is 12px 15px */
  background-color: white;
}
</style>
