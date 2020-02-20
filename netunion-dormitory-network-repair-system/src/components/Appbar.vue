<template>
  <v-app id="Appbar">
    <v-navigation-drawer
      app
      v-model="drawer"
    >
      <v-list dense>
        <v-list-item router-link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t('viewTitle.home') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router-link to="/User">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t('viewTitle.user') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router-link to="/Order">
          <v-list-item-action>
            <v-icon>mdi-clipboard-check-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t('viewTitle.order') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router-link to="/About">
          <v-list-item-action>
            <v-icon>mdi-iframe</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t('viewTitle.about') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="white"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $t($route.meta.viewTitle) }}</v-toolbar-title>
      <!--
      <v-spacer></v-spacer>
      <v-toolbar-title>
        <div class='hideOnPhone'>{{ $t('app.name') }}</div>
      </v-toolbar-title>
      -->
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon>
        <div class='hideOnPhone'>
          <v-select
            v-model="defaultLanguage"
            :items="languages"
            menu-props="auto"
            hide-details
            prepend-icon="mdi-translate"
            single-line
            @change="switchLanguage"
            style="width: 140px; margin: auto 120px auto auto"
          >
          </v-select>
        </div>
        <div class="showOnlyOnPhone">
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
              >
                <v-icon>mdi-translate</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(language, i) in languages"
                :key="i"
                @click="switchLanguage(language.text)"
              >
                <v-list-item-title>{{ language.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar-nav-icon>
    </v-app-bar>

    <v-container>
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    languages: [
      { text: '简体中文' },
      { text: 'ENGLISH' }
    ]
  }),
  created: function () {
    this.setDefaultLanguage()
  },
  methods: {
    setDefaultLanguage () { // 使用 cookies 保存用户使用语言习惯
      if (this.$cookies.isKey('defaultLanguage')) {
        this.defaultLanguage = this.$cookies.get('defaultLanguage')
        if (this.defaultLanguage === '简体中文') {
          this.$i18n.locale = 'zh-CN'
        } else if (this.defaultLanguage === 'ENGLISH') {
          this.$i18n.locale = 'en-US'
        }
      } else {
        this.defaultLanguage = '简体中文'
      }
    },
    switchLanguage (id) { // 选择语言
      // console.log('value: ', id)
      if (id === '简体中文') {
        this.$i18n.locale = 'zh-CN'
      } else if (id === 'ENGLISH') {
        this.$i18n.locale = 'en-US'
      }
      this.$cookies.set('defaultLanguage', id)
    }
  }
}
</script>

<style lang="sass">
  @import '@/common/sass/main.scss'
</style>
