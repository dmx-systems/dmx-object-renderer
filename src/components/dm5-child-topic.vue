<template>
  <div v-if="!deleted" :class="['dm5-child-topic', mode, levelClass]">
    <dm5-object-value v-if="showRelatingAssoc" :object="object.assoc" :level="level" :assoc-def="assocDef"
      :context="context">
    </dm5-object-value>
    <dm5-object-value :object="object" :level="level" :assoc-def="assocDef" :context="context"></dm5-object-value>
    <!-- Reveal Button -->
    <el-button class="hover-button" v-if="showRevealButton" type="text" @click="reveal">Reveal</el-button>
    <!-- Remove Button -->
    <el-button class="hover-button remove" v-if="showRemoveButton" type="text" @click="remove">Remove</el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  beforeCreate () {
    // Note: postponed loading resolves cyclic dependency between <dm5-object-value> and <dm5-child-topic>
    this.$options.components['dm5-object-value'] = require('./dm5-object-value').default
  },

  mixins: [
    require('./mixins/object').default,       // child topic to render
    require('./mixins/level').default,
    require('./mixins/assoc-def').default,    // assoc def leading to child topic
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  computed: {

    mode () {
      return this.context.mode
    },

    showRelatingAssoc () {
      // object.assoc is undefined if object is a relating assoc
      if (this.object.assoc) {
        // sanity check
        if (this.object.assoc.typeUri !== this.assocDef.instanceLevelAssocTypeUri) {
          throw Error(`Type mismatch`)
        }
        //
        return this.assocDef.getInstanceLevelAssocType().isComposite()
      }
    },

    showRevealButton () {
      return this.infoMode && this.level === 1
    },

    showRemoveButton () {
      return this.formMode && this.assocDef.isMany()
    },

    levelClass () {
      return `level-${this.level}`
    },

    delRef () {
      return `del_id:${this.object.id}`
    },

    deleted () {
      return this.object.value === this.delRef
    }
  },

  methods: {

    reveal () {
      this.context.revealChild(this.object)
    },

    remove () {
      this.object.value = this.delRef
    }
  }
}
</script>

<style>
.dm5-child-topic {
  position: relative;
}

/* Hover Button */

.dm5-child-topic .hover-button {
  position: absolute;
  top: 0;
  right: 0;
  visibility: hidden;
  font-size: var(--label-font-size) !important;
  padding: 0 !important;
}

.dm5-child-topic:hover .hover-button {
  visibility: visible;
}

/* Reveal Button */

.dm5-child-topic.info.level-1 {
  border: 1px solid transparent;
}

.dm5-child-topic.info.level-1:hover {
  border-color: var(--highlight-color);
}

/* Remove Button */

.dm5-child-topic.form.multi:hover {
  box-shadow: var(--shadow-hover) var(--color-danger);
}

.dm5-child-topic .hover-button.remove {
  color: var(--color-danger);
}
</style>
