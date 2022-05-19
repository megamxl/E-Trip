<template>
  <v-card>

    <v-form ref="form" lazy-validation>

      <v-text-field label="Car brand" required></v-text-field>

      <v-text-field label="car model" required ></v-text-field>

      <v-text-field label="real range" required></v-text-field>

      <v-text-field label="usable-kwh" required></v-text-field>

      <v-btn color="success" class="mr-4" @click="submitData">Submit</v-btn>

    </v-form>
  </v-card>
</template>

<script>
export default {

  name: "ProfileCreation",
  data() {
    return {
      carBrandArray: {
        brands: ['BMW', 'Kia', 'Nissan', ' Tesla'],
        car: ['Tesla Model 3', "Audi E-Tron", "BMW I3S", "Citroen E-SpaceTourer"]
      }
    }
  },
  mounted() {
  },

  methods: {

    async logout() {
      await this.$fire.auth.signOut();
    },
    async submitData(){

      const ref = this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid)
      const document = {
        carbrand:  'Bmw',
        carmodel: 'I30',
        realrange:  '400',
        usableKwh : '50'
      }

      try {
        await ref.set(document)
      } catch (e) {
        console.error(e)
      }

      //(this.$fire.auth.currentUser.uid)
      console.log(this.$fire);
       return
    }
  }
}
</script>

<style scoped>

</style>
