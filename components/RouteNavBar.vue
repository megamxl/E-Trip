<template>
  <v-card class="overflow-hidden">
    <v-app-bar>
      <v-content>
        <BasicNavBarLanding/>
      </v-content>


      <v-btn @click ="toNewRoutePage"> New Route</v-btn>
      <v-spacer />

      <v-btn id="profile_" @click="toProfile"> Profile
        <v-icon> mdi-account </v-icon> </v-btn>
    </v-app-bar>
  </v-card>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    toProfile() {
      this.$router.push("/ProfilePage");
    },
    toLanding() {
      this.$router.push("/");
    },
    toNewRoutePage(){
      this.$router.push("/newRoute")
    }
  }
}
</script>

<style scoped>
  #profile_ {
    color: #fff;
  }
</style>
