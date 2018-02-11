<template>
  <div v-if="infoMode">{{displayValue}}</div>
  <el-select v-else v-model="selection" :clearable="clearable" :filterable="customizable" :allow-create="customizable"
      placeholder="">
    <el-option v-for="topic in options" :label="topic.value" :value="topic.id" :key="topic.id"></el-option>
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
      // The original object value is overridden with a ref (see updateValue()).
      displayValue: this.object.value,
      // Select model
      // Apparently in <el-select> an empty string represents "no selection"
      selection: this.object.id === -1 ? '' : this.object.id,
      // Option topics (object, mapped by topic ID)
      options: undefined
    }
  },

  computed: {

    clearable () {
      return this.assocDef.getViewConfig('dm4.webclient.clearable')
    },

    customizable () {
      return this.assocDef.getViewConfig('dm4.webclient.customizable')
    }
  },

  // In form mode the option topics must be present.
  // As a optimization measure they are retrieved *only* in form mode.
  // 2 cases:
  // 1) The component is created in info mode if an object is available.
  //    When switched to form mode (global edit or inline edit) the mode watcher fires.
  // 2) The component is created only in form mode (global edit) if *no* object is available yet.
  //    The mode watcher does *not* fire.
  // We call loadOptions() in both places, the created() hook and the mode watcher.
  created () {
    // console.log('created', this._uid, this.mode, this.selection, typeof this.selection)
    this.loadOptions()
    this.updateValue()
  },

  watch: {

    mode () {
      // console.log('mode', this._uid, this.mode, this.selection, typeof this.selection)
      this.loadOptions()
    },

    selection () {
      // console.log('selection', this._uid, this.mode, this.selection, typeof this.selection)
      this.updateValue()
      this.updateDisplayValue()
    }
  },

  methods: {

    loadOptions () {
      if (this.formMode && !this.options) {
        dm5.restClient.getTopicsByType(this.object.typeUri).then(topics => {
          this.options = dm5.utils.mapById(topics)
        })
      }
    },

    updateValue () {
      // sanity check
      if (!['number', 'string'].includes(typeof this.selection)) {
        throw Error(`Unexpected selection: ${this.selection} ${typeof this.selection}`)
      }
      // Note: a custom value entered in a allow-create <el-select> is a string
      if (typeof this.selection == 'number') {
        this.object.value = `ref_id:${this.selection}`
      } else {
        this.object.value = this.selection
        // Note: newly entered custom values get no URI. An existing URI must be reset.
        // Otherwise an URI clash might occur at server side while creating the custom topic.
        this.object.uri = ''
      }
    },

    updateDisplayValue () {
      // sanity check
      if (!['number', 'string'].includes(typeof this.selection)) {
        throw Error(`Unexpected selection: ${this.selection} ${typeof this.selection}`)
      }
      // Note: a custom value entered in a allow-create <el-select> is a string
      if (typeof this.selection == 'number') {
        this.displayValue = this.options[this.selection].value
      } else {
        this.displayValue = this.selection
      }
    }
  }
}
</script>
