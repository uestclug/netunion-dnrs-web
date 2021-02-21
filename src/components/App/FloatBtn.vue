<template>
  <v-fab-transition>
    <v-btn
      fixed
      fab
      dark
      bottom
      right
      :small="$vuetify.breakpoint.name == 'xs'"
      color="success"
      class="mb-3"
      v-show="scrollVal > 300"
      @click="backToTop"
    >
      <v-icon dark :small="$vuetify.breakpoint.name == 'xs'">mdi-arrow-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'FloatBtn',
  data: () => ({
    scrollVal: 0
  }),
  methods: {
    onScroll () {
      this.scrollVal = window.pageYOffset
    },
    backToTop () {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  }
}
</script>
