<template>
  <div class="dm5-webclient-iconpicker" v-if="infoMode">{{object.value}}</div>
  <div class="dm5-webclient-iconpicker" v-else>{{object.value}}</div>
</template>

<script>
export default {

  mixins: [
    require('./mixins/object').default,       // object to render
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  data () {
    return {
    }
  },

  computed: {
  },

  methods: {
  }
}
</script>

<style>
.dm5-webclient-iconpicker {
  font-family: FontAwesome;
  font-size: 24px;
  color: var(--color-topic-icon);
}
</style>
