<template>
  <div>
    <v-hover v-slot:default="{ hover }">
      <v-card :elevation="hover ? 4 : 2" class="mx-auto transition-swing" max-width="800">
        <v-toolbar flat class="body-1 pt-2">
          <v-toolbar-title>{{ $t('about.aboutUs.title') }}</v-toolbar-title>
          <v-divider class="mx-4" />
        </v-toolbar>

        <v-card-title>
          NETUNION
        </v-card-title>
        <v-card-subtitle>
          电子科技大学网络管理委员会
        </v-card-subtitle>
        <v-card-text class="body-1">
          <div>长期摸鱼，偶尔招新。</div>
          <div>
            联系我们：<a
              :href="emailLink"
              >recruit@dormforce.net</a
            >
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            class="ma-2"
            depressed
            :href="homePageLink"
            target="_blank"
          >
            <v-icon left>mdi-door-open</v-icon>
            {{ $t('about.aboutUs.home') }}
          </v-btn>
        </v-card-actions>

        <v-divider class="mx-4" />

        <v-card-title>
          NETUNION DNRS WEB
        </v-card-title>
        <v-card-subtitle>
          电子科技大学宿舍网络在线报修平台
        </v-card-subtitle>
        <v-card-text class="body-1">
          <span
            >Patch Version:
            <span @click="toChangeLog" style="cursor: pointer;"
              >{{ version }}<v-icon small right>mdi-open-in-new</v-icon>
            </span>
          </span>
        </v-card-text>

        <v-card-actions>
          <v-btn
            class="ma-2"
            depressed
            :href="issuesLink"
            target="_blank"
          >
            <v-icon left>mdi-github</v-icon>
            {{ $t('about.aboutUs.issues') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  data: () => ({
    version: process.env.VUE_APP_VERSION_CODE,
    emailLink: 'mailto:recruit@dormforce.net?body=MAIL FROM INTERNET REPAIR SYSTEM',
    homePageLink: 'https://uestclug.github.io',
    changeLogLink: 'https://github.com/uestclug/netunion-dnrs-web/blob/master/CHANGELOG.md',
    issuesLink: 'https://github.com/uestclug/netunion-dnrs-web/issues'
  }),
  methods: {
    toChangeLog () {
      window.open(
        this.changeLogLink
      )
    }
  }
}
</script>
