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
            @click="openBottomSheet"
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
  name: 'Welcome',
  methods: {
    openBottomSheet: async function () {
      const response = await this.axios.post('/api/user/checkToken', {
        id: localStorage.getItem('id')
      })
      if (response.data === true) {
        Bus.$emit('openBottomSheet', '')
      } else {
        Bus.$emit('setSnackbar', this.$i18n.t('login.tokenCheckFailed'))
        localStorage.removeItem('token')
        location.reload()
      }
    }
  }
}
</script>
