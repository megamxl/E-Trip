<template>
  <v-app>
    <v-content>
      <BasicNavBarLanding/>
    </v-content>

    <v-container fill-height fluid justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="4" align="center" width="700">
          <v-card id="cardArea" outlined dark>
            <v-card-title class="justify-center">
              <h3 id="h3_">Login to E-Trip</h3>
            </v-card-title>
            <v-card-subtitle id="subtitle_">Don't have an account?
             <v-btn @click="toSignUp" >Sign up</v-btn></v-card-subtitle>


            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="">
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
                outlined
                autocomplete="current-password"
                required
              >
              </v-text-field>

              <v-btn class="mr-4" @click="forgetPassword">Forgot your Password?</v-btn>

              <br>
              <v-btn id="loginButton" :disabled="!valid" class="mr-4" @click="login" rounded>Login</v-btn>


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
import BasicNavBarLanding from "~/components/BasicNavBarLanding";

export default {
  components: {
    BasicNavBarLanding,
  },
  layout: "plain",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
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
    login() {
      let formValidation = this.$refs.form.validate();
      if (formValidation) {
        this.$fire.auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
            const authUser = {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
            };
            this.$store
              .dispatch("onAuthStateChangedAction", {
                authUser,
              })
              .then(() => {
                this.$router.replace("/routepage");
              })
              .catch((error) => {
                console.log("User State error", error);
              });
          })
          .catch((error) => {
            console.log("Login error", error);
            this.snackbar = true;
            this.errorMessage = error.message;
          });
      }
    },
    forgetPassword() {
      console.log("clicked on forget password");
      this.$router.push("/auth/resetpassword");
    },
    toSignUp() {
      this.$router.push('/auth/signUp');
    },
  },
};
</script>

<style>
html {
  background: #121212;
}
#cardArea {
  padding: 4rem 3rem;
  border-radius: 20px;
}

form {
  padding: 2rem 0rem;

}

#subtitle_ {
  font-size: medium;
  color: #fff;
}


#loginButton {
  background: #7C4DFF;
  color: #fff;
  width: 10rem;
  margin-top: 3rem;
  margin-left: 0.1%;
}

#h3_ {
  font-weight: unset;
  font-size: x-large;
  margin-bottom: 2rem;
}


</style>
