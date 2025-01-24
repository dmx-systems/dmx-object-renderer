<template>
  <div class="dmx-player">
    <!-- Player Object -->
    <div class="field" v-if="playerObject">
      <div class="field-label">{{playerObject.typeName}}</div>
      <div class="object">
        <div class="fa icon" v-if="playerObject.isTopic" :style="{color: playerObject.iconColor}">
          {{playerObject.icon}}
        </div>
        <div>{{playerObject.value}}</div>
      </div>
    </div>
    <!-- Role Type -->
    <div class="field">
      <div class="field-label">Role Type</div>
      <div v-if="infoMode">{{player.roleTypeName}}</div>
      <el-select v-else class="role-type-selector" v-model="player.roleTypeUri">
        <el-option v-for="roleType in roleTypes" :label="roleType.value" :value="roleType.uri" :key="roleType.uri">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import dmx from 'dmx-api'

export default {

  mixins: [
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  props: {
    player: {                   // the player to render
      type: dmx.Player,
      required: true
    },
    pos: {
      type: Number,             // player position: 1 or 2
      required: true
    },
    types: Object               // Optional: "assocTypes" and "roleTypes" (arrays)
  },

  data () {
    return {
      playerObject: undefined   // fetched asynchronously
    }
  },

  computed: {
    roleTypes () {
      return Object.values(this.types.roleTypes).sort(
        (rt1, rt2) => rt1.value.localeCompare(rt2.value)
      )
    }
  },

  // for component instantiation
  created () {
    this.fetchPlayer()
  },

  updated () {
    // console.log('dmx-player updated')
    this.context.updated()
  },

  // for component reuse
  watch: {
    player () {
      this.fetchPlayer()
    }
  },

  methods: {
    fetchPlayer () {
      this.player.fetch().then(playerObject => {
        this.playerObject = playerObject
        this.$emit('player-update', {playerObject, pos: this.pos})
      })
    }
  }
}
</script>

<style>
.dmx-player {
  background-color: white;
  border: 1px solid var(--border-color);
  padding: var(--object-item-padding);
}

.dmx-player .object {
  display: flex;
  align-items: baseline;
}

.dmx-player .object .icon {
  margin-right: var(--icon-spacing);
}

.dmx-player .role-type-selector {
  max-width: 200px;
}

.dmx-player .field + .field {
  margin-top: var(--field-spacing);
}
</style>
