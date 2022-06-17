<template>
  <v-app>
    <RouteNavBar :cars="carList.cars"/>
    <MapBoxInterface v-if="dataReady" :route-data="routeData" />
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

      // console.log("%f longStart - %f latStart - %f longEnd - %f latEnd", longStart, latStart, longEnd, latEnd);

      const id = await fetch("/createRoute", {
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
      // console.log("getRouting: ", getRouting);
      const response = await fetch("/getRoute", getRouting);
      const data = await response.json();

      console.log("ResponseData: ", data.data);
      return data;
    },
  },


  data() {
    return {
      carList: {
        cars: ['Tesla Model 3', "Audi E-Tron", "BMW I3S", "Citroen E-SpaceTourer"]
      },
      routeData: {},
      dataReady: false
    }
  },

  async created() {
    if (this.passedRouteData.from == null || this.passedRouteData.to == null) this.$router.push("/");
    console.log("RoutePage/PassedRouteData: ", this.passedRouteData);
    const to = this.passedRouteData.to;
    const from = this.passedRouteData.from;
    const routeIdObject = await this.createRouteMethod(
      "5d161be5c9eef46132d9d20a",
      from.coords[0],
      from.coords[1],
      to.coords[0],
      to.coords[1],
    );

    const routeID = routeIdObject.data.newRoute.toString();
    this.routeData = (await this.getRoute(routeID)).data.route.route;

    // await console.log("Routedata: ", this.routeData); //For Testing
    this.dataReady = true;
  },
  name: "RoutePage.vue",
}

</script>

<style scoped>

</style>
