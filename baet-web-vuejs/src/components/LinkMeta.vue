<template>
  <v-card flat class="align-content-center">
    <!-- <v-card-title></v-card-title> -->
    <v-card-text>
      <v-container fluid class="pa-0">

        <v-layout row wrap>
          <v-flex>
            <v-btn
                v-for="simple_link in linkData.simple_links"
                color="blue-grey"
                class="white--text"
                :href=prepareUrl(simple_link)
                target="_blank"
              >
              {{ simple_link }}
              <v-icon right dark>launch</v-icon>
            </v-btn>
            <v-btn
                color="blue-grey"
                class="white--text"
                :href=prepareUrl()
                target="_blank"
            >
              {{ linkData['short_link'] }}
              <v-icon right dark>launch</v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs12>
            <v-btn flat icon
                   :href=linkData.long_link
                   target="_blank"
            >
              <v-icon>link</v-icon>
            </v-btn>
            <span style="font-size: xx-small; font-style: italic">
              {{ linkData.long_link }}
            </span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <!--
    <v-card-text>
      <span style="font-size: xx-small; font-style: italic">
          {{ linkData.long_link }}
      </span>
    </v-card-text>
    -->

    <v-card-text>
      <qrcode
          :value=prepareUrl()
          :options="{ size: 128 }" />
    </v-card-text>

    <v-card-actions>
      <v-btn fab dark color="primary">
        <v-icon dark>file_copy</v-icon>
      </v-btn>
      <v-btn fab dark color="indigo">
        <v-icon dark>timeline</v-icon>
      </v-btn>
      <v-btn fab dark color="teal">
        <v-icon dark>share</v-icon>
      </v-btn>
    </v-card-actions>

    <v-card-text v-if=isDev>
      linkData...<br/> {{ linkData }}
    </v-card-text>
  </v-card>
</template>
<!--
<template>
  <div>

    <md-card class="md-card">

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-5">
            <span>https://baet.no/...</span>
          </div>
          <div class="md-layout-item">
            <md-button
                v-for="simple_link in linkData.simple_links"
                class="md-primary">
                {{ simple_link }}
              <md-icon>launch</md-icon>
            </md-button>

            <md-button class="md-primary">
              {{ linkData.short_link }}
              <md-icon>launch</md-icon>
            </md-button>
          </div>
        </div>
      </md-card-content>

      <md-card-media-actions>
        <md-card-media>
          <qrcode
              :value=prepareUrl()
              :options="{ size: 128 }" />
        </md-card-media>

        <md-card-actions>
          <md-button class="md-icon-button md-raised md-primary">
            <md-icon>file_copy</md-icon>
          </md-button>

          <md-button class="md-icon-button md-raised md-primary">
            <md-icon>timeline</md-icon>
          </md-button>

          <md-button class="md-icon-button md-raised md-primary">
            <md-icon>share</md-icon>
          </md-button>
        </md-card-actions>
      </md-card-media-actions>

      <md-card-content>
        <md-button class="md-icon-button">
          <md-icon>link</md-icon>
        </md-button>
        <br/>
        <span style="font-size: xx-small; font-style: italic">
          {{ linkData.long_link }}
        </span>
      </md-card-content>

      <md-card-content v-if=isDev>
        linkData...<br/> {{ linkData }}
      </md-card-content>


    </md-card>
  </div>
</template>
-->

<style lang="scss" scoped>
  .md-card {
    width: 800px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>

<script>
  import { isDev } from '@/app-config';
  import VueQrcode from '@xkeshi/vue-qrcode';

  export default {
    name: "LinkMeta",
    data: () => ({
      isDev: isDev
    }),
    components: {
      qrcode: VueQrcode
    },
    //props: ['linkData']
    props: {
      isSingleItem: Boolean,
      linkData: Object
    },
    methods: {
      prepareUrl: function(val) {
        let theUrl = '';
        theUrl += 'https://baet.no/';
        if (val) {
          theUrl += val;
        }
        else {
          theUrl += this.linkData['short_link'];
        }

        //console.log(theUrl)
        return theUrl;
      }
    }
  }
</script>

