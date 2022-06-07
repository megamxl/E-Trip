<template>
  <div class="d-flex justify-space-between align-center ml-4 mr-4 mt-4 mb-4">
    <small> {{textLeft}} </small>
    <small class="font-weight-bold"> {{textRight}} </small>
  </div>
</template>

<script>
export default {
  name: "Space-Around-Text",
  props: {
    textLeft: {
      type: String,
      default: ""
    },
    textRight: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped>

</style>
