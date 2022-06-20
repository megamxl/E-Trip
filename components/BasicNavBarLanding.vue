<template>

  <!--Basic Navbar consists of only back to LandingPage Button + toLanding mehtod() -->
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
/*When a <style> tag has the scoped attribute, its CSS will apply to elements of the current component only. */
</style>
