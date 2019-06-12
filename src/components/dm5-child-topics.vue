<template>
  <div class="dm5-child-topics">
    <template v-for="compDef in compDefs">
      <!-- one -->
      <template v-if="isOne(compDef)">
        <dm5-child-topic v-if="children(compDef)" :object="children(compDef)" :level="level+1"
          :comp-def="compDef" :context="context" :key="compDef.compDefUri">
        </dm5-child-topic>
      </template>
      <!-- many -->
      <template v-else>
        <dm5-child-topic v-for="(child, i) in children(compDef)" class="multi" :object="child" :level="level+1"
          :comp-def="compDef" :context="context" :key="`${compDef.compDefUri}-${i}-${child.id}`">
        </dm5-child-topic>
        <el-button v-if="formMode" class="add-button" icon="el-icon-plus" :title="addButtonTitle(compDef)"
          @click="addChild(compDef)">
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
      return this.object.type
    },

    compDefs () {
      if (this.level === 0 || this.object.isAssoc() || this.type.isValue()) {
        // Normal rendering
        return this.type.compDefs
      } else {
        // Reduced details: at deeper levels for identity types only their identity attributes are rendered
        return this.type.compDefs.filter(compDef => compDef.isIdentityAttr)
      }
    },

    mode () {
      return this.context.mode
    }
  },

  methods: {

    isOne (compDef) {
      return compDef.isOne()
    },

    children (compDef) {
      return this.object.children[compDef.compDefUri]
    },

    // add value

    addButtonTitle (compDef) {
      const type = compDef.getCustomAssocType()
      return `Add ${type ? type.value : compDef.getChildType().value}`
    },

    addChild (compDef) {
      this.children(compDef).push(compDef.emptyChildInstance())
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
  right: var(--detail-panel-padding);
}
</style>
