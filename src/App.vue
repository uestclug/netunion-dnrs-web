<template>
  <v-app id="AppView">
    <AppView style="cursor: default" />
  </v-app>
</template>

<script>
import AppView from '@/components/AppView'

export default {
  name: 'App',
  components: {
    AppView
  },
  beforeCreate () {
    const userId = localStorage.getItem('user_id')
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    if (userId != null && role != null && token != null) {
      this.$store.commit('setUserId', userId)
      this.$store.commit('setRole', role)
      this.$store.commit('setToken', token)
    }
  },
  created () {
    if (this.$DevMode) {
      console.log('You are now in DevMode, feel free to develop this website.')
      console.log('Patch version: ' + process.env.VUE_APP_VERSION_CODE)
    }
  }
}
</script>

<style lang="sass">
@import '@/common/sass/main.scss'
</style>
