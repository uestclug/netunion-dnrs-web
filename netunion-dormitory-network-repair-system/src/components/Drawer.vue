<template>
  <v-app id="Drawer">
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

        <v-list-item router-link to="/Account">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t('viewTitle.account') }}</v-list-item-title>
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
    drawer: null
  })
}
</script>
