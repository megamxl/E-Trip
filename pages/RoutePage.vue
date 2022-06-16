<template>
  <v-app>
    <RouteNavBar :cars="carList.cars"/>
    <MapBoxInterface v-if="routeData.saving !== undefined" :route-data="routeData" />
  </v-app>
</template>

<script>

export default {
  computed: {
    passedRouteData() {
      return this.$store.state.to_from; //TODO: Implement this in createRoute()
    }
  },
  methods: {
    async createRouteMethod(carId, longStart, latStart, longEnd, latEnd ) {

      let id = await fetch("/createRoute", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chargeValue: 60,
          chargeValueType: "kwh",
          occupants: 2,
          longitudeStart: longStart,
          latitudeStart: latStart,
          cityStart: "Vienna",
          countryStart: "Austria",
          longitudeEnd: longEnd,
          latitudeEnd: latEnd,
          cityEnd: "Matzen",
          countryEnd: "Austria",
          carID: carId
        }),
      }).then(res => res.json());


      // http get

      // delete

        //let myRoutes =  this.$store.getters.getRoutes
         // myRoutes.routes.push("test")
        //console.log(myRoutes.routes)

         console.log("now comes id")
        return id;
      },

    async getRoute(routeID) {
      // http post
      const getRouting = {
        method: "GET",
        headers: {
          routeID: routeID,
          carID: "5d161be5c9eef46132d9d20a"
        }
      }
      return fetch("/getRoute", getRouting).then(r => r.json())
    },
  },


  data() {
    return {
      carList: {
        cars: ['Tesla Model 3', "Audi E-Tron", "BMW I3S", "Citroen E-SpaceTourer"]
      },
      routeData: {}
    }
  },

  async created() {
    //console.log(this.passedRouteData);
    console.log("now Creating")
    let data =await this.createRouteMethod(
      "5d161be5c9eef46132d9d20a",
      19.5057541,
      47.1611615,
      13.3999984,
      52.5166646
  ).then( async  datar=>{
    console.log(datar)
      //this.routeData = ( await this.getRoute(datar.data.newRoute)).data.route.route;
    });
    //console.log(data.data.newRoute)
    this.routeData = (await this.getRoute("62ab6f455f85736782ab25c4")).data.route.route;

    // await console.log("Routedata: ", this.routeData); For Testing
  },
  name: "RoutePage.vue",
}

</script>

<style scoped>

</style>
