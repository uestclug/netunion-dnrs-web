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
          <p class="subtitle-1">{{ $t('home.latestOrder.title') }}<v-divider></v-divider></p>

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-clock-outline</v-icon>
                {{ $t('home.latestOrder.freeTime') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">2020/2/21 14:00 - 18:00等</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-map-marker-outline</v-icon>
                {{ $t('home.latestOrder.location') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">欣2栋 211</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-account-tie-outline</v-icon>
                {{ $t('home.latestOrder.solver') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">等待接单</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-bell-ring-outline</v-icon>
                {{ $t('home.latestOrder.status') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">正在进行中</p>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            outlined
            style="margin: 0px 0px 10px 10px"
          >
            <v-icon left>mdi-tag-outline</v-icon> {{ $t('home.latestOrder.viewDetails') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'LatestOrder'
}
</script>
