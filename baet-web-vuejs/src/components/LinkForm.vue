<template>

    <v-card>
      <v-card-text>

        <v-form>

          <v-text-field
              label="long_link"
              placeholder="Paste long link (url to shorten)"
              hint="e.g. https://www.youtube.com/user/MontyPython"
              persistent-hint
              v-model="form.long_link"
              :counter="long_link_len_max"
              required autofocus
              :error-messages="long_link_errors"
              @input="$v.form.long_link.$touch()"
              @blur="$v.form.long_link.$touch()"
          >
            <template slot="label">
              <v-icon style="vertical-align: middle">link</v-icon>
            </template>
          </v-text-field>

          <br/>
          <v-combobox
              label="simple_links"
              placeholder="add simple_links"
              hint="e.g. montypython"
              persistent-hint
              append-icon="transform"

              v-model="form.simple_links"
              :counter="simple_links_limit"

              multiple chips deletable-chips dense
              :error-messages="simple_links_errors"
              @change.passive="validateSimpleLinks"
            >
            <template slot="label">
              <v-icon style="vertical-align: middle">transform</v-icon>
            </template>
          </v-combobox>

          <br />
          <vue-recaptcha
              :sitekey="recaptcha_sitekey"
              ref="recaptcha"
              @verify="recaptchaVerify"
              @expired="recaptchaExpired"
          ></vue-recaptcha>
          <v-btn
              dark large color="primary"
              class="white--text"

              @click="validateForm"
            >
            <!-- :loading="sending"
              :disabled="sending" -->
            Shorten
            <v-icon right dark>transform</v-icon>
          </v-btn>
          <v-btn @click="clearForm">reset</v-btn>
        </v-form>
      </v-card-text>

      <v-snackbar
          v-model="snackbar"
          bottom
          :timeout="snackbar_timeout"
          vertical
      >
        {{ snackbar_text }}
        <v-btn
            color="pink"
            flat
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-card>

</template>


<script>
  import { myConfig, isDev } from '@/app-config';
  import feathersClient from '@/feathers-client';
  import VueRecaptcha from 'vue-recaptcha';

  import { validationMixin } from 'vuelidate'
  import {
    required,
    minLength,
    maxLength,
    //url,
    //alphaNum
  } from 'vuelidate/lib/validators';

  // custom validators
  import Validator from 'validator';
  //import isURL from 'validator/lib/isURL';
  //import isAlphanumeric from 'validator/lib/isAlphanumeric';
  //import isLength from 'validator/lib/isLength';

  //const isValidSimpleLink = (simpleLink) => helpers.regex(simpleLink, /^[a-zA-Z]*$/)
  const isValidSimpleLink = (simple_link) => {

    if (!Validator.isLength(simple_link, myConfig.diz.simple_link.len)) {
      return false;
    }
    else if (
        !Validator.isAlphanumeric(simple_link)
        && !(Validator.contains(simple_link, '_') || Validator.contains(simple_link, '-'))
      ) {
      return false;
    }
    return true;
  };
  const isValidUrl = (url) => Validator.isURL(url, myConfig.diz.long_link.validation);

  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'LinkForm',
    mixins: [validationMixin],
    components: {
      VueRecaptcha
    },
    data: () => ({
      form: {
        long_link: '',
        simple_links: [],
      },
      long_link_len_min: myConfig.diz.long_link.len.min,
      long_link_len_max: myConfig.diz.long_link.len.max,
      simple_links_limit: myConfig.diz.simple_link.limit,

      recaptcha_sitekey: myConfig.web.recaptcha.sitekey,
      recaptcha_verified: false,

      linkSaved: false,
      sending: false,
      lastSavedLink: null,

      snackbar: false,
      snackbar_text: '',
      snackbar_timeout: 2000
    }),
    validations: {
      form: {
        long_link: {
          required,
          isValidUrl,
          minLength: minLength(myConfig.diz.long_link.len.min),
          maxLength: maxLength(myConfig.diz.long_link.len.max)
        },
        simple_links: {
          maxLength: maxLength(myConfig.diz.simple_link.limit),
          $each: {
            minLength: minLength(myConfig.diz.simple_link.len.min),
            maxLength: maxLength(myConfig.diz.simple_link.len.max),
            //isValidSimpleLink,
            //alphaNum
          }
        }
      }

    },
    computed: {
      simple_links_errors () {
        const errors = [];

        /*if (!error) { // custom generated error
          errors.push(error);
        } */
        //!this.$v.form.simple_links.isValidSimpleLink
        //  && errors.push('INVALID isValidSimpleLink');

        if (!this.$v.form.simple_links.$dirty) return errors;

        !this.$v.form.simple_links.maxLength
          && errors.push('simple_links can contain max '+myConfig.diz.simple_link.limit+' items');


        return errors;
      },
      long_link_errors () {
        const errors = [];
        if (!this.$v.form.long_link.$dirty) return errors;

        !this.$v.form.long_link.required
          && errors.push('long_link is required.');

        !this.$v.form.long_link.isValidUrl
          && errors.push('long_link is NOT a proper url, e.g. it must begin with https://... but yours is: '+this.long_link);

        !this.$v.form.long_link.minLength
          && errors.push('long_link must be min '+myConfig.diz.long_link.len.min+' characters long');

        !this.$v.form.long_link.maxLength
          && errors.push('long_link must be max '+myConfig.diz.long_link.len.max+' characters long');

        return errors;
      },
    },
    methods: {
      ...mapActions('links', ['create']),
      recaptchaVerify (response) {
        if (isDev) {
          console.log('recaptchaVerify: ' + response);
        }

        feathersClient
          .service('validate_recaptcha')
          .create({ q: response })
          .then(result => {
            if (isDev) {
              console.log('result: ' + result);
            }
            this.recaptcha_verified = true;

          }).catch(e => this.recaptcha_verified = false); // eslint-disable-line
      },
      recaptchaExpired () {
        console.log('recaptchaExpired...')
      },
      recaptchaReset () {
        console.log('recaptchaReset...');
        this.$refs.recaptcha.reset(); // Direct call reset method
        this.recaptcha_verified = false;
      },
      validateSimpleLinks (simple_links) {
        //console.log(simple_links);

        let isValid = true;
        if (simple_links && simple_links.length>0) {

          if (simple_links.length > this.simple_links_limit) {
            isValid = false;
          }
          else {
            const simple_link = simple_links[simple_links.length - 1];
            isValid = isValidSimpleLink(simple_link);
            console.log(simple_link + ' | isValid: ' + isValid);
          }

          if (!isValid) {
            simple_links.splice(simple_links.length - 1, 1);
            // TODO: push custom error message
            //this.$v.form.simple_links.$error.invalidLink = true;
          }
        }

        return simple_links;
      },
      clearForm () {
        this.$v.$reset();
        this.recaptchaReset();
        this.form.long_link = null;
        this.form.simple_links = []
      },
      validateForm () {
        this.$v.$touch();

        this.snackbar_text = null;
        if (!this.recaptcha_verified) {
          this.snackbar_text = 'ReCAPTCHA must be validated!!!';
        }

        if (!this.$v.$invalid && this.recaptcha_verified) {
          this.submitForm()
        }
        else {
          this.snackbar_text = 'Some input is invalid!!!';
        }

        if (this.snackbar_text) {
          this.snackbar = true;
        }
      },
      submitForm () {
        this.sending = true;

        this.create(
            this.form
        )
        .then(resp => {
          console.log(JSON.stringify(resp));

          this.snackbar_text = 'Link is created OK! \n' + JSON.stringify(resp);
          this.snackbar = true;
          this.redirectToLink(resp);

          this.linkSaved = true;
          this.sending = false;
          this.clearForm();
        })
        .catch(error => {
          console.log('Error... ' + JSON.stringify(error));
        });
        /*
        window.setTimeout(() => {
          //this.lastSavedLink = `${this.long_link} ${this.simple_links}`;
          this.lastSavedLink = `${JSON.stringify(this.form)}`;
          console.log(this.lastSavedLink);

          this.linkSaved = true;
          this.sending = false;
          this.clearForm()
        }, 2000)
        */
      },
      redirectToLink (link_created) {
        if (isDev) {
          console.log('redirect to created link! ' + JSON.stringify(link_created))
        }
        this.$router.push({path: '/links'})
      }
    }
  }
</script>

<style lang="scss" scoped>

  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

  .shake-on-error /deep/ .md-duplicated {
    animation-name: shake;
    animation-duration: 0.5s;
  }
  @keyframes shake {
    0% { transform: translate(15px); }
    20% { transform: translate(-15px); }
    40% { transform: translate(7px); }
    60% { transform: translate(-7px); }
    80% { transform: translate(3px); }
    100% { transform: translate(0px); }
  }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>