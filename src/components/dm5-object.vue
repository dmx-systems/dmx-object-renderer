<template>
  <div :class="['dm5-object', localMode, {writable}]" @click.stop="editInline">
    <h3 v-if="isToplevel && !noHeading">{{object.value}}</h3>
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{fieldLabel}}</div>
      <div :class="['field-content', isHtmlField ? 'html' : 'no-html']">
        <component :is="simpleRenderer" :object="object" :mode="localMode" :assoc-def="assocDef" :context="context">
        </component>
        <el-button class="save-button" v-if="inlineEdit" @click.stop="submitInline">Save</el-button>
      </div>
    </div>
    <!-- composite -->
    <component v-else :is="compositeRenderer" :object="object" :level="level" :context="context"></component>
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
    assocDef: dm5.AssocDef,     // undefined for top-level object
    noHeading: Boolean
  },

  computed: {

    isToplevel () {
      return this.level === 0
    },

    type () {
      return this.object.getType()
    },

    isSimple () {
      return this.type.isSimple()
    },

    fieldLabel () {
      const customAssocType = this.assocDef && this.assocDef.getCustomAssocType()
      return customAssocType && customAssocType.isSimple() ? customAssocType.value : this.type.value
    },

    simpleRenderer () {
      // 1) custom renderer
      if (this.detailRenderer) {
        return this.detailRenderer
      }
      // 2) custom widget
      const widget = this.assocDef && this.assocDef._getViewConfig('dmx.webclient.widget')
      if (widget) {
        // Note: since Vue 2.5.10 dot is no longer a valid character in a component name
        return widget.uri.replace(/\./g, '-')
      }
      // 3) standard renderer
      return `dm5-${this.type.dataTypeUri.substr('dmx.core.'.length)}-field`
    },

    compositeRenderer () {
      // 1) custom renderer
      if (this.detailRenderer) {
        return this.detailRenderer
      }
      // 2) standard renderer
      return 'dm5-child-topics'
    },

    detailRenderer () {
      const detailRenderers = this.context.renderers.detail
      return detailRenderers && detailRenderers[this.object.typeUri]
    },

    isHtmlField () {
      return this.simpleRenderer === 'dm5-html-field'
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
    }
  },

  methods: {

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
    }
  },

  components: {
    'dm5-child-topics':     require('./dm5-child-topics').default,      // TODO: change prefix to "dmx"
    // simple default widgets
    // (component name is computed from data type URI)
    'dm5-text-field':       require('./dm5-text-field').default,        // TODO: change prefix to "dmx"
    'dm5-number-field':     require('./dm5-number-field').default,      // TODO: change prefix to "dmx"
    'dm5-boolean-field':    require('./dm5-boolean-field').default,     // TODO: change prefix to "dmx"
    'dm5-html-field':       require('./dm5-html-field').default,        // TODO: change prefix to "dmx"
    // simple custom widgets
    // (component name is computed from view config Widget topic URI)
    'dmx-webclient-select': require('./dm5-select-field').default
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
</style>
