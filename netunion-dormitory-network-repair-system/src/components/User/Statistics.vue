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
          <p class="title">{{ $t('user.statistics.orderTime') }}</p>
          <p class="title text--primary">4 次</p>
          <p class="title">{{ $t('user.statistics.firstOrderDate') }}</p>
          <p class="title text--primary">2019/12/23</p>
          <p class="title">{{ $t('user.statistics.firstOrderSolver') }}</p>
          <p class="title text--primary">Jason</p>
          <p class="title">{{ $t('user.statistics.lastOrderDate') }}</p>
          <p class="title text--primary">2020/2/22</p>
          <p class="title">{{ $t('user.statistics.lastOrderSolver') }}</p>
          <p class="title text--primary">Mary</p>
          <p class="title">{{ $t('user.statistics.unlockedSolver') }}</p>
          <p class="title text--primary">2 人</p>
          <p class="title">{{ $t('user.statistics.bestSolver') }}</p>
          <p class="title text--primary">Mary</p>
          <p class="title">{{ $t('user.statistics.bestSolverOrderedTime') }}</p>
          <p class="title text--primary">3 次</p>
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
