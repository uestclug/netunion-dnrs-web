<template>
  <div class="about">
    <AboutUs/>
    <Contact/>
  </div>
</template>

<script>
import AboutUs from '@/components/About/AboutUs'
import Contact from '@/components/About/Contact'

export default {
  data: () => ({
    role: null
  }),
  name: 'About',
  components: {
    AboutUs,
    Contact
  },
  created () {
    this.role = this.$store.state.role
    console.log('about page role: ' + this.role)
  }
}
</script>
