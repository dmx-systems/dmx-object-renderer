<template>
  <div class="dm5-object-renderer" v-if="object">
    <component :is="objectRenderer" :object="object" :level="0"></component>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/inline-edit').default
  ],

  computed: {

    object () {
      return this.$store.state.object
    },

    objectRenderers () {
      return this.$store.state.objectRenderers
    },

    objectRenderer () {
      console.log('objectRenderer', this.object, this.objectRenderers[this.object.typeUri])
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

.dm5-object-renderer .button {
  margin-top: 1.2em;
}
</style>
