<template>

  <v-card>
    <v-card-text>
      <h2>{{ $t('pos.developers.intro.title') }}</h2>
      <h3><em>{{ $t('pos.developers.intro.subtitle') }}</em></h3>

      <div class="text-xs-left">
        <em>
          Please make sure that you read &amp; understood
          <a href="/terms">
            <em>Privacy & Terms</em>
          </a>
        </em>
        <br />
        Let's begin... The easiest and fastest way to learn our APIs is by
        using
        <a
            href="https://www.getpostman.com"
            target="_blank"
            rel="noopener noreferrer"
        >
          <em> Postman</em>
        </a>. I've already prepared a postman collection for you! :-)
        <br />Here you can &gt;&gt;
        <a
            href="https://documenter.getpostman.com/view/2611563/RzfZPt3c"
            target="_blank"
            rel="noopener noreferrer"
        >
          <img
              src="https://run.pstmn.io/button.svg"
              alt="Run in Postman"
          />
        </a>
        <dl>
          <dd>
            To be able to use API endpoints (via Postman or so), you must
            have a valid AppToken!
            <br />You must pass this in the header as Authorization
            parameter! e.g.
            <ul>
              <li>
                <strong>Authorization=</strong> Bearer
                <em>&lt;yourApptoken&gt;</em>
              </li>
            </ul>
          </dd>
          <dd>
            Yes but... how can I get <em>AppToken</em>?
            <p>
              Just access this site using a web browser
              <em>(chrome, firefox, opera, ...)</em>, that's all!
            </p>
          </dd>
          <dd>
            <!--
            <v-btn dark color="grey" @click="doCopy">
              {{ $t('resources.links.buttons.copy.name') }}
              <v-icon medium>copy</v-icon>
            </v-btn>
            -->
            <v-btn color="grey lighten-2"
                    v-clipboard:copy="token"
                    v-clipboard:success="onCopyOk"
                    v-clipboard:error="onCopyError">
              {{ $t('resources.links.buttons.copy.name') }}
              <v-icon medium>file_copy</v-icon>
            </v-btn>

            <strong>your current AppToken</strong>
            <em>uniquely generated based on your active session!</em>
          </dd>
        </dl>
      </div>
    </v-card-text>
  </v-card>

</template>

<script>
  import { myConfig, isDev } from '@/app-config';
  const jwtHeaderName = myConfig.authentication.storageKey
      ? myConfig.authentication.storageKey
      : 'baet-jwt';
  export default {
    name: "Developers",
    data: () => ({
      token: ''
    }),
    mounted: function() {
      this.token = this.$warehouse.get(jwtHeaderName);
    },
    methods: {
      onCopyOk: function() {
        if (isDev) {
          console.log('onCopyOk... copied OK!!!')
        }
      },
      onCopyError: function() {
        if (isDev) {
          console.log('onCopyError... ERROR!!!')
        }
      },
      doCopy: () => {
        let token = this.$warehouse.get('baet-jwt');

        this.$copyText(token).then(
            function(e) {

              if (isDev) {
                console.log('doCopy... copied OK!!!')
              }
        }, function(e) {
              if (isDev) {
                console.log('doCopy... ERROR!!!')
              }
            })
      }
    }
  }
</script>

<style scoped>

</style>