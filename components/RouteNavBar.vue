<template>
  <v-card class="overflow-hidden">
    <v-app-bar>
      <v-app-bar-title> E-Trip </v-app-bar-title>
      <v-spacer />
      <v-autocomplete outlined class="col mt-7"
        label="Choose your car"
      />
      <v-spacer />
      <h2> Profile </h2>
      <v-btn fab small class="ml-4" @click="toProfile"> <v-icon> mdi-account </v-icon> </v-btn>
    </v-app-bar>
  </v-card>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    toProfile() {
      this.$router.push("/ProfilePage");
    }
  }
}
</script>

<style scoped>

</style>
