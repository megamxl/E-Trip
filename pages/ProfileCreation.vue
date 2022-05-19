<template>
  <v-card>

    <v-form ref="form" lazy-validation>

      <v-text-field label="Car brand" v-model="carbrand" required></v-text-field>

      <v-text-field label="car model" v-model="carmodel" required></v-text-field>
      
      <v-text-field label="real range" v-model="realrange" required></v-text-field>

      <v-text-field label="usable-kwh" v-model="usableKwh" required></v-text-field>

      <v-btn color="success" class="mr-4" @click="submitData">Submit</v-btn>

    </v-form>
  </v-card>
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

</style>
