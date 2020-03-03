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
          <p class="subtitle-1">{{ $t('order.latestOrder.title') }}<v-divider></v-divider></p>

          <v-row>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-map-marker-outline</v-icon>
                {{ $t('order.latestOrder.location') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">欣2栋 211</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-account-tie-outline</v-icon>
                {{ $t('order.latestOrder.solver') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">Jason</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-phone</v-icon>
                {{ $t('order.latestOrder.solverTelephone') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">18790842913</p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1"><v-icon>mdi-bell-ring-outline</v-icon>
                {{ $t('order.latestOrder.status') }}
              </p>
            </v-col>
            <v-col
              cols="6"
            >
              <p class="body-1 text--primary">已完成</p>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="red"
            outlined
            style="margin: 0px 0px 10px 10px"
            @click="toCancelOrderDialog"
            :disabled="cancelDisabled"
            class="subtitle-2"
          >
            <v-icon left>mdi-close</v-icon> {{ $t('order.latestOrder.cancelOrder') }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            icon
            @click="showDetails = !showDetails"
            class="subtitle-2"
          >
            <v-icon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="showDetails">
            <v-card flat>
              <v-card-text>
                <p class="subtitle-1">{{ $t('order.latestOrder.orderInfo') }}<v-divider></v-divider></p>

                <v-row>
                  <v-col
                    cols="6"
                  >
                    <p class="subtitle-1"><v-icon>mdi-account-outline</v-icon>
                      {{ $t('order.latestOrder.name') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">Lolipop</p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1"><v-icon>mdi-domain</v-icon>
                      {{ $t('order.latestOrder.campus') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">沙河校区</p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1"><v-icon>mdi-cellphone</v-icon>
                      {{ $t('order.latestOrder.telephone') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">18980344000</p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1"><v-icon>mdi-forum-outline</v-icon>
                      {{ $t('order.latestOrder.description') }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                    <p class="body-1 text--primary">null</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </v-expand-transition>
      </v-card>
    </v-hover>

    <!-- 取消订单 Dialog -->
    <v-dialog v-model="cancelDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('order.latestOrder.cancelOrder') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                {{ $t('order.latestOrder.cancelOrderText') }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="info"
            @click="cancelDialog = false"
            class="subtitle-2"
          >{{ $t('order.latestOrder.cancel') }}</v-btn>
          <v-btn
            color="success"
            @click="cancelOrder"
            class="subtitle-2"
          >{{ $t('order.latestOrder.confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'LatestOrder',
  data: () => ({
    showDetails: false,
    cancelDialog: false,
    cancelDisabled: true
  }),
  methods: {
    toCancelOrderDialog () {
      this.cancelDialog = true
    },
    cancelOrder () {
      //
    }
  }
}
</script>
