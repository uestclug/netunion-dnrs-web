<template>
  <div class="user">
    <Account/>
    <Statistics/>
  </div>
</template>

<script>
import Bus from '@/Bus'
import Account from '@/components/User/Account'
import Statistics from '@/components/User/Statistics'

export default {
  name: 'User',
  components: {
    Account,
    Statistics
  },
  created () {
    Bus.$emit('tokenCheck')
  }
}
</script>
