<template>
  <dm5-assoc class="dm5-object-renderer" v-if="isAssoc" :assoc="object" :mode="mode"></dm5-assoc>
  <component class="dm5-object-renderer" v-else :is="objectRenderer" :object="object" :mode="mode" :level="0">
  </component>
</template>

<script>
let self

export default {

  created () {
    // console.log('dm5-object-renderer created', this.object.id, this.writable)
    this.initWritable()
    self = this
  },

  destroyed () {
    // console.log('dm5-object-renderer destroyed', this.object.id)
  },

  // Note 1: at the time the provided object is evaluated the component instance does not yet exist. So we can't refer
  // to something like "data" or "props". We can't refer to "self" either as the created() hook is not yet executed.
  // So we can only have literal values here and update them later on.
  // Note 2: we must wrap the properties in an object. Otherwise a) value changes (through parent component) would not
  // be reactive, and b) value changes by a child component would cause Vue to report an "Avoid mutating an injected
  // value directly" error.
  provide: {

    context: {

      // TODO: add "mode"? Would free us from passing it through the entire hierarchy. Would require another watcher.

      /**
       * true if *this* object is writable
       */
      writable: false,

      /**
       * trueish if inline edit is active in this object or in *any* child topic (recursively)
       */
      inlineId: undefined,

      setInlineId (id) {
        // console.log('setInlineId', this, self)
        this.inlineId = id
        self.$emit('inline', id)
      }
    }
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/writable').default,
    require('./mixins/mode').default
  ],

  props: {
    renderers: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  computed: {

    isAssoc () {
      return this.object.isAssoc()
    },

    objectRenderer () {
      return this.renderers[this.object.typeUri] || 'dm5-object'
    }
  },

  watch: {
    writable () {
      // console.log('watch writable', this.object.id, this.writable)
      this.initWritable()
    }
  },

  methods: {
    initWritable () {
      this.$options.provide.context.writable = this.writable
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
