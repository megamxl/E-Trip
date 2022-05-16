<template>
  <v-app>
    <RouteNavBar :cars="carList.cars" />
    <MapBoxInterface :station-list="stationList" />
  </v-app>
</template>

<script>

import stations from 'static/stations.json';

export default {
  data () {
    return {
      stationList: stations.data.stationList,
      carList: {
        cars: ['Tesla Model 3', "Audi E-Tron", "BMW I3S", "Citroen E-SpaceTourer"]
      }
    }
  },

  mounted() {
  },
  name: "RoutePage.vue",
}

</script>

<style scoped>

</style>
