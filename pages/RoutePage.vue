<template>
  <v-app>
    <RouteNavBar />
    <MapBoxInterface v-if="dataReady" :route-data="routeData" :carData="carID"/>
    <v-col v-if="!dataReady" justify="center">
      <v-row justify="center">
        <v-overlay>
          <v-progress-circular indeterminate size="128">

          </v-progress-circular>
        </v-overlay>
<!--    <v-img id="mapLoading" src="https://cdn.dribbble.com/users/629695/screenshots/6650472/wolfspeed_anim5_charge_loop1.gif" />-->
      </v-row>
    </v-col>
  </v-app>
</template>

<script>

import {doc, getDoc} from "firebase/firestore";

export default {
  computed: {
    passedRouteData() {
      return this.$store.state.to_from;
    }
  },
  methods: {
    async createRouteMethod(carId, longStart, latStart, longEnd, latEnd) {
      const id = await fetch("/createRoute", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chargeValue: this.carID.battery,
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
          carID: this.carID
        }
      }
      // console.log("getRouting: ", getRouting);
      const response = await fetch("/getRoute", getRouting);
      const data = await response.json();

      console.log("ResponseData: ", data.data);
      return data;
    },

    async getCarData() {
      this.message = ""
      const docRef = doc(this.$fire.firestore, "users", this.$fire.auth.currentUser.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.carData = docSnap.data()
        } else {
          this.message = "No data connected to your user"
          this.carData = {
            carcarbrand: "",
            carmodel: "",
            realrange: "",
            carid: ""
          }
        }
        return this.carData;
      } catch (e) {
      }
    }
  },


  data() {
    return {
      carID: "",
      carData: "",
      routeData: {},
      dataReady: false,
    }
  },

  async created() {

    try {
      this.carData = (await this.getCarData());
      const header = {
        method : "GET",
        headers : {
          'Content-Type': 'application/json',
          id: this.carData.carID
        },
      }

      const allCarInfos = (await fetch("/getCarById", header).then(r => r.json())).data.car;
      console.log("Battery: ", allCarInfos);

      this.carID = {id: this.carData.carID, battery: allCarInfos.battery.usable_kwh};
    } catch (e) {
      this.carID = {id: "5f98238a7473fe6a4cbb813f", battery: 20}
    }

    /* If no Data is given, redirect back to StartPage */
    if (this.passedRouteData.from == null || this.passedRouteData.to == null) this.$router.push("/");

    const to = this.passedRouteData.to;
    const from = this.passedRouteData.from;
    const routeIdObject = await this.createRouteMethod(
      this.carID.id,
      from.coords[0],
      from.coords[1],
      to.coords[0],
      to.coords[1],
    );

    const routeID = routeIdObject.data.newRoute.toString();
    this.routeData = (await this.getRoute(routeID)).data.route.route;

    this.dataReady = true;

  },
  name: "RoutePage.vue",
}

</script>

<style scoped>

#mapLoading {
  height: 100vh;
  width: auto;
}

</style>
