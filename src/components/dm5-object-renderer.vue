<template>
  <dm5-assoc class="dm5-object-renderer" v-if="isAssoc" :assoc="object" :context="context"></dm5-assoc>
  <component class="dm5-object-renderer" v-else :is="objectRenderer" :object="object" :level="0" :context="context">
  </component>
</template>

<script>
export default {

  created () {
    // console.log('dm5-object-renderer created', this.object.id, this.writable)
  },

  destroyed () {
    // console.log('dm5-object-renderer destroyed', this.object.id)
  },

  mixins: [
    require('./mixins/object').default,   // TODO: make "object" an optional prop to better support async fetching
    require('./mixins/writable').default,
    require('./mixins/mode-default').default
  ],

  props: {
    renderers: {
      type: Object,
      default () {
        return {}
      }
    },
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
        writable:    this.writable,
        inlineId:    this.inlineId,
        renderers:   this.renderers,
        quillConfig: this.quillConfig,
        setInlineId: id => {
          // console.log('setInlineId', id)
          this.inlineId = id
          this.$emit('inline', id)
        },
        submit: () => {
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
    }
  },

  components: {
    'dm5-value-renderer': require('./dm5-value-renderer').default,
    'dm5-assoc':          require('./dm5-assoc').default
  }
}
</script>
