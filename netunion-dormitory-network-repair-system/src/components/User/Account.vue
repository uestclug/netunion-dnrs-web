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
          <p class="subtitle-1">{{ $t('user.account.title') }}<v-divider></v-divider></p>
          <p class="title"><v-icon>mdi-account-outline</v-icon> {{ $t('user.account.name') }}</p>
          <p class="title text--primary">Snake</p>
          <p class="title"><v-icon>mdi-gender-male-female</v-icon> {{ $t('user.account.sex') }}</p>
          <p class="title text--primary">男</p>
          <p class="title"><v-icon>mdi-map-marker-outline</v-icon> {{ $t('user.account.location') }}</p>
          <p class="title text--primary">欣二栋 233</p>
          <p class="title"><v-icon>mdi-cellphone</v-icon> {{ $t('user.account.telephone') }}</p>
          <p class="title text--primary">18980442215</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="info"
            style="margin: 0px 0px 10px 10px"
          >
            {{ $t('user.account.setting') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
export default {
  name: 'Account'
}
</script>
