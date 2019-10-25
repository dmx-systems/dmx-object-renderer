<template>
  <div class="dm5-assoc">
    <!-- Association Type -->
    <div class="field-label">Association Type</div>
    <div v-if="infoMode">{{assoc.typeName}}</div>
    <el-select v-else v-model="assoc.typeUri">
      <el-option v-for="assocType in assocTypes" :label="assocType.value" :value="assocType.uri" :key="assocType.uri">
      </el-option>
    </el-select>
    <!-- Association Value -->
    <dm5-value-renderer :object="assoc" :level="0" :path="[]" :context="context" no-heading></dm5-value-renderer>
    <!-- Player -->
    <dm5-player :player="assoc.player1" :mode="mode" :types="types" :context="context"></dm5-player>
    <dm5-player :player="assoc.player2" :mode="mode" :types="types" :context="context"></dm5-player>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-assoc created', this.types)
  },

  mixins: [
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  props: {
    assoc: {              // the assoc to render
      type: dm5.Assoc,
      required: true
    },
    types: Object         // Optional: "assocTypes" and "roleTypes" (arrays)
  },

  computed: {

    mode () {
      return this.context.mode
    },

    assocTypes () {
      return Object.values(this.types.assocTypes).sort(
        (at1, at2) => at1.value.localeCompare(at2.value)
      )
    }
  },

  components: {
    'dm5-player':         require('./dm5-player').default,
    'dm5-value-renderer': require('./dm5-value-renderer').default
  }
}
</script>

<style>
.dm5-assoc > .dm5-value-renderer,
.dm5-assoc .dm5-player {
  margin-top: var(--field-spacing);
}
</style>
