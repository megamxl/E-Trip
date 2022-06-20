<!-- Helping component to fill ProfilePage with pre-formatted text -->
<template>
  <div class="d-flex align-center ml-4 mb-4">
    <h3 class="mr-6 fat"> {{textLeft}} </h3>
    <h3 class="align-self-end"> {{textRight}} </h3>
  </div>
</template>

<script>
export default {
  name: "ProfilePageDataComponent",
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

h3 {
  margin-bottom: 0;
  font-weight: normal;
}

.fat {
  font-weight: bold;
}

</style>
