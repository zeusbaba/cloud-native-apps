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
              <v-icon>transform</v-icon>
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
              <v-icon>link</v-icon>
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

      </v-list>

    </v-navigation-drawer>

    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>BAET :: Shorten & Simplify</v-toolbar-title>
    </v-toolbar>
    <!--
    <v-toolbar clipped-left app absolute>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>BAET :: Shorten & Simplify</v-toolbar-title>
    </v-toolbar>
    -->

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer class="justify-center" color="indigo" app>
      <span class="white--text">&copy; 2018-2019 BAET.no</span>
    </v-footer>
  </v-app>
</template>

<!--
  <div id="app">

    <div id="nav">
      <router-link to="/login">Login</router-link> |
      <router-link to="/link">Shorten</router-link> |
      <router-link to="/links">My Links</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>

  </div>
-->

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

  export default {
    name: 'app',
    data: () => ({
      token: null,
      drawer: null,
      //menuVisible: false
    }),
    watch: {
      token: function() {
        if (!this.token
            && ('login' !== this.$router.currentRoute.name)
        ) {
          console.log('Token doesnt exists... go back to login!!!')
          this.$router.push('/login')
        }
      }
    },
    updated: function() {
      console.log('current page...' + this.$router.currentRoute.name);
      this.checkToken()
    },
    methods: {
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
