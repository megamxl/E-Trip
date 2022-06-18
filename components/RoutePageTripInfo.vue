<template>
  <v-card id="tripInfoCard">
    <v-card-title> Duration: {{ formatTime() }}</v-card-title>
    <v-card-subtitle> {{ subtitleContext() }}</v-card-subtitle>
    <v-img class="ma-4" max-height="150" :src="carInfos.image" style="border-radius: 5px"/>

    <hr/>

    <h3 class="ml-4 mt-4"> Connectors </h3>
    <SpaceAroundText v-for="(adapter, index) in carInfos.connectors" :key="index"
                     :text-left="adapter.standard" :text-right="adapter.power + ' kWh'"/>

    <hr/>

    <h3 class="ml-4 mt-4"> Trip Information </h3>
    <SpaceAroundText text-left="Charge Duration" :text-right="(this.tripData.chargeTime / 3600).toFixed(2) + ' h'"/>
    <SpaceAroundText text-left="Savings on Fule" :text-right="tripData.saving.money + ' ' + tripData.saving.currency"/>
    <SpaceAroundText text-left="Total consumption" :text-right="tripData.consumption.toFixed(2) + ' kWh'"/>
    <SpaceAroundText text-left="CO2 spared" :text-right="tripData.saving.co2 / 1000 + ' kg'"/>

    <hr class="mb-4"/>

    <div class="text-center">
      <v-btn @click="routeToGoogleMaps(tripData.legs)"> Drive with Google Maps</v-btn>
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
      carInfos: {
        "naming": {
          "make": "Tesla",
          "model": "Model 3",
        },
        "connectors": [
          {
            "standard": "IEC_62196_T2",
            "power": 11,
            "time": 495,
            "speed": 57
          },
          {
            "standard": "TESLA_S",
            "power": 135,
            "time": 25,
            "speed": 790
          },
          {
            "standard": "IEC_62196_T2_COMBO",
            "power": 135,
            "time": 25,
            "speed": 790
          }
        ],
        "image": "https://cars.chargetrip.io/5fa3ff3c8de02aab81e8443e.png"
      }
    }
  },
  props: {
    tripData: {
      type: Object,
      required: true
    },
  },
  methods: {
    formatTime() {
      const hours = Math.floor(this.tripData.duration / 3600);
      const minutes = Math.floor((this.tripData.duration % 3600) / 60);
      return `${hours} hrs ${minutes} min`;
    },

    subtitleContext() {
      const distanceInKm = `${this.tripData.distance / 1000} km`;
      const stops = `${this.tripData.charges} stops`;
      const consumption = `${this.tripData.consumption.toFixed(2)} kWh`;

      return `${distanceInKm} / ${stops} / ${consumption}`
    },

    //Stolen From https://github.com/chargetrip/examples/blob/6e61cc22b9da33299bda652bd0a885703fa4e5c6/route/interface.js#L92
    routeToGoogleMaps(legs) {
      //TODO: Make it work more than once => Only reverse once or something
      if (legs.length === 0) return;

      let googleDirURL = `https://www.google.com/maps/dir/?api=1`;
      const origin = legs[0].origin?.geometry?.coordinates;
      const destination = legs[legs.length - 1].destination?.geometry?.coordinates;

      // coordinates are an array with longitude as first value and latitude as the second one
      // we have to reverse it as Google Maps accept latitude first
      googleDirURL += `&origin=${origin?.reverse()?.join(',')}&destination=${destination?.reverse()?.join(',')}`;

      if (legs.length > 2) {
        googleDirURL += `&waypoints=`;
        legs.map((leg, index) => {
          // add charging stations and waypoints
          if (index !== legs.length - 1) {
            googleDirURL += `${leg.destination?.geometry?.coordinates?.reverse()?.join(',')}|`;
          }
        });
      }

      googleDirURL += `&dir_action=navigate&travelmode=driving`;
      window.open(googleDirURL, '_blank').focus();
      return encodeURI(googleDirURL);
    }
  },
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
