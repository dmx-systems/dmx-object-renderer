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
      // Reduced detail rendering: at deeper levels for identity types only their identity attributes are rendered
      return this.level === 0 || !this.type.isIdentity() ? this.type.assocDefs : this.type.getIdentityAssocDefs()
    },

    mode () {
      return this.context.mode
    }
  },

  methods: {

    isOne (assocDef) {
      return assocDef.isOne()
    },

    childs (assocDef) {
      return this.object.childs[assocDef.assocDefUri]
    },

    // add value

    addButtonTitle (assocDef) {
      const type = assocDef.getCustomAssocType()
      return `Add ${type ? type.value : assocDef.getChildType().value}`
    },

    addChild (assocDef) {
      this.childs(assocDef).push(assocDef.emptyChildInstance())
    }
  },

  components: {
    'dm5-child-topic': require('./dm5-child-topic').default       // TODO: change prefix to "dmx"
  }
}
</script>

<style>
.dm5-child-topics > .dm5-child-topic + .dm5-child-topic,
.dm5-child-topics > .add-button      + .dm5-child-topic {
  margin-top: var(--field-spacing);
}

.dm5-child-topics > .add-button {
  font-size: var(--label-font-size) !important;
  padding: 3px;
  position: absolute;
  right: 0;
}
</style>
