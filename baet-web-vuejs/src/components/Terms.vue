<template>

  <v-card>
    <v-card-text>
      <h2>{{ $t('pos.terms.intro.title') }}</h2>
      <h3><em>{{ $t('pos.terms.intro.subtitle') }}</em></h3>

      <div class="text-xs-left">

        <p>
          We do not collect any personally identifying information from
          users of this service. We store only the information necessary
          to provide our URL shortening service (such as original long
          URLs), information necessary to identify and track abuse of our
          service (such as IP addresses) and aggregate information to
          compile statistics on how individual links are used (such as
          browser and country of residence).
        </p>
        <p>
          We do not share information with 3rd parties except where
          required to identify or track abuse or prevent future abuse
          (e.g. we may check submitted URLs against 3rd party blacklists
          and may share information on malicious URLs or abusive users
          with 3rd parties). The sole exception to this is when you create
          a QR code - we pass the relevant shortened URL (but no other
          data) to Google since we use their Charts API to generate these.
        </p>
        <p>
          URLs shortened by this service are not private and should not be
          treated as such. Third parties could easily guess the short URL
          that you are using, so you should not use BAET service to link
          to sensitive or secure data.
        </p>
        <p>
          Anonymous statistics on shortened URLs you create (such as
          number of visits to them, creation date etc.) are not treated as
          private and will be made available to anyone through the site.
        </p>

        <mark>
          This <strong>Privacy/T&C</strong> is an adaptation from
          <a
              href="http://is.gd/privacy.php"
              target="_blank"
              rel="noopener noreferrer"
          >
            <em>is.gd</em>
          </a>
          service <em>(thanks to them for leading the way!).</em>
        </mark>
      </div>
    </v-card-text>

    <v-card-text>
      <h2>{{ $t('pos.terms.tc.title') }}</h2>
      <h3><em>{{ $t('pos.terms.tc.subtitle') }}</em></h3>

      <div class="text-xs-left">
        this service may <strong>NOT</strong> be used creating
        shortened URLs that: -
        <ul>
          <li>
            Are used for unsolicited advertising (spam) including
            email, forum posts, SMS messages and spam posts/messaging
            on social networks such as Facebook or Twitter
          </li>
          <li>
            Link to malicious content (phishing, viruses, trojans,
            adware, any other malware)
          </li>
          <li>Link to any form of child pornography</li>
          <li>
            Link to other URL shortening or redirection sites (these
            "chains" of links are often used to hide malicious usage)
          </li>
          <li>Link to material that infringes copyright</li>
          <li>
            Link to material we consider unethical including but not
            limited to "get rich quick" schemes, pyramid schemes, paid
            "self help" schemes, dubious competitions, sites requiring
            users to fill out paid surveys and sites with a model that
            encourages users to spam others (e.g. "Sign up 10 members
            to get X free")
          </li>
        </ul>
        <p>
          <strong>If you want to report abuse or spam usage</strong>
            then plz email us at
            <a href="mailto:reportabuse@baet.no">
              <em>reportabuse@baet.no</em>
            </a>
        </p>
      </div>

      <div class="text-xs-left">

        <h3>URL rejection and removal</h3>
        <p>
          We can reject URLs when they are submitted or later remove,
          disable or redirect shortened URLs for any reason. Our
          intention is only to do this where they violate our terms or
          the spirit of fair usage, or we have reason to suspect they do
          (e.g. if they appear on a blacklist we consult).
          <br />
          <strong>
            Please note that all urls/links are checked using
            <em>
              <a
                  href="http://phishtank.com"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                PhishTank (by OpenDNS)
              </a>
            </em>
            database, and can be rejected if identified as spam!
          </strong>
        </p>

        <h3>Warranty and liability</h3>
          <em>The short version:</em>
          <p>
            <strong>this service is free!</strong> We'll do our best
            to maintain it but we might have problems or things might
            break. If they do, life still goes on.

            <br/><br/>
            <em>The long version:</em> <br/>
            we provide it as a free service - as such it carries no
            warranty of any kind. Baet.no and its staff and owners are
            not liable for any loss or problem you might suffer due to
            using the service.
            This includes losses in the event that the service
            stops operating, is unavailable or slow, suffers data
            loss, or any other issue which might be considered
            detrimental to you.
          </p>

        <h3>In case of violation</h3>
        <p>
          If you violate these terms, depending on the severity of the
          abuse, we may disable shortened URLs you have created or block
          you from using baet.no temporarily or permanently.
        </p>

      </div>
    </v-card-text>
  </v-card>

</template>

<script>
  export default {
    name: "Terms"
  }
</script>

<style scoped>

</style>