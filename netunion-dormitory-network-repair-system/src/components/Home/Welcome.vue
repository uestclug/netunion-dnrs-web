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
          <!--
          <v-btn
            color="success"
            outlined
            style="margin: 0px 0px 10px 10px"
          >
            <v-icon left>mdi-pencil</v-icon> {{ $t('home.welcome.order') }}
          </v-btn>
          -->
          <createOrder/>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-container>
</template>

<script>
import createOrder from '@/components/Order/createOrder'

export default {
  name: 'Welcome',
  components: {
    createOrder
  }
}
</script>
