<template>
  <v-app id="baet-app">
    <v-navigation-drawer
        v-model="drawer"
        mini-variant
        permanent
        light
        clipped
        app
      >
      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
            key="link"
            to="/link"
        >
          <v-list-tile-action>
            <v-btn color="primary">
              <v-icon large>transform</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Shorten</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
            key="links"
            to="/links"
        >
          <v-list-tile-action>
            <v-btn color="primary">
              <v-icon large>list</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>My Links</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
            key="about"
            to="/about"
        >
          <v-list-tile-action>
            <v-btn color="primary">
              <v-icon>info</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!--
        <v-list-tile
            key="locale"
        >
          <div>
            <select v-model="$i18n.locale">
              <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
                {{ lang }}
              </option>
            </select>
          </div>
        </v-list-tile>
        -->

      </v-list>

    </v-navigation-drawer>

    <v-toolbar color="secondary" dark fixed app>
      <v-toolbar-title>{{ $t('pos.header.title') }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="changeLocale('nb')">
        <country-flag country='no'
                      :size="getLocale()==='nb'?'normal':'small'"
        ></country-flag>
      </v-btn>
      <v-btn icon @click="changeLocale('en')">
        <country-flag country='gb'
                      :size="getLocale()==='en'?'normal':'small'"
        ></country-flag>
      </v-btn>

    </v-toolbar>
    <!--
    <v-toolbar clipped-left app absolute>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>BAET :: Shorten & Simplify</v-toolbar-title>
    </v-toolbar>
    -->

    <v-content>
      <v-container fluid text-xs-center>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer class="justify-center" color="secondary" app>
      <span class="white--text">&copy; 2018-2019 BAET.no</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss" scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
  }

</style>

<script>
  import { myConfig, isDev } from '@/app-config';
  const jwtHeaderName = myConfig.authentication.storageKey
      ? myConfig.authentication.storageKey
      : 'baet-jwt';
  import CountryFlag from 'vue-country-flag'
  export default {
    name: 'app',
    components: {
      CountryFlag
    },
    data: () => ({
      token: null,
      drawer: null,
      //menuVisible: false
      langs: ['nb','en']
    }),
    watch: {
      token: function() {
        if (!this.token
            && ('login' !== this.$router.currentRoute.name)
        ) {
          if (isDev) {
            console.log('Token doesnt exists... go back to login!!!');
          }
          this.$router.push('/login')
        }
      }
    },
    updated: function() {
      if (isDev) {
        console.log('current page...' + this.$router.currentRoute.name);
      }
      this.checkToken()
    },
    mounted: function(){
      this.checkLocale();
    },
    methods: {
      checkLocale: function() {
        let locale = this.$warehouse.get('locale');
        if (locale === undefined) {
          locale = 'nb';
          this.$warehouse.set('locale', locale);
        } // default
        this.$i18n.locale = locale;
      },
      changeLocale: function(locale) {
        this.$i18n.locale = locale;
        this.$warehouse.set('locale', locale);
      },
      getLocale: function() {
        return this.$i18n.locale
      },
      checkToken: function () {

        this.token = this.$warehouse.get(jwtHeaderName);

        if (isDev) {
          console.log('check existing token... ');
        }
      }
      /*toggleMenu () {
        this.menuVisible = !this.menuVisible
      }*/
    }
  }
</script>
