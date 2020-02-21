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
          <p class="subtitle-1">{{ $t('home.orderOngoing.title') }}<v-divider></v-divider></p>
          <p class="title"><v-icon>mdi-clock-outline</v-icon> {{ $t('home.orderOngoing.freeTime') }}</p>
          <p class="title text--primary">2020/2/21 14:00 - 18:00等</p>
          <p class="title"><v-icon>mdi-map-marker-outline</v-icon> {{ $t('home.orderOngoing.location') }}</p>
          <p class="title text--primary">欣2栋 211</p>
          <p class="title"><v-icon>mdi-account-tie-outline</v-icon> {{ $t('home.orderOngoing.solver') }}</p>
          <p class="title text--primary">等待接单</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            outlined
            style="margin: 0px 0px 10px 10px"
          >
            <v-icon left>mdi-tag-outline</v-icon> {{ $t('home.orderOngoing.viewDetails') }}
          </v-btn>
          <v-btn
            color="blue-grey lighten-1"
            outlined
            style="margin: 0px 0px 10px 10px"
          >
            <v-icon left>mdi-grease-pencil</v-icon> {{ $t('home.orderOngoing.changeDetails') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'OrderOngoing'
}
</script>
