<template>
  <div>
    <v-card class="mx-auto" max-width="800">
      <v-alert border="left" colored-border type="info">
        {{ $t('home.infoNoteUser.note') }}
      </v-alert>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'InfoNoteUser'
}
</script>
