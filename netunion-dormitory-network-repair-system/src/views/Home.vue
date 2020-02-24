<template>
  <div class="home">
    <InfoNote/>
    <Welcome/>
    <LatestOrder/>
  </div>
</template>

<script>
import InfoNote from '@/components/Home/InfoNote'
import Welcome from '@/components/Home/Welcome'
import LatestOrder from '@/components/Home/LatestOrder'

export default {
  name: 'Home',
  components: {
    InfoNote,
    Welcome,
    LatestOrder
  }
}
</script>
