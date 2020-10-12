<template>
  <div class="hideOnPhone">
    <v-footer
      absolute
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
