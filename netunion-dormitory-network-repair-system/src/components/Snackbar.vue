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
export default {
  name: 'Snackbar',
  data: () => ({
    snackbar: false,
    timeout: 3000,
    snackbarText: 'Nothing ever happened'
  }),
  mounted () {
    this.Bus.$on('setSnackbar', (msg) => { // 弹出显示 msg 内容的 snackbar
      this.snackbarText = msg
      this.snackbar = true
    })
  }
}
</script>
