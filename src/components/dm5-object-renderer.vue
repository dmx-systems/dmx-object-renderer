<template>
  <component class="dm5-object-renderer" :is="objectRenderer" :object="object" :mode="mode" :level="0">
  </component>
</template>

<script>
export default {

  created () {
    // console.log('dm5-object-renderer created', this.object.id)
  },

  destroyed () {
    // console.log('dm5-object-renderer destroyed')
  },

  mixins: [
    require('./mixins/object').default,
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
    objectRenderer () {
      return this.renderers[this.object.typeUri] || 'dm5-object'
    }
  },

  provide: {
    context: {
      inlineId: undefined
    }
  },

  components: {
    'dm5-object': require('./dm5-object')
  }
}
</script>

<style>
.dm5-object-renderer .field {
  margin-top: 1.2em;
}
</style>
