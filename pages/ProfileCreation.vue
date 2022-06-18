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
                   gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
                   height="250px"
                   ></v-img>
            <v-card-title >
              <h2 id="h2_">Enter car details</h2></v-card-title>

            <div id="cardText">
              <v-card-subtitle id="subtitle_">You can add further cars after the registration is completed.
              </v-card-subtitle>

              <v-form ref="form" lazy-validation>

                <v-autocomplete label="Car brand" :items="allCarBrandsData" v-model="carbrand" required outlined></v-autocomplete>

                <v-autocomplete label="Car model" :items="brandModels" v-model="carmodel" required outlined></v-autocomplete>

                <v-text-field label="Real range" v-model="realrange" required outlined></v-text-field>

                <v-text-field label="Usable-kwh" v-model="usableKwh" required outlined></v-text-field>

                <v-btn id="submitButton" block x-large class="mr-4" @click="submitData" rounded>Submit</v-btn>

              </v-form>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>

</template>

<script>
export default {
  name: "ProfileCreation",

  computed: {
    brandModels() {
      return [this.carbrand];
    }
  },

  data() {
    return {
      carmodel: '',
      carbrand: '',
      realrange: 0,
      usableKwh: 0,
      allCarBrandsData: []
    }
  },

  methods: {
    async submitData() {

      const ref = this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid)
      const document = {
        carbrand: this.carbrand,
        carmodel: this.carmodel,
        realrange: this.realrange,
        usableKwh: this.usableKwh
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
    //responsive - breakpoints
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

    async getAllCarData(){
      return await fetch("/getAllCars").then(r => r.json())
    },

    async allCarBrands (body) {
      return  await fetch("/getCarBrands", {
        method : "DELETE",
        headers : {
          'Content-Type': 'application/json'
        },
        //body: body

      }).then(res => res.json())
      //return brands
    }

  },

  async created(){
    //const all= await this.getAllCarData();
    //console.log("all.data: ", all.data)
    this.allCarBrandsData = await this.allCarBrands();
  },

  //responsive
  beforeDestroy () {
    if (typeof window === 'undefined') return

    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  mounted () {
    this.onResize()

    window.addEventListener('resize', this.onResize, { passive: true })
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
  padding: 0rem 2rem 3rem;
}

form {
  padding: 1rem 0rem;

}

#subtitle_ {
  font-size: medium;
  padding-left: 0rem;
}


#submitButton {
  background: #398A0B !important;
  color: #fff !important;
  width: 10rem !important;
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
