<template>
  <v-main>
    <AppView style="cursor: default" />
  </v-main>
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
  }
}
</script>

<style lang="sass">
  @import '@/common/sass/main.scss'
</style>
