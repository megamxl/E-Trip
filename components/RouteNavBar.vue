<template>
  <v-card class="overflow-hidden">
    <v-app-bar>
      <v-btn @click="toLanding"> E-Trip </v-btn>
      <v-spacer />
      <v-autocomplete :items="cars" outlined class="col mt-7"
        label="Choose your car"
      />
      <v-spacer />
      <v-btn id="profile_" @click="toProfile"> Profile
        <v-icon> mdi-account </v-icon> </v-btn>
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
  #profile_ {
    color: #fff;
  }
</style>
