
<!-- Displays infos of the calculated route and the given car -->

<template>
  <v-card v-if="carInfoReady" id="tripInfoCard">
    <v-card-title> Duration: {{ formatTime() }}</v-card-title>
    <v-card-subtitle> {{ subtitleContext() }}</v-card-subtitle>
    <h3 class="ml-4"> {{this.carInfos.naming.model}} {{this.carInfos.naming.make}} </h3>
    <v-img class="ml-4 mr-4 mt-2 mb-2" max-height="150" :src="carInfos.media.image.url" style="border-radius: 5px"/>

    <hr/>

    <h3 class="ml-4 mt-4"> Connectors </h3>
    <SpaceAroundText v-for="(adapter, index) in carInfos.connectors" :key="index"
                     :text-left="adapter.standard" :text-right="adapter.power + ' kWh'"/>

    <hr/>

    <h3 class="ml-4 mt-4"> Trip Information </h3>
    <SpaceAroundText text-left="Charge Duration" :text-right="(this.tripData.chargeTime / 3600).toFixed(2) + ' h'"/>
    <SpaceAroundText text-left="Savings on Fuel" :text-right="(parseFloat( tripData.saving.money) * 0.95 ).toFixed(2) + ' ' + '€'"/>
    <SpaceAroundText text-left="Total consumption" :text-right="tripData.consumption.toFixed(2) + ' kWh'"/>
    <SpaceAroundText text-left="CO2 saved" :text-right="tripData.saving.co2 / 1000 + ' kg'"/>

    <hr class="mb-4"/>

    <div class="text-center">
      <v-btn @click="openURI"> Drive with Google Maps</v-btn>
    </div>


  </v-card>

</template>

<script>

import testImage from "assets/tesla.jpg";

export default {
  name: "RoutePageTripInfo",

  data: function () {
    return {
      testImage: testImage,
      carInfos: {},
      carInfoReady: false,
      googleURL: ""
    }
  },
  props: {
    tripData: {
      type: Object,
      required: true
    },
    carData: {
      required: true
    }
  },
  methods: {
    /**
     * Formats time from seconds to minutes and hours
     * @returns {string} A String formatted to display hrs and min
     */
    formatTime() {
      const hours = Math.floor(this.tripData.duration / 3600);
      const minutes = Math.floor((this.tripData.duration % 3600) / 60);
      return `${hours} hrs ${minutes} min`;
    },

    /**
     * Displays Distance of the Trip, How many stops there are and how much kWh are consumed
     * @returns {string} Formatted string
     */
    subtitleContext() {
      const distanceInKm = `${this.tripData.distance / 1000} km`;
      const stops = `${this.tripData.charges} stops`;
      const consumption = `${this.tripData.consumption.toFixed(2)} kWh`;

      return `${distanceInKm} / ${stops} / ${consumption}`
    },

    //Stolen From https://github.com/chargetrip/examples/blob/6e61cc22b9da33299bda652bd0a885703fa4e5c6/route/interface.js#L92
    /**
     * Turns an array of coordinates on a map into a usable Google Maps link
     * @param legs
     * @returns {string}
     */
    routeToGoogleMaps(legs) {
      //TODO: Make it work more than once => Only reverse once or something
      if (legs.length === 0) return;

      let googleDirURL = `https://www.google.com/maps/dir/?api=1`;
      const origin = legs[0].origin?.geometry?.coordinates;
      const destination = legs[legs.length - 1].destination?.geometry?.coordinates;

      // coordinates are an array with longitude as first value and latitude as the second one
      // we have to reverse it as Google Maps accept latitude first
      //googleDirURL += `&origin=${origin?.reverse()?.join(',')}&destination=${destination?.reverse()?.join(',')}`;

      if (legs.length > 2) {
        googleDirURL += `&waypoints=`;
        legs.map((leg, index) => {
          // add charging stations and waypoints
          if (index !== legs.length - 1) {
            googleDirURL += `${leg.destination?.geometry?.coordinates?.reverse()?.join(',')}|`;
            leg.destination?.geometry?.coordinates?.reverse();
          }
        });
      }

      googleDirURL += `&dir_action=navigate&travelmode=driving`;
      return encodeURI(googleDirURL);
    },

    /**
     * Opens the googleURL in a new Tab
     */
    openURI() {
      window.open(this.googleURL, '_blank').focus();
    },

    /**
     * Fetches CarInfos based on the carID contained in carData
     * @returns {Promise<unknown>} An Object with many properties of the car
     */
    async fetchCarInfo() {
      const header = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          id: this.carData.id
        },
      }

      const response = await fetch("/getCarById", header).then(r => r.json());
      console.log("Response: ", response);
      return response;
    }
  },

  /**
   * On Vue Lifecycle Hook - Fetches CarInfos and turns the routeInfo into a Google Maps url
   * @returns {Promise<void>}
   */
  async created() {
    this.carInfos = (await this.fetchCarInfo()).data.car;
    this.carInfoReady = true;
    let copy = { ... this.tripData.legs}
    this.googleURL = this.routeToGoogleMaps(this.tripData.legs)
  }
}
</script>

<style scoped>

#tripInfoCard {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 300px;
  height: 90%;
  border-radius: 10px;
}

</style>
