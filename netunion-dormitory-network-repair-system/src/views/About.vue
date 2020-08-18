<template>
  <div class="about">
    <AboutUs/>
    <Contact/>
    <Footer/>
  </div>
</template>

<script>
import AboutUs from '@/components/About/AboutUs'
import Contact from '@/components/About/Contact'
import Footer from '@/components/About/Footer'

export default {
  data: () => ({
    role: null
  }),
  name: 'About',
  components: {
    AboutUs,
    Contact,
    Footer
  },
  created () {
    this.role = this.$store.state.role
  }
}
</script>
