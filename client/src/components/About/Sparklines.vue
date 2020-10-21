<template>
  <div>
    <v-card
      :elevation="2"
      class="mx-auto"
      max-width="800"
    >
      <v-toolbar
        flat
        class="body-1 pt-2"
      >
        <v-toolbar-title>{{ $t('about.sparklines.title') }}</v-toolbar-title>
        <v-divider class="mx-4" />
      </v-toolbar>

      <v-container
        v-if="loading"
        style="text-align: center;"
      >
        <div class="loadingio-spinner-ripple-s9nf2nweyv">
          <div class="ldio-62v9m71m4dc">
            <div></div>
            <div></div>
          </div>
        </div>
      </v-container>

      <v-container
        v-else
        class="text-center"
      >
        <div class="title teal--text">
          <v-icon color="teal">mdi-briefcase-plus-outline
          </v-icon>
          {{ $t('about.sparklines.createOrderSimple') }}
        </div>

        <v-sparkline
          :value="valueCreateOrder"
          :labels="valueCreateOrder"
          :smooth="radius || false"
          :padding="padding"
          :line-width="width"
          :stroke-linecap="lineCap"
          :fill="fill"
          :type="type"
          :auto-line-width="autoLineWidth"
          :label-size="labelSize"
          color="teal"
          auto-draw
        ></v-sparkline>

        <p class="body-1 mt-4 teal--text">
          {{ $t('about.sparklines.createOrder') }} {{ createOrderCount }} {{ $t('about.sparklines.orders') }}
        </p>

        <v-divider class="mx-4 mb-4" />

        <div class="title success--text">
          <v-icon color="success">mdi-briefcase-check-outline
          </v-icon>
          {{ $t('about.sparklines.finishOrderSimple') }}
        </div>

        <v-sparkline
          :value="valueFinishOrder"
          :labels="valueFinishOrder"
          :smooth="radius || false"
          :padding="padding"
          :line-width="width"
          :stroke-linecap="lineCap"
          :fill="fill"
          :type="type"
          :auto-line-width="autoLineWidth"
          :label-size="labelSize"
          color="success"
          auto-draw
        ></v-sparkline>

        <p class="body-1 mt-4 success--text">
          {{ $t('about.sparklines.finishOrder') }} {{ finishedOrderCount }} {{ $t('about.sparklines.orders') }}
        </p>

        <v-divider
          class="mx-4 mb-4"
          v-if="mvsolvers.length != 0"
        />

        <div
          class="title orange--text"
          v-if="mvsolvers.length != 0"
        >
          <v-icon color="orange">mdi-card-account-details-star-outline
          </v-icon>
          {{ $t('about.sparklines.contributor') }}
        </div>

        <v-row
          class="mt-4"
          v-if="mvsolvers.length != 0"
        >
          <template v-for="solver in mvsolvers">
            <v-col
              cols="auto"
              v-bind:key="solver.user_id"
              class="mx-auto"
            >
              <v-card
                elevation="1"
                max-width="300px"
              >
                <div class="ml-6 mr-6">
                  <div class="pt-6 text-h5 orange--text">
                    <span v-if="solver.nickname">
                      {{ solver.nickname }}
                    </span>
                    <span v-else>
                      {{ solver.name }}
                    </span>
                  </div>
                  <div class="text-subtitle-1 orange--text">{{ $t('about.sparklines.finishOrderSimple') }} {{ solver.finish_order_count }} {{ $t('about.sparklines.orders') }}</div>
                  <div class="pt-3 pb-6 text-body-2">
                    <span v-if="role === $GLOBAL.role.solver && solver.nickname">({{ solver.name }}) </span>
                    {{ solver.intro }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Sparklines',
  data: () => ({
    loading: true,
    role: null,
    width: 1,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    valueCreateOrder: [],
    createOrderCount: 0,
    valueFinishOrder: [],
    finishedOrderCount: 0,
    fill: false,
    type: 'trend',
    autoLineWidth: true,
    labelSize: 4,
    mvsolvers: []
  }),
  created () {
    this.role = this.$store.state.role
    if (this.$DevMode) {
      this.valueCreateOrder = this.$DevData.about.valueCreateOrder
      this.createOrderCount = this.$DevData.about.createOrderCount
      this.valueFinishOrder = this.$DevData.about.valueFinishOrder
      this.finishedOrderCount = this.$DevData.about.finishedOrderCount
      this.mvsolvers = this.$DevData.about.mvsolvers
      this.loading = false
      return
    }

    this.axios.post('/api/about/queryCreateOrderMonthly').then((Response) => {
      this.valueCreateOrder = Response.data.valueCreateOrder
      this.createOrderCount = Response.data.orderCount
    })
    this.axios.post('/api/about/queryFinishedOrderMonthly').then((Response) => {
      this.valueFinishOrder = Response.data.valueFinishOrder
      this.finishedOrderCount = Response.data.orderCount
    })
    this.axios.post('/api/about/queryMostValuableSolverMonthly').then((Response) => {
      this.mvsolvers = Response.data
      this.loading = false
    })
  }
}
</script>
