<template>
  <div class="dm5-assoc">
    <!-- Association Type -->
    <div class="field-label">Association Type</div>
    <div v-if="infoMode">{{assoc.typeName}}</div>
    <el-select v-else v-model="assoc.typeUri">
      <el-option v-for="assocType in assocTypes" :label="assocType.value" :value="assocType.uri" :key="assocType.uri"
        :disabled="disabled(assocType)">
      </el-option>
    </el-select>
    <!-- Association Value -->
    <dm5-value-renderer :object="assoc" :level="0" :path="[]" :context="context" no-heading></dm5-value-renderer>
    <!-- Player -->
    <dm5-player :player="assoc.player1" :pos="1" :mode="mode" :types="types" :context="context"
      @player-update="updatePlayer"></dm5-player>
    <dm5-player :player="assoc.player2" :pos="2" :mode="mode" :types="types" :context="context"
      @player-update="updatePlayer"></dm5-player>
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

  data () {
    return {
      playerObjects: []
    }
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

  methods: {

    // TODO: add extension point. Move logic to AccessControl module.
    disabled (assocType) {
      if (assocType.uri === 'dmx.accesscontrol.membership') {
        const username = this.getPlayerByType('dmx.accesscontrol.username')
        const workspace = this.getPlayerByType('dmx.workspaces.workspace')
        // console.log('### disabled', !username || !workspace)
        return !username || !workspace
      }
      return false
    },

    getPlayerByType (typeUri) {
      // console.log('getPlayerByType', this.playerObjects[0], this.playerObjects[1])
      const m1 = this.playerObjects[0] && this.playerObjects[0].typeUri === typeUri
      const m2 = this.playerObjects[1] && this.playerObjects[1].typeUri === typeUri
      return m1 && !m2 ? m1 : m2 && !m1 ? m2 : undefined
    },

    updatePlayer ({playerObject, pos}) {
      // console.log('### updatePlayer', pos, playerObject)
      this.playerObjects[pos - 1] = playerObject
      this.$forceUpdate()     // force recalculation of the per-assoc-type disabled flags
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
