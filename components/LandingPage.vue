<template>
  <div class="background">
    <div class="left d-flex flex-column justify-space-around pillar">
      <v-container class="landingContainer rounded-lg">
        <h1> Create your own profile to get the most out of E-Trip </h1>
        <v-btn block x-large to="#" outlined rounded> Sign Up / Login </v-btn>
      </v-container>
    </div>
    <div class="right d-flex flex-column justify-space-around pillar">
      <v-container class="landingContainer rounded-lg">
        <v-card-title> Look for an optimal route now </v-card-title>
        <v-text-field outlined label="From"> </v-text-field>
        <v-container class="d-flex">
          <v-text-field outlined label="To"> </v-text-field>
          <v-btn > > </v-btn>
        </v-container>
      </v-container>
    </div>
  </div>

</template>

<script>

import ProfileCreation from "@/components/ProfileCreation";
export default {
  components: {
    ProfileCreation
  },
  name: "LandingPage"
}
</script>

<style scoped>

.background {
  width: 100%;
  height: 100vh;
  background: url("assets/tesla.jpg") no-repeat top center fixed;
  background-size: cover;
}

.left {
  float: left;
}

.right {
  float: right;
}

.pillar {
  width: 30vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
}

.landingContainer {
  background: rgba(25, 25,25, 1);
}


</style>
