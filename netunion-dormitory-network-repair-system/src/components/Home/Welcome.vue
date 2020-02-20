<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row
          :align="alignment"
          :justify="justify"
          style="height: 50px;"
        >
          <v-card
            v-for="n in 1"
            :key="n"
            class="ma-12 pa-12"
            outlined
            tile
          >
            Column
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      alignment: 'center',
      justify: 'center'
    }
  }
}
</script>
