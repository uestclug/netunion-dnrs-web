<template>
  <div class="user">
    <div v-if="role === GLOBAL.role.user || role === GLOBAL.role.solver">
      <Account/>
      <Statistics/>
    </div>
  </div>
</template>

<script>
import Account from '@/components/User/Account'
import Statistics from '@/components/User/Statistics'

export default {
  data: () => ({
    role: null
  }),
  name: 'User',
  components: {
    Account,
    Statistics
  },
  beforeCreate () {
    this.Bus.$emit('tokenCheck')
  },
  created () {
    this.role = this.$store.state.role
  }
}
</script>
