<template>
  <v-container>
    <v-card
      :elevation="2"
      class="mx-auto"
      max-width="800"
    >
      <v-toolbar
        flat
        class="body-1 pt-2"
      >
        <v-toolbar-title>{{ $t('about.aboutUs.title') }}</v-toolbar-title>
        <v-divider class="mx-4" />
      </v-toolbar>

      <v-card-title>
        NetUnion
      </v-card-title>
      <v-card-subtitle>
        电子科技大学网络管理委员会
      </v-card-subtitle>
      <v-card-text class="body-1">
        <div>长期摸鱼，偶尔招新。</div>
        联系我们：<a href="mailto:recruit@dormforce.net?body=MAIL FROM INTERNET REPAIR SYSTEM">recruit@dormforce.net</a>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="ma-2"
          depressed
          href="https://github.com/uestclug/netunion-dnrs-web/issues"
          target="_blank"
        >
          <v-icon left>mdi-github</v-icon>
          {{ $t('about.aboutUs.issues') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'AboutUs'
}
</script>
