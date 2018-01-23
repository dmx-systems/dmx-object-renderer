<template>
  <component class="dm5-object-renderer" :is="objectRenderer" v-if="object" :object="object" :level="0"></component>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('created', this.object.id)
  },

  mounted () {
    // console.log('mounted', this.object.id)
  },

  computed: {

    // TODO: reusability => pass data as props instead of accessing store

    object () {
      return this.$store.state.object
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
