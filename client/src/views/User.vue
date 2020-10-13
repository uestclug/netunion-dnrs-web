<template>
  <div class="user">
    <div v-if="role === $GLOBAL.role.user || role === $GLOBAL.role.solver">
      <Account />
      <!-- 用户数据统计
      <Statistics v-if="false" class="mt-8" />
      -->
    </div>
  </div>
</template>

<script>
import Account from '@/components/User/Account'
// import Statistics from '@/components/User/Statistics'

export default {
  data: () => ({
    role: null
  }),
  name: 'User',
  components: {
    Account
    // Statistics
  },
  created () {
    this.role = this.$store.state.role
  }
}
</script>
