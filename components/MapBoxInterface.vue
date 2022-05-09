<template>
    <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  name: "MapBoxInterface",
  data() {
    return {
      access_token: 'pk.eyJ1IjoidGhvbWFzbWVpZXIiLCJhIjoiY2wxZXF3Nnl5MGxyZjNibG53dWp5bmFkcCJ9.wGzMNfIT8zp8FcO-YfpzYQ',
      map: {},
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
    }
}
}
</script>

<style scoped>

#map {
  height: 100vh;
}

</style>
