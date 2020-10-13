<template>
  <div>
    <v-footer
      fixed
      app
    >
      <!--
      <span>{{ $t('app.contactUs') }}83202112({{ $t('app.shahe') }})</span>
      -->
      <v-spacer></v-spacer>
      <span>{{ $t('app.name') }} &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
