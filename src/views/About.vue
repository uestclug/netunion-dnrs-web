<template>
  <div class="about">
    <div>
      <AboutUs />
      <Sparklines class="mt-8" />
    </div>
    <Footer class="pt-4" />
  </div>
</template>

<script>
import AboutUs from '@/components/About/AboutUs'
import Sparklines from '@/components/About/Sparklines'
import Footer from '@/components/About/Footer'

export default {
  data: () => ({
    role: null
  }),
  name: 'About',
  components: {
    AboutUs,
    Sparklines,
    Footer
  },
  created () {
    this.role = this.$store.state.role
  }
}
</script>
