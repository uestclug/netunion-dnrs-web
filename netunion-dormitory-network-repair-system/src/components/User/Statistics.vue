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
                <td>4 次</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.firstOrderDate') }}</td>
                <td>2019/12/23</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.firstOrderSolver') }}</td>
                <td>Jason</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.lastOrderDate') }}</td>
                <td>2020/2/22</td>
              </tr>
              <tr>
                <td>{{ $t('user.statistics.lastOrderSolver') }}</td>
                <td>Mary</td>
              </tr>
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
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'Statistics'
}
</script>
