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
          <v-col cols="12" sm="8" md="6">
            <v-card>
              <v-card-title class="headline"> Your Profile</v-card-title>
              <v-card-text>
                <p>This page is only for you.</p>
                <p>Your e-mail is {{ user ? user.email : "" }}</p>

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

export default {
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut();
      this.$router.replace("/");
    },
    addACar() {
      this.$router.push('ProfileCreation');
    },
  },
};
</script>

<style>
</style>
