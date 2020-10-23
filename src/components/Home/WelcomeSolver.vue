<template>
  <div>
    <v-hover
      v-slot:default="{ hover }"
      open-delay="200"
    >
      <v-card
        :elevation="hover ? 16 : 2"
        class="mx-auto transition-swing"
        max-width="800"
      >
        <v-card-text class="pb-2">
          <p class="subtitle-1">{{ $t('home.welcomeSolver.words') }}<v-divider></v-divider>
          </p>
          <p class="headline text--primary font-weight-medium">{{ $t('home.welcomeSolver.slogan') }}</p>

          <v-row>
            <v-col cols="auto">
              <v-btn
                color="success"
                @click="openCreateOrderSolverSheet"
                class="mr-2"
              >
                <v-icon left>mdi-pencil</v-icon> {{ $t('order.createOrder.solver.create') }}
              </v-btn>
              <v-btn
                outlined
                color="blue-grey"
                router-link
                to="/Order"
              >{{ $t('order.viewAllOrders') }}</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
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
