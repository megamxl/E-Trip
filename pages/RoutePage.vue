<template>
  <v-app>
    <RouteNavBar :cars="carList.cars"/>
    <MapBoxInterface :route-data="routeData" />
  </v-app>
</template>

<script>

import route from 'static/postmanRouteData.json';

export default {
  computed: {
    passedRouteData() {
      return this.$store.state.to_from;
    }
  },
    methods: {
       async createRouteMethod(){
        // http post
        const requestOptions = {
          method: "POST",
          body : JSON.stringify({
            "chargeValue": 60,
            "chargeValueType": "kwh",
            "occupants": 2,
            "longitudeStart": 16.382402799632196,
            "latitudeStart": 48.157929182082086,
            "cityStart": "Vienna",
            "countryStart": "Austria",
            "longitudeEnd": 16.683711150332908,
            "latitudeEnd": 48.40290439081926,
            "cityEnd": "Matzeb",
            "countryEnd": "Austria",
            "carID": "5d161be5c9eef46132d9d20a"
          })
        }

        let id =  await fetch("/createRoute", requestOptions).then(res =>res.json());


        // http get

        // delete

        let myRoutes =  this.$store.getters.getRoutes
        myRoutes.routes.push("test")
        console.log(myRoutes.routes)
         console.log("now comes id")
        console.log(id)
      },

       async getRoute(){
        // http post
        const getRouteing = {
          method: "GET",
          headers : ({
            routeID: "62ab131a816563cd0b750096",
            carID: "5d161be5c9eef46132d9d20a"
          })
        }
         await fetch("/getRoute", getRouteing).then(r => r.json()).then(vla => {
           return vla;
         })
      },
    },


   data() {
    return {
      carList: {
        cars: ['Tesla Model 3', "Audi E-Tron", "BMW I3S", "Citroen E-SpaceTourer"]
      },
      routeData: route.data.route.route
      //routeData:
    }
  },

  mounted() {
    //console.log(this.passedRouteData);
     //this.createRouteMethod();

   this.getRoute()



  },
  name: "RoutePage.vue",
}

</script>

<style scoped>

</style>
