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
          <p class="subtitle-1">{{ $t('home.welcome.words') }}同学<v-divider></v-divider></p>
          <p class="headline text--primary font-weight-medium">{{ $t('home.welcome.slogan') }}</p>
        </v-card-text>

        <v-card-actions>
          <CreateOrder/>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
import CreateOrder from '@/components/Order/CreateOrder'

export default {
  name: 'Welcome',
  components: {
    CreateOrder
  }
}
</script>
