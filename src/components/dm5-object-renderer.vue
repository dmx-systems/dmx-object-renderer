<template>
  <div class="dm5-object-renderer" v-if="object">
    <component :is="objectRenderer" :object="object" :level="0"></component>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  // Note: we can't do the store registrations in index.js as we have no access to the store object there,
  // and we can't import the store object either as it is not part of a Node.js module. So we use the
  // component's created() hook to do the registrations.
  created () {
    console.log('dm5-object-renderer created')
    this.$store.registerModule('objectRenderer', require('../object-renderer').default)
  },

  mixins: [
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/inline-edit').default
  ],

  computed: {

    object () {
      return this.$store.state.objectRenderer.object
    },

    writable () {
      return this.$store.state.objectRenderer.writable
    },

    objectRenderers () {
      return this.$store.state.objectRenderer.objectRenderers
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
