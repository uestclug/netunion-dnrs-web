<template>
  <div class="user mt-6 mb-6">
    <div v-if="role === GLOBAL.role.user || role === GLOBAL.role.solver">
      <Account />
      <Statistics v-if="false" />
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
  created () {
    this.role = this.$store.state.role
  }
}
</script>
