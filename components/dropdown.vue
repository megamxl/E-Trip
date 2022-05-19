<template>
  <v-autocomplete :items="items" utlined class="col mt-7"
                  :label="display"/>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    items: {
      type: Array,
      required: true
    },
    display: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
