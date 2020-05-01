<template>
  <dm5-assoc class="dm5-object-renderer" v-if="isAssoc" :assoc="object" :types="types" :context="context"></dm5-assoc>
  <component class="dm5-object-renderer" v-else :is="objectRenderer" :object="object" :level="0" :path="[]"
    :context="context">
  </component>
</template>

<script>
export default {

  created () {
    // console.log('dm5-object-renderer created', this.object, this.writable, this.mode)
    this.focus()
  },

  destroyed () {
    // console.log('dm5-object-renderer destroyed', this.object.id)
  },

  mixins: [
    require('./mixins/object').default,   // TODO: make "object" an optional prop to better support async fetching
    require('./mixins/writable').default,
    require('./mixins/mode-default').default,
    require('./mixins/info-mode').default
  ],

  props: {
    renderers: {
      type: Object,
      default () {
        return {}
      }
    },
    types: Object,    // Optional: "assocTypes" and "roleTypes" (arrays)
    quillConfig: Object
  },

  data () {
    return {
      // trueish if inline edit is active in this object or in *any* child topic (recursively)
      inlineId: undefined
    }
  },

  computed: {

    isAssoc () {
      return this.object.isAssoc()
    },

    objectRenderer () {
      const objectRenderers = this.renderers.object
      return objectRenderers && objectRenderers[this.object.typeUri] || 'dm5-value-renderer'
    },

    /**
     * The context passed through the dm5-value-renderer hierarchy.
     */
    context () {
      return {
        mode:        this.mode,
        editable:    this.writable && !this.editDisabled,
        inlineId:    this.inlineId,
        renderers:   this.renderers,
        quillConfig: this.quillConfig,
        setInlineId: id => {
          // console.log('setInlineId', id)
          this.inlineId = id
          this.$emit('inline', id)
        },
        submit: () => {   // TODO: still needed?
          this.$emit('submit')
        },
        revealChild: relTopic => {
          this.$emit('child-topic-reveal', relTopic)
        },
        updated: () => {
          // console.log('context updated', this.object.id)
          this.$emit('updated')
        }
      }
    },

    // copy in dm5-info-tab.vue (as buttonDisabled())
    editDisabled () {
      // only entity topics are enabled; assocs and types are always enabled
      return this.object.isTopic() && !this.object.isType() && !this.object.type.isEntity()
    }
  },

  watch: {
    object () {
      // console.log('object watcher', this.mode)
      this.focus()
    }
  },

  methods: {
    focus () {
      if (!this.formMode) {
        return
      }
      // Note: at dm5-object-renderer instantiation resp. at enter-form-mode the form components are not yet created
      this.$nextTick(() => {
        const leaf = findLeaf(this)
        // console.log('focus', leaf, leaf.$el, leaf.focus)
        if (leaf.focus) {
          leaf.focus()
        } else {
          // Note: Quill editor component is loaded asynchronously and might not yet ready ### TODO
          console.warn('No focusable form element found')
        }
      })
    }
  },

  components: {
    'dm5-value-renderer': require('./dm5-value-renderer').default,
    'dm5-assoc':          require('./dm5-assoc').default
  }
}

function findLeaf (vm) {
  // console.log('findLeaf', vm.$children, vm.$children.length)
  const child = vm.$children[0]
  return child ? findLeaf(child) : vm
}
</script>
