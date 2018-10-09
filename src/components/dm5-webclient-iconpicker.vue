<template>
  <div class="dm5-webclient-iconpicker">
    <div v-if="infoMode" class="icon">{{object.value}}</div>
    <div v-else>
      <el-button @click="open" class="icon">{{object.value}}</el-button>
      <el-dialog :visible.sync="visible" :modal="false" :append-to-body="true">
        <fa-search @icon-select="select"></fa-search>
      </el-dialog>
    </div>
  </div>
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
      visible: false      // dialog visibility
    }
  },

  methods: {

    open () {
      this.visible = true
    },

    close () {
      this.visible = false
    },

    select (icon) {
      console.log('select', icon.id, icon.unicode)
      this.object.value = String.fromCharCode(parseInt(icon.unicode, 16))
      this.close()
    }
  },

  components: {
    'fa-search': require('vue-font-awesome-search').default
  }
}
</script>

<style>
.dm5-webclient-iconpicker .icon {
  font-family: FontAwesome;
  font-size: 24px !important;
  color: var(--color-topic-icon);
}
</style>
