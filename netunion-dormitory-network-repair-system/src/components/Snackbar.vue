<template>
  <v-snackbar
    top
    v-model="snackbar"
    :timeout=timeout
  >
    {{ snackbarText }}
    <v-btn
      color="blue"
      text
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import Bus from '@/Bus.js'

export default {
  name: 'Snackbar',
  data: () => ({
    snackbar: false,
    timeout: 3000,
    snackbarText: 'Nothing ever happen'
  }),
  mounted () {
    Bus.$on('setSnackbar', (msg) => {
      this.snackbarText = msg
      this.snackbar = true
    })
  }
}
</script>
