<template>
  <!-- TODO: move CSS class to root element -->
  <dm5-assoc v-if="isAssoc" :assoc="object" :mode="mode"></dm5-assoc>
  <component v-else class="dm5-object-renderer" :is="objectRenderer" :object="object" :mode="mode" :level="0">
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

    isAssoc () {
      return this.object.isAssoc()
    },

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
