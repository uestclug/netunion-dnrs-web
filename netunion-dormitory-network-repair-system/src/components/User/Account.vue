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

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-account-outline</v-icon>
                {{ $t('user.account.name') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">Snake</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-domain</v-icon>
                {{ $t('user.account.campus') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">沙河校区</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-map-marker-outline</v-icon>
                {{ $t('user.account.location') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">欣二栋 233</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p class="title"><v-icon>mdi-cellphone</v-icon>
                {{ $t('user.account.telephone') }}
              </p>
            </v-col>
            <v-col>
              <p class="title text--primary">18980442215</p>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-btn
            color="brown darken-1"
            outlined
            style="margin: 0px 0px 10px 10px"
          >
            <v-icon left>mdi-key-outline</v-icon>{{ $t('user.account.setting') }}
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
