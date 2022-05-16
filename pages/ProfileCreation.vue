<template>
  <v-container>
    <h1> ProfileCreation Page </h1>
    <v-btn @click="logout" >Log out</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  methods:{
    async logout(){
      await this.$fire.auth.signOut();
    }
  }
}
</script>

<style scoped>

</style>
