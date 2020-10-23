<template>
  <v-snackbar
    top
    v-model="snackbar"
    :timeout=timeout
  >
    {{ snackbarText }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="blue"
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
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
    this.$Bus.$on('setSnackbar', (msg) => { // 弹出显示 msg 内容的 snackbar
      this.snackbarText = msg
      this.snackbar = true
    })
  }
}
</script>
