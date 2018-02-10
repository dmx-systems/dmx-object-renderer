<template>
  <!-- TODO: move CSS class to root element -->
  <dm5-assoc v-if="isAssoc" :assoc="object" :mode="mode"></dm5-assoc>
  <component v-else class="dm5-object-renderer" :is="objectRenderer" :object="object" :mode="mode" :level="0">
  </component>
</template>

<script>
let self

export default {

  created () {
    console.log('dm5-object-renderer created', this.object.id, this.writable)
    this.initWritable()
    self = this
  },

  destroyed () {
    // console.log('dm5-object-renderer destroyed')
  },

  // Note: at the time the provided object is evaluated the component instance does not yet exist. So we can't refer
  // to something like "data" or "props". We can't refer to "self" either as the created() hook is not yet executed.
  // So we can only have literal values here and update them later on.
  provide: {

    context: {

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
    require('./mixins/mode-prop').default
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
      console.log('watch writable', this.object.id, this.writable)
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
.dm5-object-renderer .field {
  margin-top: 1.2em;
}
</style>
