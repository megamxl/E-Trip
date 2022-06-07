<template>
  <v-app>
    <RouteNavBar :cars="carList.cars"/>
    <MapBoxInterface :route-data="routeData" />
  </v-app>
</template>

<script>

import route from 'static/postmanRouteData.json';

export default {
  data() {
    return {
      carList: {
        cars: ['Tesla Model 3', "Audi E-Tron", "BMW I3S", "Citroen E-SpaceTourer"]
      },
      routeData: route.data.route.route
    }
  },

  mounted() {
  },
  name: "RoutePage.vue",
}

</script>

<style scoped>

</style>
