<template>
  <div :class="['dm5-value-renderer', localMode, {editable}]" v-if="show">
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{fieldLabel}}</div>
      <div :class="['field-content', isHtmlField ? 'html' : 'no-html']">
        <component :is="simpleRenderer" :object="object" :mode="localMode" :comp-def="compDef" :context="context"
          @keyup.native.enter="enter">
        </component>
        <!-- Save Button -->
        <el-button class="save-button" v-if="inlineEdit" @click.stop="submitInline">Save</el-button>
      </div>
      <!-- Edit Button -->
      <el-button class="edit fa fa-pencil" v-if="inlineEnabled" type="text" @click="editInline"></el-button>
    </div>
    <!-- composite -->
    <template v-else>
      <div class="heading" v-if="showHeading">{{object.value}}</div>
      <component :is="compositeRenderer" :object="object" :level="level" :path="path" :comp-def="compDef"
        :context="context">
      </component>
    </template>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-value-renderer created', this.object)
  },

  updated () {
    // console.log('dm5-value-renderer updated', this.object.id)
    this.context.updated()
  },

  destroyed () {
    // console.log('dm5-value-renderer destroyed', this.object.id)
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/level').default,
    require('./mixins/path').default,
    require('./mixins/context').default
  ],

  props: {
    compDef: dm5.CompDef,     // undefined for top-level object
    noHeading: Boolean
  },

  computed: {

    show () {
      // For an empty valued assoc the dm5-value-renderer must not render anything. 2 reasons:
      // 1) In the assoc details (when an assoc is selected) a label without value would be rendered.
      // 2) In a composite value rendering an empty valued relating assoc would create unwanted vertical space.
      //
      // Note: a simple topic never has an empty value, a simple assoc however *can* have an empty value.
      // A composite topic/assoc *can* have an empty value (= label) while non-empty child values are still present.
      // Think e.g. of a Person topic with emptied name fields. It still must be rendered, at least at top-level.
      // FIXME: a non-top-level composite topic/assoc which has an empty value (= label) while non-empty child values
      // are still present are *not* rendered, but possibly should.
      //
      // The empty value check can't test for children existence (!dm5.utils.isEmpty(this.object.assoc.children))
      // as empty valued children added by "filling" stay in the object after editing.
      //
      // Note: in form mode empty values must always be rendered to let the user input a value. Note also that
      // "local form mode" is more specific than (global) "form mode" so the latter must not be checked.
      //
      return !this.isEmpty || this.isToplevel && this.object.isTopic() || this.localFormMode
    },

    showHeading () {
      return !this.isEmpty && this.isToplevel && !this.noHeading
    },

    isToplevel () {
      return this.level === 0
    },

    type () {
      return this.object.type
    },

    isSimple () {
      return this.type.isSimple()
    },

    isEmpty () {
      return this.object.value === ''
    },

    fieldLabel () {
      const type = this.compDef && this.compDef.getCustomAssocType()
      let label = type && type.isSimple() ? type.value : this.type.value
      if (this.path.length) {
        label += ` (${this.path.join(' / ')})`
      }
      return label
    },

    simpleRenderer () {
      // 1) custom renderer
      if (this.valueRenderer) {
        return this.valueRenderer
      }
      // 2) custom widget
      const widget = this.compDef && this.compDef._getViewConfig('dmx.webclient.widget')
      if (widget) {
        // Note: since Vue 2.5.10 dot is no longer a valid character in a component name
        return widget.uri.replace(/\./g, '-')
      }
      // 3) standard renderer
      return `dm5-${this.type.dataTypeUri.substr('dmx.core.'.length)}-field`
    },

    compositeRenderer () {
      // 1) custom renderer
      if (this.valueRenderer) {
        return this.valueRenderer
      }
      // 2) standard renderer
      return 'dm5-child-topics'
    },

    valueRenderer () {
      const valueRenderers = this.context.renderers.value
      return valueRenderers && valueRenderers[this.object.typeUri]
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

    localInfoMode () {
      return this.localMode === 'info'
    },

    localFormMode () {
      return this.localMode === 'form'
    },

    inlineEnabled () {
      // inline editing can only be started in info mode
      return this.localInfoMode && this.editable
    },

    inlineEdit () {
      // console.log('inlineEdit', this.context.inlineId, this._uid)
      return this.context.inlineId === this._uid  // FIXME: _uid is Vue internal
    },

    editable () {
      return this.context.editable
    }
  },

  methods: {

    editInline () {
      this.context.setInlineId(this._uid)     // FIXME: _uid is Vue internal
    },

    enter () {
      if (this.inlineEdit && !this.isHtmlField) {
        this.submitInline()
      }
    },

    submitInline () {
      this.context.setInlineId()
    }
  },

  // Note: these components are registered by Webclient already but dm5-object-renderer is a standalone component
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
.dm5-value-renderer {
  position: relative;     /* absolute positioned "+" buttons scroll along */
}

.dm5-value-renderer .heading {
  font-size: var(--heading-font-size);
  font-weight: bold;
  margin-bottom: var(--heading-spacing);
}

/* To be hoverable the *direct* parent dm5-value-renderer must be in info mode. */
/* Otherwise an object already in inline edit mode would still be hoverable.    */
.dm5-value-renderer.info.editable > .field:hover {
  background-color: white;
}

.dm5-value-renderer .field .field-content .el-autocomplete,
.dm5-value-renderer .field .field-content .el-select {
  width: 100%;
}

.dm5-value-renderer .field .field-content.no-html {
  display: flex;
  align-items: center;
}

.dm5-value-renderer .field .field-content.no-html .save-button {
  margin-left: 0.4em;
}

.dm5-value-renderer .field .field-content.html .save-button {
  margin-top: 0.4em;
}

/* Edit Button */

.dm5-value-renderer button.edit {
  position: absolute;
  bottom: 0;
  right: -12px;
  visibility: hidden;
  padding: 0 !important;
}

.dm5-value-renderer > .field:hover button.edit {
  visibility: visible;
}
</style>
