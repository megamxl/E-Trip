<template>
  <v-app :height="height">
    <!--  Background Div to display Tesla  -->
    <div class="background">

      <!--  Left Column - Holds the Login/Signup Information  -->
      <div class="left d-inline-flex flex-column justify-space-around pillar">
        <v-container no-warp>
          <h1 id="h1Create" class="mb-8
            text-sm-h6
            text-md-h5
            text-lg-h4
            text-xl-h3"> Create your own profile to get the most out of E-Trip </h1>
          <v-btn block x-large to="/auth/login" outlined rounded> Sign Up / Login</v-btn>
        </v-container>
      </div>

      <!--  Right Column - Holds the Route planning Information  -->
      <div class="right d-flex flex-column justify-space-around pillar">
        <v-container class="landingContainer rounded-lg d-flex flex-column">
          <h1 class="mb-8
            text-sm-h6
            text-md-h5
            text-lg-h4
            text-xl-h3"> Look for an optimal route now </h1>

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

          <v-btn :disabled="buttonDisable" class="mt-8 d-sm-flex text-sm-body-2 text-xl-body-1"
                 @click="forwardSearch" block x-large outlined rounded> Plan your route
            <v-icon right>mdi-magnify</v-icon>
          </v-btn>
        </v-container>
      </div>

    </div>
  </v-app>
</template>

<script>

import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";


mapboxgl.accessToken = 'pk.eyJ1IjoiZXJvbGxlcm1heGwiLCJhIjoiY2wxZXFxdnhuMGR1djNkcnRtcjh5ZTl0YyJ9.DHWKvonLm0wS5SRvAvPTRA';

export default {

  // Constantly checks on changed data and changes accordingly
  computed: {

    /**
     * Checks if to and from are set and have coordinates
     * Enables button if both coords[]s are set
     * @returns {boolean}
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
  data() {
    return {
      toField: '',
      fromField: ''
    }
  },
  methods: {
    /**
     * Forwards the user to the RoutePage and passes the coordinates to the VueStore
     */
    forwardSearch() {
      this.$store.commit('SET_TO_FROM', {to: this.toField, from: this.fromField});
      this.$router.push("/RoutePage");
    },

    /**
     * Creates the two search fields which are based on MapBoxGeocoder
     * With autocomplete the coordinates from the result are then inserted into "toField" and "fromField"
     */
    createSearchFields() {
      const geocoderTo = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'address'
      });

      geocoderTo.addTo('#geocoderTo');
      const resultsTo = document.getElementById('#resultTo');
      geocoderTo.on('result', (e) => {
        this.toField = {coords: e.result.center, name: e.result.place_name};
        try { resultsTo.innerText = JSON.stringify(e.result, null, 2); } catch (e) {}
      });

      geocoderTo.on('clear', () => {
        try {
          this.toField.coords = null
          resultsTo.innerText = '';
        } catch (e) {}
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
        try { resultsFrom.innerText = JSON.stringify(e.result, null, 2); } catch (e) {}
      });

      geocoderFrom.on('clear', () => {
        try {
          this.fromField.coords = null
          resultsFrom.innerText = '';
        } catch (e) {}

      })


    },

    //responsive - breakpoints
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 0
        case 'sm':
          return 300
        case 'md':
          return 400
        case 'lg':
          return 600
        case 'xl':
          return 800

      }
    },
  },
  /**
   * Mounted is a vue-lifecycle hook and is called after the elements are placed into the DOM
   * This ensures that all html elements are set before anything inside mounted is executed
   */
  mounted() {
    this.createSearchFields();
  },
  name: "LandingPage"
}
</script>

<style>

@import "../style/mapbox-geocoder.css";

.background {
  width: 100%;
  height: 100vh;
  background: url("assets/tesla.webp") no-repeat top center fixed;
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

h4 {
  margin-bottom: 10px;
}


/*z-index here avoids overlapping of "To-Suche-Feld" - z-index can only be used in combination with position*/
#geocoderTo {
  position: relative;
  z-index: 9;
}
#geocoderFrom {
  position: relative;
  z-index: 99;
}


/*responsive media-queries - 3 breakpoints: 801px, 600px, 500py  */
@media screen and (max-width:801px) {
  h1 {
    font-size: large;
    font-weight: initial;
  }
  .left {
    height: 30%;
    padding: 10rem 0;
  }
  #containerMiddleEmpty {
    height: 0;
    padding: 0;
  }
  .right {
    height: 70%;
    padding: 10rem 0;
  }
  .left, .right {
    padding: 0 3rem;
    width: 100%;
    flex-direction: row;
  }
  .background {
    background-attachment: fixed;
  }
}
@media screen and (max-width:500px) {
  .left, .right {
    padding: 0 1.5rem;
  }
}
@media screen and (max-width:600px) {
  #h1Create {
    font-size: larger;
  }
}
</style>
