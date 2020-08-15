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
          <p class="subtitle-1">{{ $t('home.welcome.words') }}<v-divider></v-divider></p>
          <p class="headline text--primary font-weight-medium">{{ $t('home.welcome.slogan') }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="success"
            outlined
            style="margin: 0px 0px 10px 10px"
            @click="openOrderSheet"
          >
            <v-icon left>mdi-pencil</v-icon> {{ $t('order.createOrder.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
import Bus from '@/Bus'

export default {
  name: 'WelcomeUser',
  methods: {
    openOrderSheet: function () {
      Bus.$emit('openOrderSheet')
    }
  }
}
</script>
