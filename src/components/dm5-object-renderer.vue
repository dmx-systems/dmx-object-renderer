<template>
  <component class="dm5-object-renderer" :is="objectRenderer" v-if="object" :object="object" :mode="mode" :level="0">
  </component>
</template>

<script>
export default {

  inject: ['context'],

  mixins: [
    require('./mixins/mode-prop').default
  ],

  computed: {

    object () {
      return this.context.object
    },

    objectRenderers () {
      return this.context.objectRenderers
    },

    objectRenderer () {
      return this.objectRenderers[this.object.typeUri] || 'dm5-object'
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
