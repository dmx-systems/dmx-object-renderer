<template>
  <div class="dm5-assoc">
    <!-- Association Type -->
    <div class="field">
      <div class="field-label">Association Type</div>
      <div v-if="infoMode">{{assoc.typeName}}</div>
      <el-select v-else v-model="assoc.typeUri">
        <el-option v-for="assocType in assocTypes" :label="assocType.value" :value="assocType.uri" :key="assocType.uri">
        </el-option>
      </el-select>
    </div>
    <!-- Generic Object -->
    <dm5-object :object="assoc" :level="0" :context="context"></dm5-object>
    <!-- Roles -->
    <dm5-assoc-role :role="assoc.role1" :mode="mode"></dm5-assoc-role>
    <dm5-assoc-role :role="assoc.role2" :mode="mode"></dm5-assoc-role>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  props: {
    // the Assoc to render
    assoc: {
      type: dm5.Assoc,
      required: true
    }
  },

  computed: {

    mode () {
      return this.context.mode
    },

    // TODO: reusability => inject context instead accessing store
    assocTypes () {
      return this.$store.state.typeCache.assocTypes
    }
  },

  components: {
    'dm5-assoc-role': require('./dm5-assoc-role'),
    'dm5-object':     require('./dm5-object')
  }
}
</script>

<style>
</style>
