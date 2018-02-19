<template>
  <dm5-assoc class="dm5-object-renderer" v-if="isAssoc" :assoc="object" :context="context" @updated="updated">
  </dm5-assoc>
  <component class="dm5-object-renderer" v-else :is="objectRenderer" :object="object" :level="0" :context="context">
  </component>
</template>

<script>
export default {

  created () {
    // console.log('dm5-object-renderer created', this.object.id, this.writable)
  },

  updated () {
    // console.log('dm5-object-renderer updated', this.object.id)
    this.$emit('updated')
  },

  destroyed () {
    // console.log('dm5-object-renderer destroyed', this.object.id)
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/writable').default,
    require('./mixins/mode-default').default
  ],

  props: {
    renderers: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    // trueish if inline edit is active in this object or in *any* child topic (recursively)
    inlineId: undefined
  }),

  computed: {

    isAssoc () {
      return this.object.isAssoc()
    },

    objectRenderer () {
      return this.renderers[this.object.typeUri] || 'dm5-object'
    },

    /**
     * The context passed through the dm5-object hierarchy.
     */
    context () {
      return {
        mode:        this.mode,
        writable:    this.writable,
        inlineId:    this.inlineId,
        setInlineId: this.setInlineId
      }
    }
  },

  methods: {

    setInlineId (id) {
      // console.log('setInlineId', id)
      this.inlineId = id
      this.$emit('inline', id)
    },

    updated () {
      // console.log('updated()')
      this.$emit('updated')
    }
  },

  components: {
    'dm5-object': require('./dm5-object'),
    'dm5-assoc':  require('./dm5-assoc')
  }
}
</script>

<style>
/* TODO: move this rule to dm5-object, add additional rules to dm5-assoc and dm5-assoc-role */
.dm5-object-renderer .field {
  margin-top: 1.2em;
}
</style>
