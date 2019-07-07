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
      // Note: fetchSuggestions() is already debounced by Element UI
      dm5.restClient.queryTopicsFulltext(this.searchQuery, this.object.typeUri).then(topics => {
        cb(topics)
      })
    }

    /* enter (e) {
      // ### TODO: submit only on "enter", not on "select"
      const item = document.querySelector('ul.el-autocomplete-suggestion__list > li')  // > li.highlighted
      console.log('enter', e, item)
    } */
  }
}
</script>
