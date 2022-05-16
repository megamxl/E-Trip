<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css"

export default {
  name: "MapBoxInterface",
  data() {
    return {
      access_token: 'pk.eyJ1IjoidGhvbWFzbWVpZXIiLCJhIjoiY2wxZXF3Nnl5MGxyZjNibG53dWp5bmFkcCJ9.wGzMNfIT8zp8FcO-YfpzYQ',
      map: {},
    }
  },
  props: {
    stationList: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.getLocation();
  },
  methods: {
    createMap(coords) {

      mapboxgl.accessToken = this.access_token;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/thomasmeier/cl1er04hz002m14o0opiop21k',
        center: coords,
        zoom: 13
      });

      for (const station of this.stationList) {
        const swapCords = [station.coordinates.longitude, station.coordinates.latitude];
        new mapboxgl.Marker({color: "#5E1224"})
          .setLngLat(swapCords)
          .setPopup(new mapboxgl.Popup({ offset: 25})
            .setHTML(`<div class="mapboxgl-popup-content"><h2> ${station.name}</h2> <br>
            <h3>Amount: ${station.chargers.length} charger</h3></div>`))
          .addTo(this.map)
      }
    },

    getLocation() {
      navigator.geolocation.getCurrentPosition(this.successLocation, this.errorLocation, {enableHighAccuracy: true});
    },

    successLocation(position) {
      console.log(position);
      this.createMap([position.coords.longitude, position.coords.latitude]);
    },

    errorLocation() {
      this.createMap([16.363449, 48.210033]);
    },
  }
}
</script>

<style>

@import url("https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css");
@import url("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css");

#map {
  height: 100vh;
}

.mapboxgl-popup-content * {
  color: black;
}

</style>
