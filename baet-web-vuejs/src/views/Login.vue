<template>
  <div class="login">
    <h4>Login/init page</h4>

    <div id="login-loader">
      <PacmanLoader
          :size="44" sizeUnit="px"
          color="#F5A623"
      />
    </div>
  </div>
</template>

<script>
  // https://github.com/Saeris/vue-spinners
  import { PacmanLoader } from '@saeris/vue-spinners'

  import packageJson from './../../package.json';
  import feathersClient from '@/feathers-client'; // eslint-disable-line
  import { myConfig, isDev, generateUUID } from '@/app-config'; // eslint-disable-line
  const jwtHeaderName = myConfig.authentication.storageKey
      ? myConfig.authentication.storageKey
      : 'baet-jwt';

  export default {
    name: 'login',
    components: {
      PacmanLoader
    },
    data: () => ({
      user: {},
      error: null
    }),
    watch: {
      error: function(val) {
        console.log('Error occured... ' + val)
      }
    },
    mounted: function(){
      this.checkToken();
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
      checkToken: function() {

        if (isDev) {
          console.log('check existing token')
        }

        const existingToken = this.$warehouse.get(jwtHeaderName);
        if (isDev) {
          console.log('existingToken: ' + existingToken)
        }

        if (!existingToken) {
          this.createUser()
        }
        else {
          this.redirectUser()
        }
      },
      createUser() {
        if (isDev) {
          console.log('create new user')
        }
        // create new user with generated UUID
        this.user['userid'] = generateUUID()
        this.user['appInfo'] = {
          name: packageJson.name,
          version: packageJson.version,
          engines: packageJson.engines
        }

        if (isDev) {
          console.log('creating user: ' + JSON.stringify(this.user))
        }

        feathersClient
          .service('users')
          .create({
            userid: this.user['userid'],
            password: this.user['userid'],
            extra: this.user['appInfo'],
          })
          .then(() => {
            this.loginUser();
          })
          .catch(e => this.error = { registerError: e });
      },
      loginUser() {

        if (isDev) {
          console.log('login user')
        }

        feathersClient
          .authenticate({
            strategy: 'local',
            userid: this.user['userid'],
            password: this.user['userid']
          })
          .then(() => this.redirectUser())
          .catch(e => this.error = { signInError: e });
      },
      redirectUser() {
        if (isDev) {
          console.log('redirect authenticated user')
        }
        this.$router.push({path: '/'})
      }
    }
  }
</script>