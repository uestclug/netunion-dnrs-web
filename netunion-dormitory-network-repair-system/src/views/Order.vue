<template>
  <div class="order">
    <h1>this is order page</h1>
  </div>
</template>

<script>
import Bus from '@/Bus'

export default {
  name: 'Order',
  created () {
    Bus.$emit('tokenCheck')
  }
}
</script>
