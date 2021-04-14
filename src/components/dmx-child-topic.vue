<template>
  <div v-if="!deleted" :class="['dmx-child-topic', mode, levelClass]">
    <dmx-value-renderer v-if="showRelatingAssoc" :object="object.assoc" :level="level" :path="newPath"
      :comp-def="compDef" :context="context">
    </dmx-value-renderer>
    <dmx-value-renderer :object="object" :level="level" :path="newPath" :comp-def="compDef" :context="context">
    </dmx-value-renderer>
    <!-- Reveal Button -->
    <el-button class="hover-button reveal fa fa-eye" v-if="showRevealButton" type="text" :title="revealTitle"
      @click="reveal">
    </el-button>
    <!-- Add Button -->
    <el-button class="hover-button add fa fa-plus" v-if="showAddRemoveButton" type="text" :title="addTitle"
      @click="add">
    </el-button>
    <!-- Remove Button -->
    <el-button class="hover-button remove fa fa-times" v-if="showAddRemoveButton" type="text" :title="removeTitle"
      @click="remove">
    </el-button>
  </div>
</template>

<script>
export default {

  beforeCreate () {
    // Note: postponed loading resolves cyclic dependency between <dmx-value-renderer> and <dmx-child-topic>
    this.$options.components['dmx-value-renderer'] = require('./dmx-value-renderer').default
  },

  mixins: [
    require('./mixins/object').default,       // child topic to render
    require('./mixins/level').default,
    require('./mixins/path').default,
    require('./mixins/comp-def').default,     // comp def leading to child topic
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  computed: {

    mode () {
      return this.context.mode
    },

    showRelatingAssoc () {
      // object.assoc is undefined if object is a relating assoc itself
      return this.object.assoc && this.compDef.instanceLevelAssocType.isComposite
    },

    showRevealButton () {
      return this.infoMode && this.level === 1
    },

    showAddRemoveButton () {
      return this.formMode && this.compDef.isMany
    },

    revealTitle () {
      return `Reveal ${this.typeName} Topic`
    },

    // TODO: same as removeTitle()?
    addTitle () {
      const type = this.compDef.customAssocType
      return `Add ${type ? type.value : this.compDef.childType.value}`
    },

    removeTitle () {
      const type = this.compDef.customAssocType
      return `Remove ${type ? type.value : this.typeName}`
    },

    newPath () {
      // use custom assoc type name for extended field label rendering (see "fieldLabel" in dmx-value-renderer.vue)
      // if all 3 applies:
      // - there is a custom assoc type
      // - the custom assoc type is simple; if composite the relating assoc rendering is embedded as well
      //   (see "showRelatingAssoc" above) assuming its field labels provide sufficient context info already
      // - this object is composite; if simple the custom assoc type name is used as field label already
      //   (see "fieldLabel" in dmx-value-renderer.vue) and must not be rendered redundantly
      const type = this.compDef.customAssocType
      if (type && type.isSimple && this.object.type.isComposite) {
        const path = this.path.slice()    // avoid side effect in other tree branches
        path.push(type.value)
        return path
      } else {
        return this.path
      }
    },

    typeName () {
      return this.object.typeName
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

    add () {
      this.$emit('child-topic-add', this.compDef)
    },

    remove () {
      this.object.value = this.delRef
    }
  }
}
</script>

<style>
.dmx-child-topic {
  position: relative;
}

.dmx-child-topic > .dmx-value-renderer + .dmx-value-renderer {
  margin-top: var(--field-spacing);
}

/* Hover Button */

.dmx-child-topic > .hover-button {
  position: absolute;
  visibility: hidden;
  padding: 0 !important;
}

.dmx-child-topic:hover > .hover-button {
  visibility: visible;
}

/* Reveal Button */

.dmx-child-topic.level-1 {
  border: 1px solid transparent;
}

.dmx-child-topic.info.level-1:hover {
  border-color: var(--highlight-color);
}

.dmx-child-topic > .hover-button.reveal {
  font-size: 16px !important;
  top: -2px;
  right: -19px;
}

/* Add/Remove Button */

.dmx-child-topic.form.multi:hover {
  border-color: var(--color-danger);
}

.dmx-child-topic > .hover-button.add {
  bottom: 0;
  right: -16px;
}

.dmx-child-topic > .hover-button.remove {
  top: 0;
  right: -16px;
  color: var(--color-danger);
}
</style>
