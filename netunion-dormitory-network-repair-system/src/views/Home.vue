<template>
  <div class="home">
    <InfoNote/>
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
  name: 'Home',
  components: {
    InfoNote,
    Welcome,
    LatestOrder
  },
  created () {
    Bus.$emit('tokenCheck')
  }
}
</script>
