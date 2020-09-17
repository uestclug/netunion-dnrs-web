<template>
  <v-app id="AppView">
    <!-- Drawer -->
    <v-navigation-drawer
      app
      v-model="drawer"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title mb-2 mt-2">
            {{ $t('app.shortName') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('home.welcomeUser.slogan') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mr-3 mb-1" />

      <v-list shaped>
        <v-list-item-group color="success">
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
              <v-icon>mdi-account-circle</v-icon>
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
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <v-card
          class="mx-auto"
          style="padding: 10px; text-align: center"
        >
        <v-icon>{{darkModeSwitch?'mdi-brightness-4':'mdi-brightness-7'}}</v-icon>
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
      <v-app-bar-nav-icon @click="changeLanguage">
        <v-icon>mdi-translate</v-icon>
      </v-app-bar-nav-icon>
      <!-- 小屏幕不显示语言选择器 -->
      <v-select
        v-model="defaultLanguage"
        :items="languages"
        hide-details
        @change="switchLanguage"
        style="max-width: 140px;"
        class="d-none d-sm-flex"
      >
      </v-select>
    </v-app-bar>

    <!-- Main View -->
    <router-view />

    <!-- Snackbar -->
    <Snackbar />

    <!-- USER: Create Oreder -->
    <CreateOrderUser />

    <!-- Solver: Create Oreder -->
    <CreateOrderSolver />

    <!-- Solver: Add Assignee -->
    <AssigneeDialog />

    <!-- Solver: Add Attendance -->
    <AttendanceDialog />

    <!-- Global Bus Methods -->
    <BusMethods />
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar'
import CreateOrderUser from '@/components/Order/CreateOrderUser'
import CreateOrderSolver from '@/components/Order/CreateOrderSolver'
import AssigneeDialog from '@/components/Order/AssigneeDialog'
import AttendanceDialog from '@/components/Order/AttendanceDialog'
import BusMethods from '@/components/BusMethods'

export default {
  name: 'AppView',
  components: {
    Snackbar,
    CreateOrderUser,
    CreateOrderSolver,
    AssigneeDialog,
    AttendanceDialog,
    BusMethods
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
  beforeCreate () {
  },
  created () {
    this.setDefaultLanguage()
    this.setDefaultMode()
  },
  mounted () {
    if (localStorage.getItem('token')) {
      this.Bus.$emit('tokenCheck')
    }
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
        localStorage.setItem('defaultLanguage', '简体中文')
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
    changeLanguage () { // 点击 icon 一键切换语言
      if (this.$i18n.locale === 'zh-CN') {
        this.$i18n.locale = 'en-US'
        this.defaultLanguage = 'ENGLISH'
        localStorage.setItem('defaultLanguage', 'ENGLISH')
      } else {
        this.$i18n.locale = 'zh-CN'
        this.defaultLanguage = '简体中文'
        localStorage.setItem('defaultLanguage', '简体中文')
      }
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
      } else {
        localStorage.setItem('defaultDarkMode', 'false')
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
