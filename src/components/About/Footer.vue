<template>
  <div class="hideOnPhone">
    <v-footer
      fixed
      elevation=6
    >
      <v-spacer></v-spacer>
      <div>{{ $t('app.name') }} &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="sass">
  @import '@/common/sass/main.scss'
</style>
