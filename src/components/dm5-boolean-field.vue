<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-checkbox v-else v-model="object.value"></el-checkbox>
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
