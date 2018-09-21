<template>
  <div :class="['dm5-object', localMode, {writable}]" @click.stop="editInline">
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{simpleLabel}}</div>
      <div :class="['field-content', isHtmlField ? 'html' : 'no-html']">
        <component :is="simpleComp" :object="object" :mode="localMode" :assoc-def="assocDef" :context="context">
        </component>
        <el-button class="save-button" v-if="inlineEdit" @click.stop="submitInline">Save</el-button>
      </div>
    </div>
    <!-- composite -->
    <template v-else v-for="assocDef in assocDefs">
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

  created () {
    // console.log('dm5-object created', this.object)
  },

  destroyed () {
    // console.log('dm5-object destroyed', this.object.id)
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/level').default,
    require('./mixins/info-mode').default,
    require('./mixins/context').default
  ],

  props: {
    assocDef: dm5.AssocDef    // undefined for top-level object
  },

  computed: {

    type () {
      return this.object.getType()
    },

    isSimple () {
      return this.type.isSimple()
    },

    simpleLabel () {
      const customAssocType = this.assocDef && this.assocDef.getCustomAssocType()
      return customAssocType && customAssocType.isSimple() ? customAssocType.value : this.type.value
    },

    simpleComp () {
      const widget = this.assocDef && this.assocDef._getViewConfig('dmx.webclient.widget')
      // Note: since Vue 2.5.10 dot is no longer a valid character in a component name
      return widget && widget.uri.replace(/\./g, '-') || `dm5-${this.type.dataTypeUri.substr('dmx.core.'.length)}-field`
    },

    isHtmlField () {
      return this.simpleComp === 'dm5-html-field'
    },

    mode () {
      return this.context.mode
    },

    localMode () {
      return this.inlineEdit ? 'form' : this.mode
    },

    inlineEdit () {
      // console.log('inlineEdit', this.context.inlineId, this._uid)
      return this.context.inlineId === this._uid  // FIXME: _uid is Vue internal
    },

    writable () {
      return this.context.writable
    },

    assocDefs () {
      return this.type.assocDefs
    }
  },

  methods: {

    // inline editing

    editInline () {
      // inline editing can only be started in info mode
      if (this.infoMode && this.writable) {
        // inline editing is only supported for simple objects
        if (this.isSimple) {
          // console.log('editInline', this.object.typeUri, this.object.value)
          this.context.setInlineId(this._uid)   // FIXME: _uid is Vue internal
        } else {
          console.log('non-simple', this.object.typeUri, this.object.value)
        }
      }
    },

    submitInline () {
      this.context.setInlineId(undefined)
    },

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
    'dm5-child-topic':      require('./dm5-child-topic').default,       // TODO: change prefix to "dmx"
    // simple default components
    'dm5-text-field':       require('./dm5-text-field').default,        // TODO: change prefix to "dmx"
    'dm5-number-field':     require('./dm5-number-field').default,      // TODO: change prefix to "dmx"
    'dm5-boolean-field':    require('./dm5-boolean-field').default,     // TODO: change prefix to "dmx"
    'dm5-html-field':       require('./dm5-html-field').default,        // TODO: change prefix to "dmx"
    // simple widgets
    'dmx-webclient-select': require('./dm5-webclient-select').default
  }
}
</script>

<style>
/* To be hoverable the *direct* parent dm5-object must be in info mode.      */
/* Otherwise an object already in inline edit mode would still be hoverable. */
.dm5-object.info.writable > .field:hover {
  background-color: white;
}

.dm5-object .field .field-content.no-html {
  display: flex;
  align-items: center;
}

.dm5-object .field .field-content.no-html .save-button {
  margin-left: 0.4em;
}

.dm5-object .field .field-content.html .save-button {
  margin-top: 0.4em;
}

.dm5-object .add-button {
  font-size: var(--label-font-size) !important;
  padding: 3px;
  position: absolute;
  right: 0;
}
</style>
