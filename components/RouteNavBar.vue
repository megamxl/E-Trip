<template>
  <v-card class="overflow-hidden">
    <v-app-bar>
      <v-btn @click="toLanding"> E-Trip </v-btn>
      <v-spacer />
      <v-autocomplete :items="cars" outlined class="col mt-7"
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
  props: {
    cars: {
      type: Array,
      required: true
    }
  },
  methods: {
    toProfile() {
      this.$router.push("/ProfilePage");
    },
    toLanding() {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>

</style>
