<template>

  <v-app>
    <v-content>
      <BasicNavBarLanding/>
    </v-content>

    <v-container fill-height fluid justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="10" lg="6" xl="4" width="700">
          <v-card id="cardArea" outlined dark class="mx-auto">

            <v-img id="imgCar"
                   src="https://cdn.pixabay.com/photo/2022/01/16/23/15/car-6943487_960_720.jpg"
                   class="white--text align-end"
                   gradient="to top right, rgba(255,255,255,.33), rgba(5,5,5,.33)"
                   height="250px"
                   ></v-img>
            <v-card-title >
              <h2 id="h2_">Enter car details</h2></v-card-title>

            <div id="cardText">

              <v-form ref="form" lazy-validation>

                <v-autocomplete label="Car brand" :items="allCarBrandsData" v-model="carbrand" required outlined></v-autocomplete>

                <v-autocomplete label="Car model" :items="brandModels" v-model="carmodel" required outlined></v-autocomplete>

                <v-btn :disabled="allowSend" id="submitButton" block x-large class="mr-4" @click="submitData" rounded>Submit</v-btn>

              </v-form>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>

</template>

<script>

import AsyncComputed from 'vue-async-computed'
import Vue from "vue";

Vue.use(AsyncComputed)

export default {
  name: "ProfileCreation",

  async created(){
    this.allCarBrandsData = await this.allCarBrands();
  },

  /**
   * using the benefits of async and the computed, but it is not standard
   * so we had to intall it
   */
  asyncComputed: {
    async brandModels() {
      let response = []; let modelNames = [];
      if (this.allCarBrandsData.includes(this.carbrand)) {
        response = await this.carsViaBrand(this.carbrand);
        this.selectedCarModels = response;
      }

      for (const carModel of response) {
        if (carModel[1][0] == null) carModel[1][0] = ''
        modelNames.push(`${carModel[0]} ${carModel[1][0]}`);
      }
      return modelNames;
    }
  },

  /**
   * computed property just reacts of input during runtime
   * https://vuejs.org/guide/essentials/computed.html#basic-example
   * gets us the current user state
   */
  computed: {
    allowSend() {
      console.log(`Carbrand: ${this.carbrand} - Carmodel: ${this.carmodel}`);
      return !((this.carbrand !== '' && this.carbrand !== null)
        && (this.carmodel !== '' && this.carmodel != null))
    }
  },

  /**
   * gets called after async created, also just a method which get called during page creation
   */
  //responsive
  mounted () {
    this.onResize()

    window.addEventListener('resize', this.onResize, { passive: true })
  },

  /**
   * just creating local varibles
   * @returns {{toField: string, fromField: string}}
   */
  data() {
    return {
      carmodel: '',
      carbrand: '',
      selectedCarModels: '',
      allCarBrandsData: []
    }
  },

  methods: {
    /**
     * makes a new document(js object)
     * and it inserts it via firebase library to the uid of the user
     * @returns {Promise<void>}
     */
    async submitData() {

      this.selectedCarModels = this.getCarIdFromModelName();

      const ref = this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid)
      const document = {
        carbrand: this.carbrand,
        carmodel: this.carmodel,
        carID: this.selectedCarModels
      }

      try {
        await ref.set(document)
        //added by Christina - maybe incorrect
        this.$router.replace("ProfilePage");
        //end of added by Christina
      } catch (e) {
        console.error(e)
      }
    },

    async getAllCarData(){
      return await fetch("/getAllCars").then(r => r.json())
    },

    async allCarBrands (body) {
      return  await fetch("/getCarBrands", {
        method : "DELETE",
        headers : {
          'Content-Type': 'application/json'
        },

      }).then(res => res.json())
    },

    async carsViaBrand(carBrand){
      return await fetch('/getCarByBrand', {
        method : "PUT",
        headers : {
          brand : carBrand,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json())
    },

    /**
     * work with the return from our api and format it for our view
     * @returns {string}
     */
    getCarIdFromModelName() {
      for (const car of this.selectedCarModels) {
        if (this.carmodel === `${car[0]} ${car[1][0]}`) {
          return car[1][1]
        }
      }
    },

    height () {
      switch (this.$vuetify.breakpoint.name) {
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
      }
    },

    //responsive
    onResize () {
      this.isMobile = window.innerWidth < 600
    },
  },

  //responsive
  beforeDestroy () {
    if (typeof window === 'undefined') return

    window.removeEventListener('resize', this.onResize, { passive: true })
  },
};


</script>

<style scoped>
html {
  background: #121212;
}

#cardArea {
  border-radius: 20px;
}

#cardText {
  padding: 0rem 1rem 3rem;
}

form {
  padding: 1rem 0rem;

}

#submitButton {
  background: #398A0B;
  color: #fff;
  width: 10rem;
  margin-top: 2rem;
  margin-left: 0.1%;
  margin-bottom: 1rem;
}

#h2_ {
  z-index: 1;
  font-weight: unset;
  font-size: x-large;
  margin-top: -8rem;
  padding-left: 1rem;
}
</style>
