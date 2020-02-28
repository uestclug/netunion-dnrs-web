<template>
  <v-app id="AppView">
    <!-- Drawer -->
    <v-navigation-drawer
      app
      v-model="drawer"
    >
      <v-list>
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

      <template v-slot:append>
        <v-card
          class="mx-auto"
          style="padding: 10px; text-align: center"
        >
          {{ $t('theme.darkMode') }}
          <v-switch
            v-model="darkModeSwitch"
            color="cyan lighten-1"
            @change="changeMode"
            style="display: inline-block; margin: auto auto auto 20px"
          ></v-switch>
        </v-card>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      app
      hide-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $t($route.meta.viewTitle) }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon>
        <div class='hideOnPhone'>
          <v-select
            v-model="defaultLanguage"
            :items="languages"
            hide-details
            prepend-icon="mdi-translate"
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

    <!-- Main View -->
    <div style="margin: 40px 0px 40px 0px">
      <router-view></router-view>
    </div>

    <!-- Footer -->
    <!--
    <div class="hideOnPhone">
      <v-footer>
        <v-spacer></v-spacer>
        <div>{{ $t('app.name') }} &copy; {{ new Date().getFullYear() }}</div>
      </v-footer>
    </div>
    -->

    <!-- Snackbar -->
    <Snackbar/>
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar'

export default {
  name: 'AppView',
  components: {
    Snackbar
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    languages: [
      { text: '简体中文' },
      { text: 'ENGLISH' }
    ],
    darkModeSwitch: false
  }),
  created: function () {
    this.setDefaultLanguage()
    this.setDefaultMode()
  },
  methods: {
    setDefaultLanguage () { // 使用 localStorage 保存用户使用语言习惯
      const dl = localStorage.getItem('defaultLanguage')
      if (dl != null) {
        this.defaultLanguage = dl
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
      localStorage.setItem('defaultLanguage', id)
    },
    setDefaultMode () { // 使用 localStorage 保存界面夜间模式
      const ddm = localStorage.getItem('defaultDarkMode')
      if (ddm != null) {
        this.defaultDarkMode = ddm
        if (this.defaultDarkMode === 'true') {
          this.changeMode(true)
          this.darkModeSwitch = true
        } else {
          this.changeMode(false)
        }
      }
    },
    changeMode (value) { // 设置夜间模式
      localStorage.setItem('defaultDarkMode', value)
      if (value === true) {
        this.$vuetify.theme.dark = true
        this.$vuetify.theme.light = false
      } else {
        this.$vuetify.theme.dark = false
        this.$vuetify.theme.light = true
      }
    }
  }
}
</script>

<style lang="sass">
  @import '@/common/sass/main.scss'
</style>
