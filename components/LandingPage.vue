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

      <v-container class="landingContainer rounded-lg d-flex flex-column">
        <h1 class="mb-8"> Look for an optimal route now </h1>

        <h2> From: </h2>
        <div id="geocoderFrom" v-model="fromField"></div>
        <pre id="resultFrom"></pre>

        <br>

        <h2> To: </h2>
        <div id="geocoderTo" v-model="toField"></div>
        <pre id="resultTo"></pre>

        <br>

        <v-btn class="mt-4" @click="forwardSearch"> Plan your route <v-icon right>mdi-magnify</v-icon> </v-btn>
        <!-- <v-text-field outlined label="From" v-model="fromField" ></v-text-field> -->
        <!-- <v-text-field outlined label="To" v-model="toField" append-icon="mdi-magnify" @click:append="forwardSearch"></v-text-field> -->
      </v-container>
    </div>
  </div>

</template>

<script>

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzbWVpZXIiLCJhIjoiY2wxZXF3Nnl5MGxyZjNibG53dWp5bmFkcCJ9.wGzMNfIT8zp8FcO-YfpzYQ';

export default {

  data() {
    return {
      toField: '',
      fromField: ''
    }
  },
  methods: {
    forwardSearch() {
      this.$store.commit('SET_TO_FROM', {to: this.toField, from: this.fromField});
      this.$router.push("/RoutePage");
    },

    createSearchFields() {
      const geocoderTo = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'address'
      });

      geocoderTo.addTo('#geocoderTo');
      const resultsTo = document.getElementById('#resultTo');
      geocoderTo.on('result', (e) => {
        this.toField = { coords: e.result.center, name: e.result.place_name };
        resultsTo.innerText = JSON.stringify(e.result, null, 2);
      });

      geocoderTo.on('clear', () => {
        resultsTo.innerText = '';
      })

      /* ----------------------------------------------------------------------------------- */

      const geocoderFrom = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'address'
      });

      geocoderFrom.addTo('#geocoderFrom');
      const resultsFrom = document.getElementById('#resultFrom');
      geocoderFrom.on('result', (e) => {
        this.fromField = { coords: e.result.center, name: e.result.place_name};
        resultsFrom.innerText = JSON.stringify(e.result, null, 2);
      });

      geocoderFrom.on('clear', () => {
        resultsFrom.innerText = '';
      })


    }
  },
  mounted() {
    this.createSearchFields();
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
