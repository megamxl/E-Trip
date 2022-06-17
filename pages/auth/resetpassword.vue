<template>
  <v-app>
    <v-content>
      <BasicNavBarLanding/>
    </v-content>

    <v-container fill-height fluid justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="6" lg="6" xl="4" width="700">
          <v-card id="cardArea" outlined dark class="mx-auto">
            <v-card-title class="justify-center">
              <h3 id="h3_">Reset Password</h3>
            </v-card-title>
            <v-card-subtitle id="subtitle_">We will email you instructions to reset your password.</v-card-subtitle>
            <v-card-subtitle id="subtitle2_">Reset password link sent to</v-card-subtitle>
            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                type="email"
                label="Your E-mail"
                autocomplete="username"
                required
                outlined
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                class="mr-4"
                @click="resetPassword"
                id="resetButton"
                block
                x-large
                rounded
              >
                Reset Password
              </v-btn>
            </v-form>

            <v-btn id="backToLogin" class="mr-4" @click="toLogin">Return to Login</v-btn>

            <v-snackbar v-model="snackbar" color="error">
              {{ errorMessage }}
            </v-snackbar>

            <v-snackbar v-model="snackbarSuccess" color="success">
              {{ successMessage }}
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
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    snackbar: false,
    errorMessage: "",
    snackbarSuccess: false,
    successMessage: "",
  }),

  methods: {
    resetPassword() {
      let formValidation = this.$refs.form.validate();

      if (formValidation) {
        this.$fire.auth
          .sendPasswordResetEmail(this.email)
          .then(() => {
            this.snackbarSuccess = true;
            this.successMessage =
              "Reset Password link sent to your email address. Please check your inbox";
          })
          .catch((error) => {
            console.log("Reset Password error", error);
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
  padding: 3rem 3rem;
  border-radius: 20px;
}

form {
  padding: 0.5rem 0rem;

}

#subtitle_ {
  font-size: medium;
  padding-left: 0rem;
  margin-top: 1rem;
}
#subtitle2_ {
  padding-left: 0rem;
  margin-bottom: 0rem;
}


#resetButton {
  background: #7C4DFF !important;
  color: #fff !important;
  width: 10rem !important;
  margin: 1rem 0 3rem 0.1%;
}

#backToLogin {
  position: center;
  margin-bottom: 2rem;
}

#h3_ {
  font-weight: unset;
  font-size: x-large;
  margin-bottom: 1rem;
}

</style>
