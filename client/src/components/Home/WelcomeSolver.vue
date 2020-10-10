<template>
  <v-container>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto transition-swing"
        max-width="800"
      >
        <v-card-text>
          <p class="subtitle-1">{{ $t('home.welcomeSolver.words') }}<v-divider></v-divider>
          </p>
          <p class="headline text--primary font-weight-medium">{{ $t('home.welcomeSolver.slogan') }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="success"
            style="margin: 0px 0px 10px 10px"
            @click="openCreateOrderSolverSheet"
          >
            <v-icon left>mdi-pencil</v-icon> {{ $t('order.createOrder.solver.create') }}
          </v-btn>
          <v-btn
            outlined
            color="blue-grey"
            style="margin: 0px 0px 10px 10px"
            router-link
            to="/Order"
          >{{ $t('order.viewAllOrders') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'WelcomeSolver',
  methods: {
    openCreateOrderSolverSheet () {
      this.$Bus.$emit('openCreateOrderSolverSheet')
    }
  }
}
</script>
