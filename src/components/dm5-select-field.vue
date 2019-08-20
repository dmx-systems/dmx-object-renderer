<template>
  <div v-if="infoMode">{{object.value}}</div>
  <!--
    Note: since Element UI 2.7.1 an el-select represents "no selection" by null value (instead '').
    Since Element UI 2.9.0 this change is reverted; "no selection" is represented by '' again.
    https://github.com/ElemeFE/element/issues/14322
    So for the selection model we can directly use the object value; no conversion required. Furthermore we
    don't need any by-ID refs in the update request but can solely rely on the server's value integration.
  -->
  <el-select v-else v-model="object.value" :clearable="clearable" :allow-create="customizable"
      :filterable="customizable" placeholder="" default-first-option @change="change">
    <el-option v-for="topic in sortedOptions" :label="topic.value" :value="topic.value" :key="topic.id">
    </el-option>
  </el-select>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/object').default,       // object to render
    require('./mixins/comp-def').default,     // comp def leading to object
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  data () {
    return {
      // Option topics (object, mapped by topic ID), fetched asynchronously
      options: undefined
    }
  },

  computed: {

    sortedOptions () {
      return this.options && Object.values(this.options).sort(
        (t1, t2) => t1.value.localeCompare ?
          t1.value.localeCompare(t2.value) :
          t1.value < t2.value ? -1 : t1.value === t2.value ? 0 : 1
      )
    },

    clearable () {
      return this.compDef.getViewConfig('dmx.webclient.clearable')
    },

    customizable () {
      return this.compDef.getViewConfig('dmx.webclient.customizable')
    }
  },

  // In form mode the option topics must be loaded.
  // 2 cases:
  //   1) This component is created in info mode. When switched to form mode (global edit or inline edit)
  //      the mode watcher fires.
  //   2) This component is created in form mode (global edit).
  //      The mode watcher does *not* fire.
  // So we must call loadOptions() in both places, the created() hook and the mode watcher.
  created () {
    this.loadOptions()
  },

  watch: {
    mode () {
      this.loadOptions()
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

    change () {
      // Note: custom values get no URI. An existing URI must be reset.
      // Otherwise an URI clash might occur at server side while creating the custom topic.
      this.object.uri = ''
    }
  }
}
</script>
