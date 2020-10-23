<template>
  <div>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto"
        max-width="800"
      >
        <v-toolbar
          flat
          class="body-1 pt-2"
        >
          <v-toolbar-title>{{ $t('user.statistics.title') }}</v-toolbar-title>
          <v-divider class="mx-4" />
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="statisticsHeaders"
            :items="statistics"
            hide-default-footer
          >
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
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
    lastOrderSolver: '-',
    unlockedUser: '-',
    bestUser: '-',
    bestUserOrderedTime: '-'
  }),
  created: async function () {
    this.role = this.$store.state.role
    if (this.$DevMode) {
      // todo: devmode funcitons
      return
    }

    let Response = null
    if (this.role === this.$GLOBAL.role.user) {
      Response = await this.axios.post('/api/user/getUserStatisticsInfo')
      const statisticsInfo = Response.data
      if (statisticsInfo) {
        this.finishedOrderTime = statisticsInfo.finished_order_time
        this.firstOrderDate = statisticsInfo.first_finished_order_date
        this.firstOrderSolver = statisticsInfo.first_finished_order_solver_name
        this.lastOrderDate = statisticsInfo.latest_finished_order_date
        this.lastOrderSolver = statisticsInfo.latest_finished_order_solver_name
      }
    } else if (this.role === this.$GLOBAL.role.solver) {
      Response = await this.axios.post('/api/user/getSolverStatisticsInfo')
      const statisticsInfo = Response.data
      if (statisticsInfo) {
        this.finishedOrderTimeTotally = statisticsInfo.finished_order_time_totally
        this.finishedOrderTimeMonthly = statisticsInfo.finished_order_time_monthly
        this.firstOrderDate = statisticsInfo.first_finished_order_date
        this.firstOrderUser = statisticsInfo.first_finished_order_user_name
        this.lastOrderDate = statisticsInfo.latest_finished_order_date
        this.lastOrderUser = statisticsInfo.latest_finished_order_user_name
        this.unlockedUser = statisticsInfo.unlocked_user
        this.bestUser = statisticsInfo.best_user
        this.bestUserOrderedTime = statisticsInfo.best_user_ordered_time
      }
    }
  },
  computed: {
    statisticsHeaders () { // 统计表格的头部
      const headers = [
        {
          text: this.$i18n.t('user.statistics.statisticsTitle'),
          align: 'start',
          sortable: false,
          value: 'statisticsTitle'
        },
        {
          text: this.$i18n.t('user.statistics.statisticsValue'),
          sortable: false,
          value: 'statisticsValue'
        }
      ]
      return headers
    },
    statistics () {
      let statistics
      if (this.role === this.$GLOBAL.role.user) {
        statistics = [
          {
            statisticsTitle: this.$i18n.t('user.statistics.finishedOrderTime'),
            statisticsValue: this.finishedOrderTime + this.$i18n.t('user.statistics.orders')
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.firstOrderDate'),
            statisticsValue: this.firstOrderDate
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.firstOrderSolver'),
            statisticsValue: this.firstOrderSolver
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.lastOrderDate'),
            statisticsValue: this.lastOrderDate
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.lastOrderSolver'),
            statisticsValue: this.lastOrderSolver
          }
        ]
      } else if (this.role === this.$GLOBAL.role.solver) {
        statistics = [
          {
            statisticsTitle: this.$i18n.t('user.statistics.finishedOrderTimeTotally'),
            statisticsValue: this.finishedOrderTimeTotally + this.$i18n.t('user.statistics.orders')
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.finishedOrderTimeMonthly'),
            statisticsValue: this.finishedOrderTimeMonthly + this.$i18n.t('user.statistics.orders')
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.firstOrderDate'),
            statisticsValue: this.firstOrderDate
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.firstOrderUser'),
            statisticsValue: this.firstOrderUser
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.lastOrderDate'),
            statisticsValue: this.lastOrderDate
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.lastOrderUser'),
            statisticsValue: this.lastOrderUser
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.unlockedUser'),
            statisticsValue: this.unlockedUser + this.$i18n.t('user.statistics.people')
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.bestUser'),
            statisticsValue: this.bestUser
          },
          {
            statisticsTitle: this.$i18n.t('user.statistics.bestUserOrderedTime'),
            statisticsValue: this.bestUserOrderedTime + this.$i18n.t('user.statistics.times')
          }
        ]
      }
      return statistics
    }
  }
}
</script>
