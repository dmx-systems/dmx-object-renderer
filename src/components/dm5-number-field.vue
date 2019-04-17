<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-input v-else v-model="value" type="number"></el-input>
</template>

<script>
export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  computed: {
    value: {
      get () {
        return this.object.value
      },
      set (value) {
        let val
        if (value === '') {
          val = ''
        } else {
          val = Number(value)
        }
        this.object.value = val
      }
    }
  }
}
</script>
