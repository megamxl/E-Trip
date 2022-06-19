<template>

  <v-app :height="height">
    <v-app-bar>
      <v-content>
        <BasicNavBarLanding/>
      </v-content>
      <v-btn id="profile_" @click="toProfile"> Profile
        <v-icon> mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="background">

      <v-container fill-height fluid justify-center>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="6" lg="6" xl="4" align="center" width="700">
            <v-card id="cardArea" outlined dark fill-height>
              <v-card-title class="justify-center">
                <h3 id="h3_"> Look for a new optimal route now </h3>
              </v-card-title>

              <h4 class="
            text-sm-h7
            text-md-h6"> From: </h4>
              <div id="geocoderFrom" v-model="fromField"></div>
              <pre id="resultFrom"></pre>

              <br>

              <h4 class="
            text-sm-h7
            text-md-h6"> To: </h4>
              <div id="geocoderTo" v-model="toField"></div>
              <pre id="resultTo"></pre>

              <br>

              <v-btn :disabled="buttonDisable" class="mt-6 d-sm-flex text-sm-body-2 text-xl-body-1"
                     @click="forwardSearch" block x-large outlined rounded> Plan your route
                <v-icon right>mdi-magnify</v-icon>
              </v-btn>
              <!-- <v-text-field outlined label="From" v-model="fromField" ></v-text-field> -->
              <!-- <v-text-field outlined label="To" v-model="toField" append-icon="mdi-magnify" @click:append="forwardSearch"></v-text-field> -->

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

  </v-app>
</template>

<script>

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";


mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzbWVpZXIiLCJhIjoiY2wxZXF3Nnl5MGxyZjNibG53dWp5bmFkcCJ9.wGzMNfIT8zp8FcO-YfpzYQ';

export default {

  computed: {
    buttonDisable() {
      const toCoords = this.toField.coords;
      const fromCoords = this.fromField.coords;
      try {
        toCoords.length;
        fromCoords.length;
        return false;
      } catch (e) {
        return true
      }
    }
  },
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
        this.toField = {coords: e.result.center, name: e.result.place_name};
        resultsTo.innerText = JSON.stringify(e.result, null, 2);
      });

      geocoderTo.on('clear', () => {
        this.toField.coords = null;
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
        this.fromField = {coords: e.result.center, name: e.result.place_name};
        resultsFrom.innerText = JSON.stringify(e.result, null, 2);
      });

      geocoderFrom.on('clear', () => {
        this.fromField.coords = null;
        resultsFrom.innerText = '';
      })


    },
    //responsive - breakpoints
    height () {
      switch (this.$vuetify.breakpoint.name) {
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
      }
    },

    //responsive
    onResize () {
      this.isMobile = window.innerWidth < 600
    },
  },
  //responsive
  beforeDestroy () {
    if (typeof window === 'undefined') return

    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  mounted() {
    this.createSearchFields();

    this.onResize()

    window.addEventListener('resize', this.onResize, { passive: true })
  },
  name: "LandingPage"
}
</script>

<style scoped>

@import "../style/mapbox-geocoder.css";

.background {
  width: 100%;
  height: 100vh;
  background: url("assets/car.jpg") no-repeat top center fixed;
  background-size: cover;

}

#cardArea {
  padding: 3rem 2rem 3rem ;
  border-radius: 20px;
  background: rgb( 0, 0, 0, 0.8);
}

h4 {
  margin-bottom: 10px;
}

#h3_ {
  font-weight: unset;
  font-size: x-large;
  margin-bottom: 2rem;
}
</style>
