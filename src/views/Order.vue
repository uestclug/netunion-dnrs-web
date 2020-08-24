<template>
  <div class="order mt-6 mb-6">
    <div v-if="role === GLOBAL.role.user">
      <LatestOrder/>
    </div>
    <div v-else-if="role === GLOBAL.role.solver">
      <OrderList/>
    </div>
  </div>
</template>

<script>
import LatestOrder from '@/components/Order/LatestOrder'
import OrderList from '@/components/Order/OrderList'

export default {
  data: () => ({
    role: null
  }),
  name: 'Order',
  components: {
    LatestOrder,
    OrderList
  },
  created () {
    this.Bus.$emit('tokenCheck')
    this.role = this.$store.state.role
  }
}
</script>
