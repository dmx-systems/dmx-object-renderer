<template>
  <div class="dm5-html-field" v-if="infoMode" v-html="object.value" ref="html"></div>
  <div v-else>
    <!-- Without this wrapper <div> the Quill toolbar remains visible when switching to info mode.   -->
    <!-- This is because the Quill toolbar becomes a *sibling* (not a child) of the <quill> element. -->
    <quill v-model="object.value" :options="quillOptions" @quill-imported="registerExtension" @quill-ready="quillReady">
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
    this.addLinkHandlers()
  },

  updated () {
    // console.log('dm5-html-field updated()', this.mode)
    this.addLinkHandlers()
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
    }
  },

  methods: {

    // TODO: move the entire "topic link" aspect to the host app

    // TODO: let the host app register extensions
    registerExtension (Quill) {
      Quill.register(topicLinkFormat(Quill))
    },

    // TODO: let the host app setup the format buttons
    quillReady (quill) {
      // FIXME: handle multiple Quill instances
      const button = document.querySelector('button.ql-topic-link')
      button.textContent = 'T'    // TODO: use real (SVG) icon
      button.setAttribute('title', 'Embed a topic link')
    },

    // TODO: let the host app setup the link handlers
    addLinkHandlers () {
      if (this.infoMode) {
        // FIXME: event handlers are registered twice, through updated()
        this.$refs.html.querySelectorAll('a.topic-link').forEach(link => {
          link.addEventListener('click', e => {
            const topicId = Number(e.target.dataset.topicId)
            console.log('topic link clicked', topicId)
            this.$store.dispatch('revealTopicById', topicId)
            e.preventDefault()    // suppress browser's default link click behavior
            e.stopPropagation()   // prevent activating inline edit
          })
        })
      }
    }
  },

  components: {
    quill: () => import(/* webpackChunkName: "quill" */ 'vue-quill-minimum')
  }
}

function topicLinkFormat (Quill) {

  class TopicLink extends Quill.import('formats/link') {    // Note: 'formats/link' extends 'blots/inline'

    // Creates a DOM node corresponding to the given (model) values
    static create (value) {
      // console.log('TopicLink create()', value)
      const node = super.create()
      node.removeAttribute('target')    // target attribute was added by Link class
      node.setAttribute('href', '')     // href attribute required to render in link style
      node.dataset.topicId = value.topicId
      node.dataset.linkId  = value.linkId
      return node
    }

    // Returns the (model) value represented by the given DOM node
    static formats (node) {
      // console.log('TopicLink formats()', node)
      return {
        topicId: node.dataset.topicId,  // FIXME: convert to Number?
        linkId:  node.dataset.linkId    // FIXME: convert to Number?
      }
    }
  }

  TopicLink.blotName = 'topic-link'     // Used in "toolbar" config, quill.format() and module.addHandler() calls.
                                        // Will be prefixed by "ql-" to form the CSS class name for the toolbar button.
  // TopicLink.tagName = 'A'            // not needed as it is derived
  TopicLink.className = 'topic-link'    // CSS class to be added to the <a> element
  return TopicLink
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
