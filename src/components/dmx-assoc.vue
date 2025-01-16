<template>
  <div class="dmx-assoc">
    <!-- Association Type -->
    <div class="field-label">Association Type</div>
    <div v-if="infoMode">{{assoc.typeName}}</div>
    <el-select v-else v-model="assoc.typeUri">
      <el-option v-for="assocType in assocTypes" :label="assocType.value" :value="assocType.uri" :key="assocType.uri"
        :disabled="disabled(assocType)">
      </el-option>
    </el-select>
    <!-- Association Value -->
    <dmx-value-renderer :object="assoc" :level="0" :path="[]" :context="context" no-heading></dmx-value-renderer>
    <!-- Player -->
    <dmx-player :player="assoc.player1" :pos="1" :mode="mode" :types="types" :context="context"
      @player-update="updatePlayer"></dmx-player>
    <dmx-player :player="assoc.player2" :pos="2" :mode="mode" :types="types" :context="context"
      @player-update="updatePlayer"></dmx-player>
  </div>
</template>

<script>
import dmx from 'dmx-api'

export default {

  created () {
    // console.log('dmx-assoc created', this.types)
  },

  mixins: [
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  props: {
    assoc: {              // the assoc to render
      type: dmx.Assoc,
      required: true
    },
    types: Object         // Optional: "assocTypes" and "roleTypes" (arrays)
  },

  data () {
    return {
      playerObjects: [],
      workspace: undefined,       // TODO: factor out
      workspaceWritable: false    // TODO: factor out
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

    // TODO: factor out. Move logic to AccessControl module. Add object-renderer extension point.
    disabled (assocType) {
      if (assocType.uri === 'dmx.accesscontrol.membership') {
        const username = this.getPlayerByType('dmx.accesscontrol.username')
        this.workspace = this.getPlayerByType('dmx.workspaces.workspace')
        // console.log('disabled (1)', !username || !this.workspace)
        if (!username || !this.workspace) {
          return true
        }
        this.workspace.isWritable().then(isWritable => {
          // console.log('isWritable', isWritable)
          this.workspaceWritable = isWritable
        })
        // console.log('disabled (2)', !this.workspaceWritable)
        return !this.workspaceWritable
      }
      return false
    },

    getPlayerByType (typeUri) {
      // console.log('getPlayerByType', this.playerObjects[0], this.playerObjects[1])
      const m1 = this.playerObjects[0] && this.playerObjects[0].typeUri === typeUri
      const m2 = this.playerObjects[1] && this.playerObjects[1].typeUri === typeUri
      return m1 && !m2 ? this.playerObjects[0] : m2 && !m1 ? this.playerObjects[1] : undefined
    },

    updatePlayer ({playerObject, pos}) {
      // console.log('updatePlayer', pos, playerObject)
      this.playerObjects[pos - 1] = playerObject
    }
  },

  components: {
    'dmx-player':         require('./dmx-player').default,
    'dmx-value-renderer': require('./dmx-value-renderer').default
  }
}
</script>

<style>
.dmx-assoc > .dmx-value-renderer,
.dmx-assoc .dmx-player {
  margin-top: var(--field-spacing);
}
</style>
