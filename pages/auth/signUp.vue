<template>
  <v-app>
    <v-content>
      <BasicNavBarLanding/>
    </v-content>


    <v-container fill-height fluid justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="6" lg="6" xl="4" align="center" width="700">
          <v-card id="cardArea" outlined dark>
            <v-card-title class="justify-center">
              <h3 id="h3_">Sign up for E-Trip</h3>
            </v-card-title>
            <v-card-subtitle class="subtitle_">To start with E-Trip, fill out the form below.</v-card-subtitle>

            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                type="text"
                label="Name"
                autocomplete="name"
                required
                outlined
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                type="email"
                label="E-mail"
                autocomplete="username"
                required
                outlined
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                label="Password"
                :type="show ?'text': 'password'"
                :append-icon="show ?'mdi-eye':'mdi-eye-off'"
                @click:append="show=!show"
                autocomplete="current-password"
                required
                outlined
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                class="mr-4"
                @click="createAccount"
                id="createButton"
                rounded
                block
                x-large
              >
                Create Account
              </v-btn>


              <v-card-subtitle class="subtitle_">Already have an account?
                <v-btn @click="toLogin">Login</v-btn>
              </v-card-subtitle>

            </v-form>

            <v-snackbar v-model="snackbar" color="error">
              {{ errorMessage }}
            </v-snackbar>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: "plain",
  /**
   * uses vue's data competent to work with data in html  https://vuejs.org/guide/essentials/component-basics.html#defining-a-component
   * and with this we use regexes to check if the user input is valid
   * @returns {{valid: boolean, password: string, name: string, nameRules: (function(*))[], passwordRules: (function(*))[], errorMessage: string, show: boolean, emailRules: (function(*))[], snackbar: boolean, email: string}}
   */
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 30) || "Name must be less than 10 characters",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must minimums 6 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    snackbar: false,
    errorMessage: "",
    show: false,
  }),

  methods: {
    /**
     * login function requires the firebase setup in nuxt config js
     * local checks for data correctness via regexes
     */
    createAccount() {
      let formValidation = this.$refs.form.validate();

      if (formValidation) {
        this.$fire.auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
            this.$fire.auth.currentUser
              .sendEmailVerification()
              .then(() => {
                // Email verification sent!
                // ...
              })
              .catch((error) => {});

            const currentUser = this.$fire.auth.currentUser;
            currentUser
              .updateProfile({
                displayName: this.name,
              })
              .then(() => {})
              .catch((error) => {});

            const authUser = {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
            };
            this.$store
              .dispatch("onAuthStateChangedAction", {
                authUser,
              })
              .then(() => {
                this.$router.replace("/ProfileCreation");
              })
              .catch((error) => {});
          })
          .catch((error) => {
            this.snackbar = true;
            this.errorMessage = error.message;
          });
      }
    },
    toLogin() {
      this.$router.push('/auth/Login');
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
html {
  background: #121212;
}
#cardArea {
  padding: 3rem 2rem 0rem;
  border-radius: 20px;
}

form {
  padding: 2rem 0rem;

}

.subtitle_ {
  font-size: medium;
}


#createButton {
  background: #398A0B !important;
  color: #fff !important;
  width: 15rem !important;
  margin-top: 1rem;
  margin-bottom: 2rem;
  margin-left: 2%;
}

#h3_ {
  font-weight: unset;
  font-size: x-large;
  margin-bottom: 2rem;
}

</style>
