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
          <p class="subtitle-1">{{ $t('home.welcomeUser.words') }}<v-divider></v-divider></p>
          <p class="headline text--primary font-weight-medium">{{ $t('home.welcomeUser.slogan') }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="success"
            outlined
            style="margin: 0px 0px 10px 10px"
            @click="openCreateOrderUserSheet"
          >
            <v-icon left>mdi-pencil</v-icon> {{ $t('order.createOrder.user.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'WelcomeUser',
  methods: {
    openCreateOrderUserSheet () {
      this.Bus.$emit('openCreateOrderUserSheet')
    }
  }
}
</script>
