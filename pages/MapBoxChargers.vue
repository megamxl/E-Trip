<template>
  <v-app>
    <RouteNavBar/>
    <div id="map"></div>
  </v-app>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import AsyncComputed from 'vue-async-computed'
import Vue from "vue";

Vue.use(AsyncComputed)


import * as mapboxPolyline from '@mapbox/polyline';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzbWVpZXIiLCJhIjoiY2wxZXF3Nnl5MGxyZjNibG53dWp5bmFkcCJ9.wGzMNfIT8zp8FcO-YfpzYQ';

export default {
  name: "MapBoxInterface",

  data() {
    return {
      map: {},
      chargers: {}
    }
  },
  props: {},

  mounted() {
    this.createMap();
    this.makeOnLoadEvent()
  },
  methods: {

    /**
     * Based on the position given all nearby chargers are searched and returned as an object
     * @param cords - 2d Array
     * @returns {Promise<unknown>}
     */
    async getNearByCharegers(cords) {
      return await fetch("/getChargerNearby", {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          longitudeStart: cords[0],
          latitudeStart: cords[1],
          distance: 10000
        }),
      }).then(res => res.json());
    },

    createMap() {
      let focusCoordinates = []
      focusCoordinates = [16.3731, 48.2083]

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
        // style: 'mapbox://styles/thomasmeier/cl44io3hz008614p773hh7h8g',
        zoom: 6,
        center: focusCoordinates
      });
    },

    /**
     * Based on the chargers object markers are placed on the given location with minimal info to each charging point
     * @param chargers - An object that contains multiple chargers
     */
    loopThroughChargers(chargers) {
      for (const chargePoint of chargers) {
        console.log("ChargePoint: ", chargePoint)
        const coords = chargePoint.location.coordinates;
        let availablePower = `<ul>`;

        for (const chargeSpeed in chargePoint.power) {
          availablePower += `<li class="pt-0 pb-0" style="list-style: circle ">${chargeSpeed} kW</li>`
        }
        availablePower += `</ul>`


        const marker = new mapboxgl.Marker({
          color: "#32a852",
        })
          .setLngLat(coords)
          .setPopup(new mapboxgl.Popup().setHTML(
            `
              <h1 class="pa-2"> ${chargePoint.physical_address.formattedAddress[0]} </h1>
              <h3 class="pb-0"> Available Chargers: </h3>
              ${availablePower}
            `
          ))
          .addTo(this.map)
      }
    },

    /**
     * Creates a new GeoCoder and adds a new layer on the map to then display the found charging stations nearby
     */
    makeOnLoadEvent() {
      const geocoder = new MapboxGeocoder({
        // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
        placeholder: 'Search for places in Berkeley', // Placeholder text for the search bar
      });

      this.map.addControl(
        geocoder
      )

      this.map.on('load', () => {
        this.map.addSource('syngle-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        geocoder.on('result', async (event) => {
          this.chargers = await this.getNearByCharegers(event.result.center)
          this.loopThroughChargers(this.chargers.data.stationAround);
        });
      });
    },
  },


}
</script>

<style>

#map {
  width: 100%;
  height: 100%;
}

.mapboxgl-popup * {
  padding: 5px;
  border-radius: 25px;
  height: auto;
}

.mapboxgl-popup-content * {
  color: black;
}

#errorMsg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
