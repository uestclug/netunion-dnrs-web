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
            <tbody>
              <tr>
                <td>{{ $t('user.statistics.orderTime') }}</td>
                <td>{{ orderTime }}</td>
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
    orderTime: '-',
    firstOrderDate: '-',
    firstOrderSolver: '-',
    lastOrderDate: '-',
    lastOrderSolver: '-'
  }),
  created: async function () {
    const Response = await this.axios.post('/api/user/getUserStatisticsInfo', {
      id: localStorage.getItem('id')
    })
    const statisticsInfo = Response.data
    if (statisticsInfo !== false) {
      this.orderTime = statisticsInfo.finished_order_time
      this.firstOrderDate = statisticsInfo.first_finished_order_date
      this.firstOrderSolver = statisticsInfo.first_finished_order_solver_name
      this.lastOrderDate = statisticsInfo.latest_finished_order_date
      this.lastOrderSolver = statisticsInfo.latest_finished_order_solver_name
    }
  }
}
</script>
