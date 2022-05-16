<template>
  <v-app>
    <RouteNavBar />
    <MapBoxInterface :station-list="stationList" />
  </v-app>
</template>

<script>

import stations from 'static/stations.json';

export default {
  data () {
    return {
      stationList: stations.data.stationList
    }
  },

  mounted() {
  },
  name: "RoutePage.vue",
}

</script>

<style scoped>

</style>
