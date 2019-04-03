<template>
  <div v-if="infoMode">{{displayValue}}</div>
  <el-select v-else v-model="selection" :clearable="clearable" :filterable="customizable" :allow-create="customizable"
      placeholder="">
    <el-option v-for="topic in sortedOptions" :label="topic.value" :value="topic.id" :key="topic.id"></el-option>
  </el-select>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/object').default,       // object to render
    require('./mixins/assoc-def').default,    // assoc def leading to object
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  data () {
    // console.log('data', this._uid, this.mode, this.selection, typeof this.selection)
    return {
      // Buffered object value to be displayed in info mode.
      // With inline editing the object is sent to the server in info mode.
      // The update request must contain the refs, but the refs must not be displayed.
      // The original object value is overridden with a ref (see syncObjectValue()).
      displayValue: this.object.value,
      // Select model
      // ID of option topic, or text entered (if <el-select> is customizable).
      // Note: since Element UI 2.7.1 a <el-select> represents "no selection" by null value (instead '').
      // https://github.com/ElemeFE/element/issues/14322
      selection: this.object.id === -1 ? null : this.object.id,
      // Option topics (object, mapped by topic ID), fetched asynchronously
      options: undefined
    }
  },

  computed: {

    sortedOptions () {
      return this.options && Object.values(this.options).sort(
        (t1, t2) => t1.value.localeCompare(t2.value)    // FIXME: number/boolean fields?
      )
    },

    clearable () {
      return this.assocDef.getViewConfig('dmx.webclient.clearable')
    },

    customizable () {
      return this.assocDef.getViewConfig('dmx.webclient.customizable')
    }
  },

  // In form mode a) the option topics must be loaded, and b) the object value must be synced.
  // 2 cases:
  //   1) This component is created in info mode. When switched to form mode (global edit or inline edit)
  //      the mode watcher fires.
  //   2) This component is created in form mode (global edit).
  //      The mode watcher does *not* fire.
  // So we must call loadOptions() and syncObjectValue() in both places, the created() hook and the mode watcher.
  created () {
    // console.log('created', this._uid, this.mode, this.selection, typeof this.selection)
    if (this.formMode) {
      this.loadOptions()
      this.syncObjectValue()
    }
  },

  watch: {

    mode () {
      // console.log('mode', this._uid, this.mode, this.selection, typeof this.selection)
      if (this.formMode) {
        this.loadOptions()
        this.syncObjectValue()
      }
    },

    selection () {
      // console.log('selection', this._uid, this.mode, this.selection, typeof this.selection)
      this.syncObjectValue()
      this.syncDisplayValue()
    }
  },

  methods: {

    loadOptions () {
      if (!this.options) {
        dm5.restClient.getTopicsByType(this.object.typeUri).then(topics => {
          this.options = dm5.utils.mapById(topics)
        })
      }
    },

    /**
     * Syncs object value to selection.
     */
    syncObjectValue () {
      this.checkSelection()
      if (typeof this.selection === 'number') {
        // Case 1: existing option selected
        this.object.value = `ref_id:${this.selection}`
      } else {
        // Case 2: custom value entered (selection is of type string) or cleared (selection is null)
        // Note: a serialized object as sent to the server must not contain JSON null, but ''
        this.object.value = this.selection || ''
        // Note: custom values get no URI. An existing URI must be reset.
        // Otherwise an URI clash might occur at server side while creating the custom topic.
        this.object.uri = ''
      }
    },

    /**
     * Syncs display value to selection.
     */
    syncDisplayValue () {
      this.checkSelection()
      if (typeof this.selection === 'number') {
        // Case 1: existing option selected
        this.displayValue = this.options[this.selection].value
      } else {
        // Case 2: custom value entered (selection is of type string) or cleared (selection is null)
        this.displayValue = this.selection || ''
      }
    },

    // sanity check
    checkSelection () {
      // Note: since Element UI 2.7.1 a cleared <el-select> has null value (instead '')
      // https://github.com/ElemeFE/element/issues/14322
      if (this.selection !== null && !['number', 'string'].includes(typeof this.selection)) {
        throw Error(`unexpected selection: ${this.selection} ${typeof this.selection}`)
      }
    }
  }
}
</script>
