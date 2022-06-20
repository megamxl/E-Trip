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
          <v-col cols="12" sm="10" md="8" lg="6" xl="4" width="700">
            <v-card id="cardArea" outlined dark fill-height>
              <v-card-title class="justify-start">
                <h3 id="h3_"> Look for a new optimal route now </h3>
              </v-card-title>

              <h3> From: </h3>
              <div id="geocoderFrom" v-model="fromField"></div>
              <pre id="resultFrom"></pre>

              <br>

              <h3> To: </h3>
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

  /**
   * computed property just reacts of input during runtime
   * https://vuejs.org/guide/essentials/computed.html#basic-example
   */
  computed: {
    /**
     * check if both fields are correctly filled-out, logic happens in mapbox code
     * @returns {boolean} if the button should be clickable
     */
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

  /**
   * just creating local varibles
   * @returns {{toField: string, fromField: string}}
   */
  data() {
    return {
      toField: '',
      fromField: ''
    }
  },

  /**
   * gets called after async created, also just a method which get called during page creation
   */
  mounted() {
    this.createSearchFields();

    this.onResize()

    window.addEventListener('resize', this.onResize, { passive: true })
  },

  methods: {
    toProfile() {
      this.$router.push("/ProfilePage");
    },

    /**
     * sett the cords in the vue x store that the rout page can access it
     */
    forwardSearch() {
      this.$store.commit('SET_TO_FROM', {to: this.toField, from: this.fromField});
      this.$router.push("/RoutePage");
    },

    /**
     * creates the tow search-fields via  mapbox api
     */
    createSearchFields() {
      // mapbox initialisation
      const geocoderTo = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'address'
      });

      // creating geocoder
      geocoderTo.addTo('#geocoderTo');

      // adding it to dom via vue
      const resultsTo = document.getElementById('#resultTo');

      //settings for the appearance of geocodefield
      geocoderTo.on('result', (e) => {
        this.toField = {coords: e.result.center, name: e.result.place_name};
        resultsTo.innerText = JSON.stringify(e.result, null, 2);
      });

      geocoderTo.on('clear', () => {
        this.toField.coords = null;
        resultsTo.innerText = '';
      })

      /* ----------------------------------------------------------------------------------- */

      // mapbox initialisation
      const geocoderFrom = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'address'
      });

      // creating geocoder
      geocoderFrom.addTo('#geocoderFrom');

      // adding it to dom via vue
      const resultsFrom = document.getElementById('#resultFrom');

      //settings for the appearance of geocodefield
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
  margin-bottom: 1rem;
  text-align: left;
  padding-left: 1rem;
}

#h3_ {
  font-weight: unset;
  font-size: x-large;
  margin-bottom: 2rem;
}

#geocoderTo {
  position: relative;
  z-index: 9;
}

#geocoderFrom {
  position: relative;
  z-index: 99;
}

</style>
