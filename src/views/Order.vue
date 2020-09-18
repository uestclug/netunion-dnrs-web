<template>
  <div class="order mt-6 mb-6">
    <div v-if="role === GLOBAL.role.user">
      <LatestOrder />
    </div>
    <div v-else-if="role === GLOBAL.role.solver">
      <OrderList />
      <ExportOrderRecords />
    </div>
  </div>
</template>

<script>
import LatestOrder from '@/components/Order/LatestOrder'
import OrderList from '@/components/Order/OrderList'
import ExportOrderRecords from '@/components/Order/ExportOrderRecords'

export default {
  data: () => ({
    role: null
  }),
  name: 'Order',
  components: {
    LatestOrder,
    OrderList,
    ExportOrderRecords
  },
  created () {
    this.role = this.$store.state.role
  }
}
</script>
