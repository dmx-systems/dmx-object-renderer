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
    query () {
      return dm5.utils.fulltextQuery(this.object.value, true)     // allowSingleLetterSearch=true
    }
  },

  methods: {
    fetchSuggestions (value, cb) {
      // console.log('fetchSuggestions', value)
      // Note: for an empty value fetchSuggestions() is not invoked
      // Note: fetchSuggestions() is already debounced by Element UI
      // compare to dm5-search-widget.vue (module dm5-search-widget)
      // console.log('query', this.query)
      if (this.query) {
        dm5.restClient.queryTopicsFulltext(this.query, this.object.typeUri).then(result => {
          if (result.query === this.query) {
            cb(result.topics)
          } else {
            console.log(`Ignoring ${result.topics.length} result topics of query "${result.query}"` +
              ` (current query is "${this.query}")`)
          }
        }).catch(e => {
          console.warn(`Query "${this.query}" failed`)
          cb([])
        })
      } else {
        cb([])
      }
    }
  }
}
</script>
