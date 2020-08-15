<template>
  <v-container>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto"
        max-width="800"
      >
        <v-card-text>
          <p class="subtitle-1">{{ $t('user.statistics.title') }}<v-divider></v-divider></p>

          <v-simple-table>
            <tbody v-if="role === GLOBAL.role.user">
              <tr>
                <td>{{ $t('user.statistics.finishedOrderTime') }}</td>
                <td>{{ finishedOrderTime }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.firstOrderDate') }}</td>
                <td>{{ firstOrderDate }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.firstOrderSolver') }}</td>
                <td>{{ firstOrderSolver }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.lastOrderDate') }}</td>
                <td>{{ lastOrderDate }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.lastOrderSolver') }}</td>
                <td>{{ lastOrderSolver }}</td>
              </tr>
              <!--
              <tr>
                <td>{{ $t('user.statistics.unlockedSolver') }}</td>
                <td>2 人</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.bestSolver') }}</td>
                <td>Mary</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.bestSolverOrderedTime') }}</td>
                <td>3 次</td>
              </tr>
              -->
            </tbody>
            <tbody v-else-if="role === GLOBAL.role.solver">
              <tr>
                <td>{{ $t('user.statistics.finishedOrderTimeTotally') }}</td>
                <td>{{ finishedOrderTimeTotally }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.finishedOrderTimeMonthly') }}</td>
                <td>{{ finishedOrderTimeMonthly }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.firstOrderDate') }}</td>
                <td>{{ firstOrderDate }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.firstOrderUser') }}</td>
                <td>{{ firstOrderUser }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.lastOrderDate') }}</td>
                <td>{{ lastOrderDate }}</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.lastOrderUser') }}</td>
                <td>{{ lastOrderUser }}</td>
              </tr>
              <!--
              <tr>
                <td>{{ $t('user.statistics.unlockedUser') }}</td>
                <td>2 人</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.bestUser') }}</td>
                <td>Mary</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.bestUserOrderedTime') }}</td>
                <td>3 次</td>
              </tr>
              -->
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'Statistics',
  data: () => ({
    role: null,
    finishedOrderTime: '-',
    finishedOrderTimeTotally: '-',
    finishedOrderTimeMonthly: '-',
    firstOrderDate: '-',
    firstOrderUser: '-',
    firstOrderSolver: '-',
    lastOrderDate: '-',
    lastOrderUser: '-',
    lastOrderSolver: '-'
  }),
  created: async function () {
    this.role = this.$store.state.role
    let Response = null
    if (this.role === this.GLOBAL.role.user) {
      Response = await this.axios.post('/api/user/getUserStatisticsInfo')
      const statisticsInfo = Response.data
      if (statisticsInfo) {
        this.finishedOrderTime = statisticsInfo.finished_order_time
        this.firstOrderDate = statisticsInfo.first_finished_order_date
        this.firstOrderSolver = statisticsInfo.first_finished_order_solver_name
        this.lastOrderDate = statisticsInfo.latest_finished_order_date
        this.lastOrderSolver = statisticsInfo.latest_finished_order_solver_name
      }
    } else if (this.role === this.GLOBAL.role.solver) {
      Response = await this.axios.post('/api/user/getSolverStatisticsInfo')
      const statisticsInfo = Response.data
      if (statisticsInfo) {
        this.finishedOrderTimeTotally = statisticsInfo.finished_order_time_totally
        this.finishedOrderTimeMonthly = statisticsInfo.finished_order_time_monthly
        this.firstOrderDate = statisticsInfo.first_finished_order_date
        this.firstOrderUser = statisticsInfo.first_finished_order_user_name
        this.lastOrderDate = statisticsInfo.latest_finished_order_date
        this.lastOrderUser = statisticsInfo.latest_finished_order_user_name
      }
    }
  }
}
</script>
