<template>
  <v-card flat class="align-content-center">
    <!-- <v-card-title></v-card-title> -->
    <v-card-text>
      <v-container fluid class="pa-0">

        <v-layout row wrap>
          <v-flex>
            <v-btn
                v-for="simple_link in linkData.simple_links"
                :key="simple_link"
                color="blue-grey"
                class="white--text"
                :href="simpleLinks[simple_link]"
                target="_blank"
              >
              <!-- :href="prepareUrl(simple_link)" -->
              {{ simple_link }}
              <v-icon right dark>launch</v-icon>
            </v-btn>
            <v-btn
                color="blue-grey"
                class="white--text"
                :href="shortLink"
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

    <v-card-text>
      <qrcode
          :value=prepareUrl()
          :options="{ size: 128 }" />
    </v-card-text>

    <v-card-actions>

      <!-- COPY -->
      <v-btn fab dark color="primary"
             v-clipboard:copy="prepareUrl()"
             v-clipboard:success="onCopyOk(prepareUrl())"
             v-clipboard:error="onCopyError(prepareUrl())">
        <v-icon dark>file_copy</v-icon>
      </v-btn>
      <!--
      <v-btn fab dark color="primary"
             @click="doCopy(prepareUrl())">
        <v-icon dark>file_copy</v-icon>
      </v-btn>
      -->

      <!-- STATS -->
      <v-btn v-if="!isSingleItem"
          fab dark color="indigo"
          :href="'/links/'+linkData['short_link']"
      >
        <v-icon dark>timeline</v-icon>
      </v-btn>

      <!-- SHARE -->
      <!--
      <v-btn fab dark color="teal">
        <v-icon dark>share</v-icon>
      </v-btn>
      -->
      <LinkShare
          :linkData="linkData"
        />

    </v-card-actions>

    <v-card-text>
      <LinkStats v-if="isSingleItem"
                 :linkId="linkData['_id']"
      />
    </v-card-text>

    <v-snackbar
        v-model="snackbar.active"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        bottom multi-line
    >
      <h3>{{ snackbar.text }}</h3>
      <v-btn
          flat
          @click="snackbar.active = false"
      >
        <v-icon medium>close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-card-text v-if=isDev>
      linkData...<br/> {{ linkData }}
      <br/> isSingleItem: {{isSingleItem}}
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
  /* .md-card {
    width: 800px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  } */
</style>

<script>
  import { myConfig, isDev } from '@/app-config'; // eslint-disable-line
  import LinkStats from '@/components/LinkStats';
  import LinkShare from '@/components/LinkShare';
  import VueQrcode from '@xkeshi/vue-qrcode';
  const diz = this;

  export default {
    name: "LinkMeta",
    data: () => ({
      isDev: isDev,
      snackbar: {
        active: false,
        timeout: 2000,
        color: 'info',
        text: ''
      },
    }),
    components: {
      qrcode: VueQrcode,
      LinkStats,
      LinkShare
    },
    props: {
      isSingleItem: Boolean,
      linkData: Object
    },
    computed: {
      shortLink() {
        return myConfig.web.baseUrl + this.linkData['short_link'];
      },
      simpleLinks() {
        let sLinks = {};
        this.linkData['simple_links'].forEach((simple_link) => {
          sLinks[simple_link] = myConfig.web.baseUrl+simple_link;
        });
        //console.log(JSON.stringify(sLinks));
        return sLinks;
      }
    },
    methods: {
      prepareUrl: function(val) {
        let theUrl = '';
        theUrl += myConfig.web.baseUrl; //'https://baet.no/';
        if (val) {
          theUrl += val;
        }
        else {
          theUrl += this.linkData['short_link'];
        }

        //console.log(theUrl)
        return theUrl;
      },
      onCopyOk: function(inData) {
        if (isDev) {
          //-console.log('onCopyOk... copied OK!!! -> ' + inData)
        }

        this.snackbar.text = this.$t('resources.links.buttons.copy.confirm') + inData;
        this.snackbar.color = 'success';
        this.snackbar.active = true;
      },
      onCopyError: function(inData) {
        if (isDev) {
          //-console.log('onCopyError... ERROR!!! -> ' + inData)
        }
      },
      doCopy: function(inData) {
        this.$copyText(inData).then(
            function(e) { // OK
              if (isDev) {
                //-console.log('doCopy... copied OK!!! -> ' + inData)
              }

              diz.snackbar.text = this.$t('resources.links.buttons.copy.confirm') + inData;
              diz.snackbar.color = 'success';
              diz.snackbar.active = true;
            },
            function(e) { // FAIL
              if (isDev) {
                //-console.log('doCopy... ERROR!!!')
              }
            }
        );
      }
    }
  }
</script>

