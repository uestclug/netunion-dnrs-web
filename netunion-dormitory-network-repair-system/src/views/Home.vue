<template>
  <div class="home">
    <InfoNote v-if="role === 'user'"/>
    <Welcome/>
    <LatestOrder/>
  </div>
</template>

<script>
import Bus from '@/Bus'
import InfoNote from '@/components/Home/InfoNote'
import Welcome from '@/components/Home/Welcome'
import LatestOrder from '@/components/Order/LatestOrder'

export default {
  data: () => ({
    role: null
  }),
  name: 'Home',
  components: {
    InfoNote,
    Welcome,
    LatestOrder
  },
  beforeCreate () {
    Bus.$emit('tokenCheck')
  },
  created () {
    this.role = this.$store.state.role
    console.log('home page role: ' + this.role)
  }
}
</script>
