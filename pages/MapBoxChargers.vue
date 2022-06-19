<template>
  <v-app>
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

  asyncComputed: {
    async currentCords() {
    }

  },

  data() {
    return {
      map: {},
      chargers : {}
    }
  },
  props: {},
  mounted() {
    this.createMap();
    //this.createSearchFields();
    this.makeOnLoadEvent()
  },
  methods: {

    async getNearByCharegers(cords){
        return await fetch("/getChargerNearby", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            longitudeStart : cords[0],
            latitudeStart: cords[1],
            distance : 5000
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
        this.map.addSource('single-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        geocoder.on('result',  async (event) => {
          console.log("event", event.result.center)
           this.chargers = await this.getNearByCharegers( event.result.center)
          console.log(this.chargers.data.stationAround)
          //map.getSource('single-point').setData(event.result.geometry);
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
  border-radius: 25px;
  height: 20px;
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
