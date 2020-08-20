<template>
  <div class="about">
    <div class="mt-6 mb-15">
      <AboutUs/>
      <Sparklines/>
      <UpdateLog/>
      <Contact/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import AboutUs from '@/components/About/AboutUs'
import Sparklines from '@/components/About/Sparklines'
import UpdateLog from '@/components/About/UpdateLog'
import Contact from '@/components/About/Contact'
import Footer from '@/components/About/Footer'

export default {
  data: () => ({
    role: null
  }),
  name: 'About',
  components: {
    AboutUs,
    Sparklines,
    UpdateLog,
    Contact,
    Footer
  },
  created () {
    this.role = this.$store.state.role
  }
}
</script>
