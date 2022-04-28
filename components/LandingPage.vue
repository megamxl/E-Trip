<template>
  <div class="background">
    <div class="left flex pillar">
      <h1> Create your own profile to get the most out of E-Trip </h1>
      <v-btn to="#" outlined rounded> Sign Up / Login </v-btn>
    </div>
    <div class="right flex pillar">
      <v-card>
        <v-card-title> Look for an optimal route now </v-card-title>
        <v-text-field outlined label="From"> </v-text-field>
        <v-text-field outlined label="To"> </v-text-field>
      </v-card>
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
  background: rgba(0,0,0,0.7);
}

.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


</style>
