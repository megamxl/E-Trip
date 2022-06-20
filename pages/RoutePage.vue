<template>
  <v-app>
    <RouteNavBar />
    <MapBoxInterface v-if="dataReady" :route-data="routeData" :carData="carID"/>
    <v-col v-if="!dataReady" justify="center">
      <v-row justify="center">
        <v-overlay>
          <v-progress-circular indeterminate size="128" />
        </v-overlay>
      </v-row>
    </v-col>
  </v-app>
</template>

<script>

import {doc, getDoc} from "firebase/firestore";

export default {

  /**
   * when creating the website do async things we need on load
   * @returns {Promise<void>}
   */
  async created() {

    /**
     * try if you are logged in and if not use static data
     */
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
      this.carID = {id: this.carData.carID, battery: allCarInfos.battery.usable_kwh};
    } catch (e) {
      this.carID = {id: "5f98238a7473fe6a4cbb813f", battery: 20}
    }

    /* If no Data is given, redirect back to StartPage */
    if (this.passedRouteData.from == null || this.passedRouteData.to == null) this.$router.push("/");

    /**
     * get the saved cords from the vuex store and store it in a local object
     */
    const to = this.passedRouteData.to;
    const from = this.passedRouteData.from;
    const routeIdObject = await this.createRouteMethod(
      this.carID.id,
      from.coords[0],
      from.coords[1],
      to.coords[0],
      to.coords[1],
    );

    /**
     * get the new route
     * @type {string}
     */
    const routeID = routeIdObject.data.newRoute.toString();
    this.routeData = (await this.getRoute(routeID)).data.route.route;

    this.dataReady = true;
  },

  /**
   * just creating local varibles
   * @returns {{toField: string, fromField: string}}
   */
  data() {
    return {
      carID: "",
      carData: "",
      routeData: {},
      dataReady: false,
    }
  },

  /**
   * computed property just reacts of input during runtime
   * https://vuejs.org/guide/essentials/computed.html#basic-example
   * gets us the current user state
   */
  computed: {
    passedRouteData() {
      return this.$store.state.to_from;
    }
  },

  methods: {
    /**
     * fetches a new route id based on the variables
     * @param carId
     * @param longStart
     * @param latStart
     * @param longEnd
     * @param latEnd
     * @returns {Promise<unknown>}
     */
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
      return id;
    },

    /**
     * returns route object
     * @param routeID needs charegtrip route id
     * @returns {Promise<unknown>}
     */
    async getRoute(routeID) {
      const getRouting = {
        method: "GET",
        headers: {
          routeID: routeID,
          carID: this.carID
        }
      }
      const response = await fetch("/getRoute", getRouting);
      const data = await response.json();

      return data;
    },

    /**
     * gets the data from firebase connected to the curr uid
     * @returns {Promise<string>}
     */
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
  name: "RoutePage.vue",
}

</script>

<style scoped>

#mapLoading {
  height: 100vh;
  width: auto;
}

</style>
