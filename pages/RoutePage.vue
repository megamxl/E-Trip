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
      // here we need to fetch and delete routes
      test(){
          // http post
        const requestOptions = {
            method: "POST",
            body : JSON.stringify({"carId":"5d161be5c9eef46132d9d20a",
              "chargeValue:": 60,
              "chargeValueType": "kwh" ,
              "longitudeStart": 2,
              "latitudeStart":2,
              "cityStart": "beginCity",
              "countryStart" : "begin-country",
              "longitudeEnd": 3,
              "latitudeEnd" :3,
              "cityEnd": "endCity",
              "countryEnd" : "endcity"
            })
        }
        fetch("/createRoute", requestOptions);


          // http get

          // delete


          let myRoutes =  this.$store.getters.getRoutes
          myRoutes.routes.push("test")

          console.log(myRoutes.routes)
      },

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
