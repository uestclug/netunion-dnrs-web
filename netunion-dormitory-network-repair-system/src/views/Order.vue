<template>
  <div class="order">
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
  beforeCreate () {
    this.Bus.$emit('tokenCheck')
  },
  created () {
    this.role = this.$store.state.role
  }
}
</script>
