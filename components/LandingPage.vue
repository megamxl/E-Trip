<template>
  <div class="background">
    <div class="left d-flex flex-column justify-space-around pillar">
      <v-container>
        <h1 class="mb-8"> Create your own profile to get the most out of E-Trip </h1>
        <v-btn block x-large to="/auth/login" outlined rounded> Sign Up / Login</v-btn>
      </v-container>
    </div>
    <div class="left d-flex flex-column justify-space-around">
      <v-container>
        <img id="logo" src="../static/LogoVNew.svg" alt="Logo E-Trip"/>
      </v-container>
    </div>
    <div class="right d-flex flex-column justify-space-around pillar">
      <v-container class="landingContainer rounded-lg">
        <h1 class="mb-8"> Look for an optimal route now </h1>
        <v-text-field outlined label="From" v-model="fromField" ></v-text-field>
        <v-text-field outlined label="To" v-model="toField" append-icon="mdi-magnify" @click:append="forwardSearch"></v-text-field>
      </v-container>
    </div>
  </div>

</template>

<script>

export default {
  data() {
    return {
      toField: '',
      fromField: ''
    }
  },
  methods: {
    forwardSearch () {
      this.$store.commit('SET_TO_FROM', [this.toField, this.fromField]);
      this.$router.push("/RoutePage");
    },
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
  background: rgba(25, 25, 25, 1);
}

#logo {
  height: 500px;
  margin-left: 3rem;
  margin-top: -7rem;
}

</style>
