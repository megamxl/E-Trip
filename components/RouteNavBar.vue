<template>
  <v-app-bar>
    <!--E-Trip Button is only shown if !mobile!! -->
    <v-btn v-show="!mobile" @click="toLanding"> E-Trip</v-btn>
    <v-spacer v-show="!mobile"/>

    <!-- mobile version: hamburgerMenu + Dropdown .... only shown if mobile!! -->
    <v-container v-show="mobile" class="justify-start ml-0 pl-0 mr-0 pl-0">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs"
                 v-on="on"
                 plain
                 id="hambugerMenu">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-btn>
        </template>
        <v-list class="mt-2" style="width: 100vw">
          <v-list-item @click="toLanding">Home</v-list-item>
          <v-list-item @click="toNewRoutePage">New Route</v-list-item>
          <v-list-item @click="toChargerSearch">Chargers near you</v-list-item>
          <v-list-item @click="toProfile">Profile
            <v-icon> mdi-account</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>

    <!--Buttons only shown if !mobile!! -->
    <v-btn v-show="!mobile" @click="toNewRoutePage"> New Route</v-btn>
    <v-spacer v-show="!mobile"/>
    <v-btn v-show="!mobile" @click="toChargerSearch">Chargers near you</v-btn>
    <v-spacer v-show="!mobile"/>
    <v-btn v-show="!mobile" id="profile_" @click="toProfile"> Profile
      <v-icon> mdi-account</v-icon>
    </v-btn>
  </v-app-bar>

</template>

<script>
export default {
  name: "NavBar",
  methods: {
    /**
     * Different route pushes
     */
    toProfile() {
      this.$router.push("/ProfilePage");
    },
    toLanding() {
      this.$router.push("/");
    },
    toNewRoutePage() {
      this.$router.push("/newRoute")
    },
    toChargerSearch() {
      this.$router.push("/MapBoxChargers")
    },


    //responsive - mobile Version starts with windowWidth 600;
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 600) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
    },
  },
  data() {
    return {
      //responsive
      mobile: true,
      windowWidth: null,
    }
  },

  //responsive
  created() {
    window.addEventListener('resize', this.checkScreen);
    this.checkScreen();
  },
}
</script>

<style scoped>
#profile_ {
  color: #fff;
}

#hambugerMenu {
  text-align: left;
}
</style>
