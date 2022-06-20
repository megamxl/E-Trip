<template>
  <v-app>

    <!--responsive; v-expansion-panels for mobile version -->
      <v-expansion-panels v-show="mobile">
        <v-expansion-panel>
          <v-expansion-panel-header> Click for route details </v-expansion-panel-header>
          <v-expansion-panel-content class="overflow-auto" id="mobileExpansion">
            <RoutePageTripInfo v-if="routeData != null" :trip-data="routeData" :carData="carData"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>


    <div id="map"></div>

    <!--RouterPageTripInfo is only shown if !mobile!! -->
    <RoutePageTripInfo v-show="!mobile" v-if="routeData != null" :trip-data="routeData" :carData="carData"/>
    <v-card id="errorMsg" v-if="routeData == null">
      <v-card-title> Your route is not reachable with provided configuration</v-card-title>
    </v-card>

  </v-app>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

import * as mapboxPolyline from '@mapbox/polyline';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzbWVpZXIiLCJhIjoiY2wxZXF3Nnl5MGxyZjNibG53dWp5bmFkcCJ9.wGzMNfIT8zp8FcO-YfpzYQ';

export default {
  name: "MapBoxInterface",
  data() {
    return {
      map: {},

      //responsive
      mobile: null,
      windowWidth: null,
    }
  },
  /**
   * Props defines values/data that can be passed when calling the component
   */
  props: {
    // RouteData represents the information for the Route
    routeData: {
      required: true
    },
    // CarData represents the information for the Car
    carData: {
      required: true,
    }
  },

  /**
   * Mounted is a vue-lifecycle hook and is called after the elements are placed into the DOM
   * This ensures that all html elements are set before anything inside mounted is executed
   */
  mounted() {
    this.createMap();
    if (this.routeData != null) this.drawRouteFromPolyline(this.routeData);
  },

  /**
   * Created is a vue-lifecycle hook and is called after the Options API is initiated but before any DOM Placement is done
   * This is helpful if you want to check certain properties that are independent of the content itself
   */
  created() {
    window.addEventListener('resize', this.checkScreen);
    this.checkScreen();
  },
  methods: {

    //responsive
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 600) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
    },

    /**
     * Creates the MapBox Map
     */
    createMap() {
      let focusCoordinates = []
      if (this.routeData != null) {
        focusCoordinates = [this.routeData.legs[0].origin?.geometry.coordinates[0], this.routeData.legs[0].origin?.geometry.coordinates[1]]
      } else {
        focusCoordinates = [16.3731, 48.2083]
      }

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
        // style: 'mapbox://styles/thomasmeier/cl44io3hz008614p773hh7h8g',
        zoom: 6,
        center: focusCoordinates
      });
    },

    /**
     * Calls drawRoute after formatting passed data
     * @param routeData - The passed data
     */
    drawRouteFromPolyline(routeData) {
      const decoded = mapboxPolyline.decode(routeData.polyline); // Turns Polyline into thousands of Long, Lat Coords
      const reversed = decoded.map(item => item.reverse()); // Reverses them cause mapbox stoopid

      this.drawRoute(reversed, routeData.legs);
    },

    /**
     * Checks if map is loaded => Calls all functions to draw route in mapbox
     * @param wayPoints
     * @param legs
     */
    drawRoute(wayPoints, legs) {
      if (this.map.loaded()) {
        // this.drawPolyline(wayPoints);
        this.showLegs(legs);
        this.drawChargingTimes(legs);
      } else {
        this.map.on('load', () => {
          this.drawPolyline(wayPoints);
          this.showLegs(legs);
          this.drawChargingTimes(legs);
        })
      }
    },

    /**
     * Adds a little chip at each charger on the route to indicate charging times
     * @param legs - An array of chargers
     */
    drawChargingTimes(legs) {
      legs.forEach((leg, index) => {
        if (index === legs.length - 1) return;

        const chargeTime = this.formatTime(leg.chargeTime);

        new mapboxgl.Popup({closeButton: false, offset: [23, -23], closeOnClick: false})
          .setLngLat(leg.destination.geometry.coordinates)
          .setHTML(`<small>${chargeTime.hours}:${chargeTime.minutes} </small>`)
          .addTo(this.map);
      })
    },

    /**
     * Adds a Layer to the Map based on the passed waypoints to show given points
     * @param wayPoints - An array of waypoints
     */
    drawPolyline(wayPoints) {
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              properties: {},
              coordinates: wayPoints,
            },
          },
        ],
      };

      this.map.addSource('polyline-source', {
        type: 'geojson',
        lineMetrics: true,
        data: geojson,
      });

      this.map.addLayer({
        id: 'polyline',
        type: 'line',
        options: 'beforeLayer',
        source: 'polyline-source',
        layout: {'line-join': 'round', 'line-cap': 'round', 'visibility': 'visible'},
        paint: {'line-color': '#0078ff', 'line-width': 3},
      });
    },

    /**
     * Mapbox Magic - Adds another Layer to display route
     * @param legs
     */
    showLegs(legs) {
      if (legs.length === 0) return;

      let points = [];

      points.push({
        type: 'Feature',
        properties: {
          icon: 'location_big',
        },
        geometry: legs[0].origin?.geometry,
      });

      legs.map((leg, index) => {
        // add charging stations
        if (index !== legs.length - 1) {
          points.push({
            type: 'Feature',
            properties: {
              description: `${this.formatTime(leg.chargeTime)}`,
              icon: 'unknown-turbo',
            },
            geometry: leg.destination?.geometry,
          });
        } else {
          // add destination point (last leg)
          points.push({
            type: 'Feature',
            properties: {
              icon: 'arrival',
            },
            geometry: leg.destination?.geometry,
          });
        }
      });

      this.map.addLayer({
        id: 'legs',
        type: 'symbol',
        layout: {
          'icon-image': '{icon}',
          'icon-allow-overlap': true,
          'icon-offset': ['case', ['==', ['get', 'icon'], 'location_big'], ['literal', [0, 0]], ['literal', [0, -15]]],
        },
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: points,
          },
        },
      });
    },

    /**
     * Turns an amount of seconds into minutes and hours
     *
     * @param seconds Time in seconds
     * @returns {{hours: number, minutes: number}} Object with hours and minutes
     */
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return {hours: hours, minutes: minutes};
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
  padding: 5px;
  height: auto;
}

.mapboxgl-popup-content * {
  color: black;
}

/* Mapbox did a big fucky wucky styling and we nono accept that */
.mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-center .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-left .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-right .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip,
.mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  display: none !important;
}

/* The anchor is now in the forever box <3 */

#errorMsg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#mobileExpansion {
  height: 100vh
}
</style>
