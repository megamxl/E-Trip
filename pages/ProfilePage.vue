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
          <v-col cols="12" sm="10" md="8" lg="6" xl="5">
            <v-card>
              <v-img height="25vh" src="/tesla.webp">
                <div class="d-flex flex-column" id="translucentBackground">
                  <v-card-title id="font-size-4vw" class="mt-8"> Your Profile</v-card-title>
                  <v-card-subtitle> Welcome back {{name}} </v-card-subtitle>
                </div>
              </v-img>
              <div class="d-flex flex-column align-self-center">
              </div>

              <div class="d-flex flex-column">
                <h1 class="ma-4"> Personal Data </h1>
                <ProfilePageDataComponent text-left="Your Email:" :text-right="user ? user.email : 'Not set'"/>
                <ProfilePageDataComponent text-left="Last login:" :text-right="lastTimeLogedIn"/>
                <ProfilePageDataComponent text-left="Session Expiration:" :text-right="sessionExporation"/>
              </div>

              <hr>

              <div class="d-flex flex-column">
                <h1 class="ma-4"> Car Details </h1>
                <ProfilePageDataComponent text-left="Car Brand:" :text-right="carData.carbrand"/>
                <ProfilePageDataComponent text-left="Car Model:" :text-right="carData.carmodel"/>
              </div>

              <hr>

              <h1 class="ma-4"> Edit your Profile </h1>
              <v-card-text>
                <v-btn @click="addACar">Change your Car</v-btn>
              </v-card-text>
              <v-card-text>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header> Your Session Token</v-expansion-panel-header>
                    <v-expansion-panel-content> {{ sessionID }}</v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
              <v-card-text>
                <v-btn @click="newToken">Get New Token</v-btn>
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
import {doc, getDoc} from "firebase/firestore";


export default {
  /**
   * computed property just reacts of input during runtime
   * https://vuejs.org/guide/essentials/computed.html#basic-example
   * gets us the current user state
   */
  computed: {
    ...mapState(["user"]),
  },
  /**
   * local variables
   * @returns {{uID: string, lastTimeLogedIn: string, name: string, sessionExporation: string, carData: *[], sessionID: string}}
   */
  data() {
    return {
      carData: [],
      uID: "",
      sessionID: "",
      name: "",
      lastTimeLogedIn: "",
      sessionExporation: ""
    }
  },

  /**
   * when creating the website du async things we need on load
   * @returns {Promise<void>}
   */
  async created() {

    this.message = ""

    // get data from firebase with the current user loged in
    // retrieving data from firebase to display
    this.name = await this.$fire.auth.currentUser.getIdTokenResult().then(r => r.claims.name)
    const docRef = doc(this.$fire.firestore, "users", this.$fire.auth.currentUser.uid);

    const userData = await this.$fire.auth.currentUser.getIdTokenResult().then(r => r)

    this.sessionID = userData.token

    this.lastTimeLogedIn = userData.authTime
    this.sessionExporation = userData.expirationTime

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
    } catch (e) {
    }
  },
  methods: {

    /**
     * gives us a new local login  token to firebase
     * @returns {Promise<void>}
     */
    async newToken() {
      await this.$fire.auth.currentUser.getIdToken(true)
      this.sessionID = await this.$fire.auth.currentUser.getIdTokenResult().then(r => r.token)
    },
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.replace("/");
    },
    addACar() {
      this.$router.push('ProfileCreation');
    },
    //responsive - breakpoints
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'md':
          return 500
        case 'lg':
          return 600
        case 'xl':
          return 800
      }
    },
    //responsive
    onResize() {
      this.isMobile = window.innerWidth < 600
    },

  },
  //responsive
  beforeDestroy() {
    if (typeof window === 'undefined') return

    window.removeEventListener('resize', this.onResize, {passive: true})
  },
  //responsive
  mounted() {
    this.onResize()

    window.addEventListener('resize', this.onResize, {passive: true})
  },
};


</script>

<style scoped>

#font-size-4vw {
  font-size: max(3vw, 24px);
  margin-bottom: max(1vw, 10px);
}

#translucentBackground {
  background-color: rgba(0, 0, 0, 0.7);
  width: auto;
}

</style>
