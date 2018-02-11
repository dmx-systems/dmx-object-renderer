<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-input v-else v-model="object.value"></el-input>
</template>

<script>
export default {
  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ]
}
</script>
