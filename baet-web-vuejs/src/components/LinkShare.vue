<template>

      <div>

        <v-menu>
          <v-btn fab dark left
                 color="teal" slot="activator">
            <v-icon dark>share</v-icon>
          </v-btn>
          <!--<v-btn
              slot="activator"
              color="primary"
              dark
          >
            Dropdown
          </v-btn> -->
          <v-list>
            <v-list-tile>
              <share-twitter has_icon
                             :page_url="shareUrl" :page_title="$t('pos.sharer.text')"
              ></share-twitter>
            </v-list-tile>
            <v-list-tile>
              <share-facebook has_icon
                              :page_url="shareUrl" :page_title="$t('pos.sharer.text')"
              ></share-facebook>
            </v-list-tile>
            <v-list-tile>
              <share-google has_icon
                            :page_url="shareUrl" :page_title="$t('pos.sharer.text')"
              ></share-google>
            </v-list-tile>
            <v-list-tile>
              <share-whatsapp has_icon
                              :page_url="shareUrl" :page_title="$t('pos.sharer.text')"
              ></share-whatsapp>
            </v-list-tile>
            <v-list-tile>
              <share-email has_icon
                           :page_url="shareUrl" :page_title="$t('pos.sharer.text')"
              ></share-email>
            </v-list-tile>
          </v-list>
        </v-menu>

      </div>

</template>

<script>
  import { myConfig, isDev } from '@/app-config'; // eslint-disable-line
  // https://koddr.github.io/vue-goodshare/en/using-component-bundle.html
  import VueGoodshareTwitter from "vue-goodshare/src/providers/Twitter.vue";
  import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue";
  import VueGoodshareGooglePlus from "vue-goodshare/src/providers/GooglePlus.vue";
  import VueGoodshareWhatsApp from "vue-goodshare/src/providers/WhatsApp.vue";
  import VueGoodshareEmail from "vue-goodshare/src/providers/Email";

  export default {
    name: "LinkShare",
    props: {
      linkData: Object
    },
    components: {
      'share-twitter': VueGoodshareTwitter,
      'share-facebook': VueGoodshareFacebook,
      'share-google': VueGoodshareGooglePlus,
      'share-whatsapp': VueGoodshareWhatsApp,
      'share-email': VueGoodshareEmail
    },
    data: () => ({
      socials: [
        {network: 'twitter', text: 'Twitter', icon: ''},
        {network: 'linkedin', text: 'LinkedIn', icon: ''},
        {network: 'facebook', text: 'Facebook', icon: ''},
        {network: 'whatsapp', text: 'WhatsApp', icon: ''},
        {network: 'email', text: 'email', icon: ''},
      ]
    }),
    computed: {
      shareUrl() {
        return myConfig.web.baseUrl + this.linkData['short_link'];
      },
    },
  }
</script>

<style scoped>

</style>