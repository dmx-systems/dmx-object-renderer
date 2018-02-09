<template>
  <component class="dm5-object-renderer" :is="objectRenderer" v-if="object" :object="object" :mode="mode" :level="0">
  </component>
</template>

<script>
export default {

  created () {
    // console.log('dm5-object-renderer created')
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
