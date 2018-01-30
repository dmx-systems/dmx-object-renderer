<template>
  <component class="dm5-object-renderer" :is="objectRenderer" v-if="object" :object="object" :level="0"></component>
</template>

<script>
export default {

  created () {
    // console.log('dm5-object-renderer created', this.object)
  },

  mounted () {
    // console.log('dm5-object-renderer mounted', this.object)
  },

  inject: ['context'],

  computed: {

    // TODO: reusability => use injected context instead of accessing store

    object () {
      return this.context.object
    },

    objectRenderers () {
      return this.$store.state.objectRenderers
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
