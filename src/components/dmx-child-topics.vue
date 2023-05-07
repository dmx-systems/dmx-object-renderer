<template>
  <div class="dmx-child-topics">
    <template v-for="compDef in compDefs">
      <!-- one -->
      <template v-if="compDef.isOne">
        <dmx-child-topic v-if="children(compDef)" :object="children(compDef)" :level="level+1" :path="path"
          :comp-def="compDef" :context="context" :key="compDef.compDefUri">
        </dmx-child-topic>
      </template>
      <!-- many -->
      <template v-else>
        <template v-if="infoMode">
          <dmx-child-topic v-for="(child, i) in children(compDef)" class="multi" :object="child" :level="level+1"
            :path="path" :comp-def="compDef" :context="context" :key="`${compDef.compDefUri}-${i}-${child.id}`">
          </dmx-child-topic>
        </template>
        <draggable v-else class="draggable" :list="children(compDef)" handle=".handle" :animation="300"
            @start="drag=true" @end="drag=false">
          <div v-for="(child, i) in children(compDef)" class="item">
            <dmx-child-topic class="multi" :object="child" :level="level+1"
              :path="path" :comp-def="compDef" :context="context" :key="`${compDef.compDefUri}-${i}-${child.id}`"
              @child-topic-add="addChildTopic">
            </dmx-child-topic>
            <div :class="['handle', {drag}]" v-if="handleVisibility(compDef)"></div>
          </div>
        </draggable>
      </template>
    </template>
  </div>
</template>

<script>
export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/level').default,
    require('./mixins/path').default,
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  data () {
    return {
      drag: false
    }
  },

  computed: {

    mode () {
      return this.context.mode
    },

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

    children (compDef) {
      return this.object.children[compDef.compDefUri]
    },

    handleVisibility (compDef) {
      return this.children(compDef).length > 1
    },

    addChildTopic (compDef) {
      this.children(compDef).push(compDef.emptyChildInstance(this.level + 1))
    }
  },

  components: {
    'dmx-child-topic': require('./dmx-child-topic').default,
    draggable: () => ({
      component: import('vuedraggable' /* webpackChunkName: "vuedraggable" */),
      loading: require('./dmx-spinner')
    })
  }
}
</script>

<style>
.dmx-child-topics > .dmx-child-topic + .dmx-child-topic,
.dmx-child-topics > .dmx-child-topic + .draggable,
.dmx-child-topics > .draggable + .dmx-child-topic,
.dmx-child-topics > .draggable + .draggable,
.dmx-child-topics > .draggable > .item + .item {
  margin-top: var(--field-spacing);
}

.dmx-child-topics > .draggable > .item {
  display: flex;
}

.dmx-child-topics > .draggable > .item > .dmx-child-topic {
  flex-grow: 1;
}

.dmx-child-topics > .draggable > .item > .handle {
  flex-basis: 14px;
  flex-shrink: 0;
  margin-left: 16px;
  background-image: url("../resources/dots.png");
  border: 2px solid white;
}

.dmx-child-topics > .draggable > .item > .handle:hover {
  cursor: grab;
}

.dmx-child-topics > .draggable > .item > .handle.drag {
  cursor: grabbing !important;
}
</style>
