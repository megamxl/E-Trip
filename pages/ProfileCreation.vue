<template>

  <v-app>
    <v-content>
      <BasicNavBarLanding/>
    </v-content>


    <v-container fill-height fluid justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="4" width="700">
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

                <v-text-field label="Car brand" v-model="carbrand" required outlined></v-text-field>

                <v-text-field label="Car model" v-model="carmodel" required outlined></v-text-field>

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

  data() {
    return {
      carmodel: '',
      carbrand: '',
      realrange: 0,
      usableKwh: 0
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
      } catch (e) {
        console.error(e)
      }

      //added by Christina - maybe incorrect
      this.$router.replace("/routepage");
      //end of added by Christina

    }
  }
}
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
  background: #7C4DFF !important;
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
