<template>
  <div class="dm5-player">
    <!-- Player Object -->
    <div class="field" v-if="playerObject">
      <div class="field-label">{{playerObject.typeName}}</div>
      <div class="object">
        <div class="fa icon" v-if="playerObject.isTopic()" :style="{color: playerObject.iconColor}">
          {{playerObject.icon}}
        </div>
        <div>{{playerObject.value}}</div>
      </div>
    </div>
    <!-- Role Type -->
    <div class="field">
      <div class="field-label">Role Type</div>
      <div v-if="infoMode">{{player.roleTypeName}}</div>
      <el-select v-else v-model="player.roleTypeUri">
        <el-option v-for="roleType in roleTypes" :label="roleType.value" :value="roleType.uri" :key="roleType.uri">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  props: {
    player: {                   // the player to render
      type: dm5.Player,
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
    // console.log('dm5-player updated')
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
      })
    }
  }
}
</script>

<style>
.dm5-player {
  background-color: white;
  border: 1px solid var(--border-color);
  padding: var(--object-item-padding);
}

.dm5-player .object {
  display: flex;
  align-items: baseline;
}

.dm5-player .object .icon {
  margin-right: var(--icon-spacing);
}

.dm5-player .field + .field {
  margin-top: var(--field-spacing);
}
</style>
