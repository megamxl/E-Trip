<template>
  <v-card>
  <div v-for="data in carData" v-bind:key="data.id">
    {{data.carList}}

  </div>
  </v-card>
</template>

<script>
import {carDataQuery} from "@/graphql/query";

export default {
  data() {
    return{
      carData: [],
    }
  },
  apollo:{
    carData:{
      prefetch: true,
      query: carDataQuery,
    }
  }
}
</script>

<style scoped>

</style>
