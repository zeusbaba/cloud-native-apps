<template>

  <v-card>
    <v-card-text>
      <h2>{{ $t('pos.info.title') }}</h2>
      <h3><em>{{ $t('pos.info.subtitle') }}</em></h3>

      <div class="text-xs-left">
        <p>
        <strong>BAET</strong> is an easy to use (and free!) service to
        Shorten & Simplify URLs!
        </p>
        <div>
          <dl>
            <dd>
              As a regular user of URL shortening services like
              <a
                  href="http://bit.ly"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                <em>bit.ly</em>
              </a>
              and
              <a
                  href="http://is.gd"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                <em>is.gd</em>
              </a>, recently I've decided to implement a simpler service,
              and happened to find even a cool domain name...
              <a href="/">
                <strong>BAET.no</strong>
              </a>! :-)
            </dd>
            <dd>
              <br />
              All features are composed by cherry-picking the common
              use-cases of existing providers, and customised according to
              my specific needs, and also adding some missing features. For
              example, I always wanted to have 'multiple custom names'
              assigned to a single URL, so <em>BAET.no</em> has this feature
              now! :)
            </dd>
            <dd>
              <br />
              Hereby, opening to this service the public... please use with
              care, and share!
            </dd>
          </dl>
        </div>

      </div>

    </v-card-text>

    <v-card-text>
      <h2>{{ $t('pos.faq.title') }}</h2>
      <h3><em>{{ $t('pos.faq.subtitle') }}</em></h3>
      <div class="text-xs-left">

        <h3>What is this?</h3>
        <p>
          It is an easy to use <em>(and free!)</em> service to Shorten &amp; Simplify URLs!
        </p>

        <h3>How does it work?</h3>
        <p>
          Give it a long URL/link, and it shortens it into a unique
          alphanumeric word of 6 characters. You can also simplify it by
          assigning human readable words.
          <br />For example;
          <br />long url:
          <em>
            <a
                href="https://www.youtube.com/user/MontyPython"
                target="_blank"
                rel="noopener noreferrer"
            >
              https://www.youtube.com/user/MontyPython
            </a>
          </em>
          <br />is shortened into
          <em>
            <a
                href="https://baet.no/gh80mh"
                target="_blank"
                rel="noopener noreferrer"
            >
              https://baet.no/gh80mh
            </a>
          </em>
          <br />and simplified into
          <em>
            <a
                href="https://baet.no/pythons"
                target="_blank"
                rel="noopener noreferrer"
            >
              https://baet.no/pythons
            </a>
          </em>
        </p>

        <h3>How can I signup?</h3>
        <p>
          There's NO signup! :-)
          <br />
          <strong>
            All you need is to access
            <em>
              <a href="/">baet.no</a>
            </em>
            using web-browser with cookies enabled
          </strong>
          <em>(which mostly is already enabled by default)</em>. Your
          links are identified using your active cookie, so that you can
          access them later using
          <em>
            <a href="/links">My Links</a>
          </em>
          menu.
        </p>

        <h3>How about the usage of stored data?</h3>
        <p>
          All shortened links are private and accessible via BAET
          clients (web, api etc). Sharing with others is completely at
          your choice.
          <br />We do not collect any personally identifying information
          from users of <em>baet.no</em> service, we respect your privacy! For
          details, see our
          <em>
            <a href="/terms">Privacy Policy</a>
          </em>.
        </p>

        <h3>reCAPTCHA?! but why?</h3>
        <div>
            First; <br/>
              Any open service has to deal with spammers
              <em>(not everyone is as cool as you!)</em>, and
              captcha is an effective way to handle such challenges.

            <br/>
            Second; <br/>
              reCaptcha is a nice initiative! yes, it gives you hard
              puzzles <em>(and sometimes annoyingly hard)</em> to solve,
              but all is with good purpose for value creation! see
              <a
                  href="https://www.google.com/recaptcha/intro/index.html#creation-of-value"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                Google-reCAPTCHA
              </a>
              for details.

        </div>
      </div>
    </v-card-text>
  </v-card>

</template>

<script>
  export default {
    name: "AboutFaq"
  }
</script>

<style scoped>

</style>