<template>
  <div class="dm5-assoc-role">
    <!-- Player -->
    <div v-if="player">{{player.typeName}}: "{{player.value}}"</div>
    <!-- Role Type -->
    <div class="field-label">Role Type</div>
    <div v-if="infoMode">{{role.typeName}}</div>
    <el-select v-else v-model="role.roleTypeUri">
      <el-option v-for="roleType in roleTypes" :label="roleType.value" :value="roleType.uri" :key="roleType.uri">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  props: {
    // the assoc role to render
    role: {
      type: dm5.AssocRole,
      required: true
    }
  },

  data () {
    return {
      player: undefined
    }
  },

  computed: {
    roleTypes () {
      return this.$store.state.typeCache.roleTypes
    }
  },

  // for component instantiation
  created () {
    this.fetchPlayer()
  },

  updated () {
    this.$emit('updated')
  },

  // for component reuse
  watch: {
    role () {
      this.fetchPlayer()
    }
  },

  methods: {
    fetchPlayer () {
      this.role.getPlayer().then(player => {
        this.player = player
      })
    }
  }
}
</script>

<style>
.dm5-assoc-role {
  background-color: var(--background-color-darker);
}

.dm5-assoc-role .field-label {
  margin-top: var(--field-spacing);
}
</style>
