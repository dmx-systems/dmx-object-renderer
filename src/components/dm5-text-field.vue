<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-input v-else v-model="object.value"></el-input>
</template>

<script>
export default {
  // Note: simple components support inline editing.
  // They get the "mode" property from parent component (not from store).
  // That's why simple components mix in "mode-prop" (not "mode").
  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode-prop').default,
    require('./mixins/info-mode').default
  ]
}
</script>
