<template>

  <v-app>
    <v-content>
      <BasicNavBarLanding/>
    </v-content>


    <v-container fill-height fluid justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="4" width="700">
          <v-card id="cardArea" outlined dark>

            <v-img
              class="white--text align-end"
              height="200px"
              src="../car.jpg"
            >
              <v-card-title class="justify-center">
                <h3 id="h3_">Enter car details</h3></v-card-title>
            </v-img>
            <v-card-subtitle id="subtitle_">You can add further cars after the registration is completed.
            </v-card-subtitle>

            <v-form ref="form" lazy-validation>

              <v-text-field label="Car brand" v-model="carbrand" required outlined></v-text-field>

              <v-text-field label="Car model" v-model="carmodel" required outlined></v-text-field>

              <v-text-field label="Real range" v-model="realrange" required outlined></v-text-field>

              <v-text-field label="Usable-kwh" v-model="usableKwh" required outlined></v-text-field>

              <v-btn id="submitButton" color="success" class="mr-4" @click="submitData" rounded>Submit</v-btn>

            </v-form>
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

    }
  }
}
</script>

<style scoped>
html {
  background: #121212;
}

#cardArea {
  padding: 4rem 3rem;
  border-radius: 20px;
}

form {
  padding: 2rem 0rem;

}

#subtitle_ {
  margin-top: 2rem;
  font-size: medium;
  padding-left: 0rem;
}


#submitButton {
  background: #7C4DFF !important;
  color: #fff !important;
  width: 10rem !important;
  margin-top: 3rem;
  margin-left: 0.1%;
}

#h3_ {
  font-weight: unset;
  font-size: x-large;
  margin-bottom: 2rem;
}

</style>
