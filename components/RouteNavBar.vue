<template>

  <v-app-bar>
    <v-btn v-show="!mobile" @click="toLanding"> E-Trip</v-btn>
    <v-spacer v-show="!mobile"/>

    <!-- mobile version: -->
    <v-container v-show="mobile" class="justify-start">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs"
                 v-on="on"
                 plain>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="toLanding">Home</v-list-item>
          <v-list-item @click="toNewRoutePage">New Route</v-list-item>
          <v-list-item @click="toProfile">Profile
            <v-icon> mdi-account</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>

    <v-btn v-show="!mobile" @click="toNewRoutePage"> New Route</v-btn>
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
    toProfile() {
      this.$router.push("/ProfilePage");
    },
    toLanding() {
      this.$router.push("/");
    },
    toNewRoutePage() {
      this.$router.push("/newRoute")
    },


    //responsive
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 600) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
    },
    updateScroll() {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        this.scrolledNav = true;
        return;
      }
      this.scrolledNav = false;
    }
  },
  data() {
    return {
      scrolledNav: null,
      mobile: true,
      mobileNav: null,
      windowWidth: null,
      collapseOnScroll: true
    }
  },
  created() {
    window.addEventListener('resize', this.checkScreen);
    this.checkScreen();
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  }
}
</script>

<style scoped>
#profile_ {
  color: #fff;
}

</style>
