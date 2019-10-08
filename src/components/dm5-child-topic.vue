<template>
  <div v-if="!deleted" :class="['dm5-child-topic', mode, levelClass]">
    <dm5-value-renderer v-if="showRelatingAssoc" :object="object.assoc" :level="level" :path="newPath"
      :comp-def="compDef" :context="context">
    </dm5-value-renderer>
    <dm5-value-renderer :object="object" :level="level" :path="newPath" :comp-def="compDef" :context="context">
    </dm5-value-renderer>
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
import dm5 from 'dm5'

export default {

  beforeCreate () {
    // Note: postponed loading resolves cyclic dependency between <dm5-value-renderer> and <dm5-child-topic>
    this.$options.components['dm5-value-renderer'] = require('./dm5-value-renderer').default
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
      return this.object.assoc && this.compDef.getInstanceLevelAssocType().isComposite()
    },

    showRevealButton () {
      return this.infoMode && this.level === 1
    },

    showAddRemoveButton () {
      return this.formMode && this.compDef.isMany()
    },

    revealTitle () {
      return `Reveal ${this.typeName} Topic`
    },

    // TODO: same as removeTitle()?
    addTitle () {
      const type = this.compDef.getCustomAssocType()
      return `Add ${type ? type.value : this.compDef.getChildType().value}`
    },

    removeTitle () {
      const type = this.compDef.getCustomAssocType()
      return `Remove ${type ? type.value : this.typeName}`
    },

    newPath () {
      // use custom assoc type name for extended field label rendering (see "fieldLabel" in dm5-value-renderer.vue)
      // if all 3 applies:
      // - there is a custom assoc type
      // - the custom assoc type is simple; if composite the relating assoc rendering is embedded as well
      //   (see "showRelatingAssoc" above) assuming its field labels provide sufficient context info already
      // - this object is composite; if simple the custom assoc type name is used as field label already
      //   (see "fieldLabel" in dm5-value-renderer.vue) and must not be rendered redundantly
      const type = this.compDef.getCustomAssocType()
      if (type && type.isSimple() && this.object.type.isComposite()) {
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
.dm5-child-topic {
  position: relative;
}

.dm5-child-topic > .dm5-value-renderer + .dm5-value-renderer {
  margin-top: var(--field-spacing);
}

/* Hover Button */

.dm5-child-topic > .hover-button {
  position: absolute;
  top: 0;
  right: -12px;
  visibility: hidden;
  padding: 0 !important;
}

.dm5-child-topic:hover > .hover-button {
  visibility: visible;
}

/* Reveal Button */

.dm5-child-topic.level-1 {
  border: 1px solid transparent;
}

.dm5-child-topic.info.level-1:hover {
  border-color: var(--highlight-color);
}

/* Add/Remove Button */

.dm5-child-topic.form.multi:hover {
  border-color: var(--color-danger);
}

.dm5-child-topic > .hover-button.add {
  top: unset;
  bottom: 0;
}

.dm5-child-topic > .hover-button.remove {
  color: var(--color-danger);
}
</style>
