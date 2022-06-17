<template>
  <v-app>
    <v-content>
      <v-app-bar>
        <BasicNavBarLanding/>
        <v-spacer/>
          <v-btn @click="logout">Logout</v-btn>
      </v-app-bar>


      <v-container fill-width fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="6" lg="6" xl="4">
            <v-card>
              <v-card-title class="headline"> Your Profile</v-card-title>
              <v-card-text>
                <p>This page is only for you.</p>
                <p>Your e-mail is {{ user ? user.email : "" }}</p>

              </v-card-text>
              <v-card-text>
                <p>Your Car Data</p>
                <p>{{message}}</p>
                <p>Your Car Brand: {{carData.carbrand}}</p>
                <p>Your Car model: {{carData.carmodel}} </p>
                <p>Your Maximum range: {{carData.realrange}} </p>
              </v-card-text>
              <v-card-subtitle class="headline"> Edit your Profile</v-card-subtitle>
              <v-card-text>
                <v-btn @click="addACar">Add a Car</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </v-content>
  </v-app>
</template>

<script>
import {mapState} from "vuex";
import { doc, getDoc } from "firebase/firestore";



export default {
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      carData: []
    }
  },
  async fetch(){

    this.message =""
    const docRef = doc(this.$fire.firestore, "users", this.$fire.auth.currentUser.uid);
    try{
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.carData = docSnap.data()
        console.log("Document data:", docSnap.data());
      }else {
        this.message = "No data connected to your user"
        this.carData ={
          carcarbrand: "",
          carmodel:"",
          realrange: ""
        }
      }
    }catch(e){
    }
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.replace("/");
    },
    addACar() {
      this.$router.push('ProfileCreation');
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

<style>
</style>
