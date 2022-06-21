<!-- A basic navigation bar that only has one button that brings you back to the landingPage -->
<template>

  <!--Basic Navbar consists of only back to LandingPage Button + toLanding mehtod() -->
  <v-card class="overflow-hidden">
    <v-app-bar>
      <v-btn outlined @click="toLanding"> E-Trip </v-btn> <!-- Calls to landing -->
      <v-spacer />
    </v-app-bar>
  </v-card>
</template>

<script>
export default {
  name: "BasicNavBarLanding",
  methods: {
    /**
     * Uses VueRouter to send the user back to index.vue
     */
    toLanding() {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>
/*When a <style> tag has the scoped attribute, its CSS will apply to elements of the current component only. */
</style>
