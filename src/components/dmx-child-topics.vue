<template>
  <div class="dmx-child-topics">
    <template v-for="compDef in compDefs">
      <!-- one -->
      <template v-if="isOne(compDef)">
        <dmx-child-topic v-if="children(compDef)" :object="children(compDef)" :level="level+1" :path="path"
          :comp-def="compDef" :context="context" :key="compDef.compDefUri">
        </dmx-child-topic>
      </template>
      <!-- many -->
      <dmx-child-topic v-else v-for="(child, i) in children(compDef)" class="multi" :object="child" :level="level+1"
        :path="path" :comp-def="compDef" :context="context" :key="`${compDef.compDefUri}-${i}-${child.id}`"
        @child-topic-add="addChildTopic">
      </dmx-child-topic>
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
      if (this.level === 0 || this.object.isAssoc || this.type.isValue) {
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
      return compDef.isOne
    },

    children (compDef) {
      return this.object.children[compDef.compDefUri]
    },

    addChildTopic (compDef) {
      this.children(compDef).push(compDef.emptyChildInstance())
    }
  },

  components: {
    'dmx-child-topic': require('./dmx-child-topic').default
  }
}
</script>

<style>
.dmx-child-topics > .dmx-child-topic + .dmx-child-topic {
  margin-top: var(--field-spacing);
}
</style>
