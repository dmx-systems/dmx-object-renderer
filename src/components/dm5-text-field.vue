<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-autocomplete v-else v-model="object.value" :fetch-suggestions="fetchSuggestions" :trigger-on-focus="false">
  </el-autocomplete>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  computed: {
    searchQuery () {
      return this.object.value + '*'    // TODO: copy in dm5-search-widget
    }
  },

  methods: {
    fetchSuggestions (value, cb) {
      // console.log('fetchSuggestions', value)
      // Note: for an empty value fetchSuggestions() is not invoked
      dm5.restClient.searchTopics(this.searchQuery, this.object.typeUri).then(topics => {
        cb(topics)
      })
    }
  }
}
</script>
