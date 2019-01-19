<template>
  <v-layout row fill-height>
    <v-flex>
      <v-tabs
          v-model="tabActive"
          centered
          color="blue-grey lighten-4"
          icons-and-text
        >
        <v-tabs-slider color="white"></v-tabs-slider>
        <v-tab
            v-for="tab in tabs"
            :key="tab.key"
            :href="`#tab-${tab.key}`"
        >
          {{ $t('pos.'+tab.key+'.title') }}
          <v-icon>{{ tab.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items
          v-model="tabActive"
        >
        <v-tab-item
            v-for="tab in tabs"
            :value="`tab-${tab.key}`"
            :key="tab.key"
        >
            <div v-if="tab.key === 'developers'">
              <AboutDevelopers></AboutDevelopers>
            </div>
            <div v-else-if="tab.key === 'terms'">
              <AboutTerms></AboutTerms>
            </div>
            <div v-else>
              <AboutFaq></AboutFaq>
            </div>
            <!-- <div v-else>
            {{ tab.name }}
            </div> -->
        </v-tab-item>
      </v-tabs-items>

    </v-flex>
  </v-layout>
</template>

<script>
  import { isDev } from '@/app-config';
  import AboutFaq from '@/components/AboutFaq';
  import Terms from '@/components/Terms';
  import Developers from '@/components/Developers';

  export default {
    name: "About",
    components: {
      AboutFaq,
      AboutTerms: Terms,
      AboutDevelopers: Developers
    },
    data: () => ({
      isDev: isDev,
      tabActive: 'tab-about',
      tabs: [
        {
          key: 'about',
          icon: 'info',
          //name: 'About & FAQ'
        },
        {
          key: 'terms',
          icon: 'lock',
          //name: 'Terms'
        },
        {
          key: 'developers',
          icon: 'code',
          //name: 'Developers'
        }
      ]
    })

  }
</script>