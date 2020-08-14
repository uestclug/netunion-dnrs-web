<template>
  <div class="order">
    <h1>this is order page</h1>
  </div>
</template>

<script>
import Bus from '@/Bus'

export default {
  data: () => ({
    role: null
  }),
  name: 'Order',
  beforeCreate () {
    Bus.$emit('tokenCheck')
  },
  created () {
    this.role = this.$store.state.role
    console.log('order page role: ' + this.role)
  }
}
</script>
