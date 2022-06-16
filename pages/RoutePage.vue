<template>
  <v-app>
    <RouteNavBar :cars="carList.cars"/>
    <MapBoxInterface :route-data="routeData" />
  </v-app>
</template>

<script>

import route from 'static/postmanRouteData.json';

export default {
    methods: {
       async createRoute(){
        // http post
        const requestOptions = {
          method: "POST",
          body : JSON.stringify({"carId":"5d161be5c9eef46132d9d20a",
            "chargeValue:": 60,
            "chargeValueType": "kwh" ,
            "longitudeStart": 16.370498518,
            "latitudeStart": 48.20499918,
            "cityStart": "beginCity",
            "countryStart" : "begin-country",
            "longitudeEnd": 19.5057541,
            "latitudeEnd" : 47.1611615 ,
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
    },


   data() {
    return {
      // here we need to fetch and delete routes
      async createRoute() {

        // http post
        const requestOptions = {
          method: "POST",
          body: JSON.stringify({
            "carId": "5d161be5c9eef46132d9d20a",
            "chargeValue:": 60,
            "chargeValueType": "kwh",
            "longitudeStart": 16.370498518,
            "latitudeStart": 48.20499918,
            "cityStart": "beginCity",
            "countryStart": "begin-country",
            "longitudeEnd": 19.5057541,
            "latitudeEnd": 47.1611615,
            "cityEnd": "endCity",
            "countryEnd": "endcity"
          })
        }

        let id =  await fetch("/createRoute", requestOptions).then(res =>res.json());

        console.log(id)

        // http get

        // delete


        /*
        let myRoutes = this.$store.getters.getRoutes
        myRoutes.routes.push("test")

        console.log(myRoutes.routes)
        */
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
