<template>
  <v-card class="overflow-hidden">
    <v-app-bar>
      <v-btn @click="toLanding"> E-Trip </v-btn>
      <v-spacer />
    </v-app-bar>
  </v-card>
</template>

<script>
export default {
  name: "BasicNavBarLanding",
  methods: {
    toLanding() {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>

</style>
