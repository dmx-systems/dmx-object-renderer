<template>
  <div class="dm5-child-topics">
    <template v-for="compDef in compDefs">
      <!-- one -->
      <template v-if="isOne(compDef)">
        <dm5-child-topic v-if="children(compDef)" :object="children(compDef)" :level="level+1" :path="path"
          :comp-def="compDef" :context="context" :key="compDef.compDefUri">
        </dm5-child-topic>
      </template>
      <!-- many -->
      <dm5-child-topic v-else v-for="(child, i) in children(compDef)" class="multi" :object="child" :level="level+1"
        :path="path" :comp-def="compDef" :context="context" :key="`${compDef.compDefUri}-${i}-${child.id}`"
        @child-topic-add="addChildTopic">
      </dm5-child-topic>
    </template>
  </div>
</template>

<script>
export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/level').default,
    require('./mixins/path').default,
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
        // Reduced details: at deeper levels for entity types only their identity attributes are rendered
        return this.type.compDefs.filter(compDef => compDef.isIdentityAttr)
      }
    }
  },

  methods: {

    isOne (compDef) {
      return compDef.isOne()
    },

    children (compDef) {
      return this.object.children[compDef.compDefUri]
    },

    addChildTopic (compDef) {
      this.children(compDef).push(compDef.emptyChildInstance())
    }
  },

  components: {
    'dm5-child-topic': require('./dm5-child-topic').default       // TODO: change prefix to "dmx"
  }
}
</script>

<style>
.dm5-child-topics > .dm5-child-topic + .dm5-child-topic {
  margin-top: var(--field-spacing);
}
</style>
