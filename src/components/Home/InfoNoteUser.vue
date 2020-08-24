<template>
  <v-container>
    <v-card
      class="mx-auto"
      max-width="800"
    >
      <v-alert
        border="left"
        colored-border
        type="info"
      >
        {{ $t('home.infoNoteUser.note') }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'InfoNoteUser'
}
</script>
