<template>
  <div class="home">
    <Welcome/>
    <OrderOngoing/>
  </div>
</template>

<script>
import Welcome from '@/components/Home/Welcome'
import OrderOngoing from '@/components/Home/OrderOngoing'

export default {
  name: 'Home',
  components: {
    Welcome,
    OrderOngoing
  }
}
</script>
