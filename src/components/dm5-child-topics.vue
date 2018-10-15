<template>
  <div class="dm5-child-topics">
    <template v-for="assocDef in assocDefs">
      <!-- one -->
      <template v-if="isOne(assocDef)">
        <dm5-child-topic v-if="childs(assocDef)" :object="childs(assocDef)" :level="level+1"
          :assoc-def="assocDef" :context="context" :key="assocDef.assocDefUri">
        </dm5-child-topic>
      </template>
      <!-- many -->
      <template v-else>
        <dm5-child-topic v-for="(child, i) in childs(assocDef)" class="multi" :object="child" :level="level+1"
          :assoc-def="assocDef" :context="context" :key="`${assocDef.assocDefUri}-${i}-${child.id}`">
        </dm5-child-topic>
        <el-button v-if="formMode" class="add-button" icon="el-icon-plus" :title="addButtonTitle(assocDef)"
          @click="addChild(assocDef)">
        </el-button>
      </template>
    </template>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/level').default,
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  computed: {

    type () {
      return this.object.getType()
    },

    assocDefs () {
      return this.type.assocDefs
    },

    mode () {
      return this.context.mode
    }
  },

  methods: {

    // add value

    addButtonTitle (assocDef) {
      const type = assocDef.getCustomAssocType()
      return `Add ${type ? type.value : assocDef.getChildType().value}`
    },

    addChild (assocDef) {
      this.childs(assocDef).push(assocDef.emptyChildInstance())
    },

    //

    isOne (assocDef) {
      return assocDef.isOne()
    },

    childs (assocDef) {
      return this.object.childs[assocDef.assocDefUri]
    }
  },

  components: {
    'dm5-child-topic': require('./dm5-child-topic').default       // TODO: change prefix to "dmx"
  }
}
</script>

<style>
.dm5-child-topics .add-button {
  font-size: var(--label-font-size) !important;
  padding: 3px;
  position: absolute;
  right: 0;
}
</style>
