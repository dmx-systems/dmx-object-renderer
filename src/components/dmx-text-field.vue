<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-autocomplete v-else v-model="object.value" :fetch-suggestions="fetchSuggestions" :trigger-on-focus="false">
  </el-autocomplete>
</template>

<script>
import dmx from 'dmx-api'

export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  computed: {
    query () {
      return dmx.utils.fulltextQuery(this.object.value, true)     // allowSingleLetterSearch=true
    }
  },

  methods: {
    fetchSuggestions (value, cb) {
      // console.log('fetchSuggestions', value)
      // Note: for an empty value fetchSuggestions() is not invoked
      // Note: fetchSuggestions() is already debounced by Element UI
      // compare to dmx-search-widget.vue (module dmx-search-widget)
      // console.log('query', this.query)
      if (this.query) {
        dmx.rpc.queryTopicsFulltext(this.query, this.object.typeUri).then(result => {
          if (result.query === this.query) {
            cb(result.topics)
          } /* else {
            console.log(`Ignoring ${result.topics.length} result topics of query "${result.query}"` +
              ` (current query is "${this.query}")`)
          } */
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
