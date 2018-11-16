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
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  props: {
    role: {                 // the assoc role to render
      type: dm5.AssocRole,
      required: true
    },
    types: Object           // Optional: "assocTypes" and "roleTypes" (arrays)
  },

  data () {
    return {
      player: undefined     // fetched asynchronously
    }
  },

  computed: {
    roleTypes () {
      return this.types.roleTypes
    }
  },

  // for component instantiation
  created () {
    this.fetchPlayer()
  },

  updated () {
    // console.log('dm5-assoc-role updated')
    this.context.updated()
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
