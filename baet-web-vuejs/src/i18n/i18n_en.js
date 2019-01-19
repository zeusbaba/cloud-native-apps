export default {
  pos: {
    search: 'Search',
    sharer: {
      text: 'Shorten & Simplify Links via BAET.no',
      hashtags: 'urlshortener, shortlink',
    },
    header: {
      title: 'BAET.no :: Shorten & Simplify Links!',
      description:
          'URL shortener service that is fast, open, and easy to use. You can even assign multiple custom names for each link!',
      author: 'BeerStorm.net',
      keywords:
          'URL shortener, url shortener custom, short link free, shorten web address, make short url, shorten url for twitter, shorten diz link, liverpool supporters link shortener',
    },
    info: {
      title: 'About',
      subtitle: 'what-why-how',
    },
    about: {
      title: 'About & FAQ',
      subtitle: 'why',
    },
    faq: {
      title: 'FAQ',
      subtitle: 'what-how',
    },
    terms: {
      title: 'Terms',
      intro: {
        title: 'Terms',
        subtitle: 'Privacy matters!',
      },
      tc: {
        title: 'Terms & Conditions',
        subtitle: 'of service usage',
      },
    },
    developers: {
      title: 'Developers',
      intro: {
        title: 'Developers',
        subtitle: '...for coders by coders!',
      },
      api: {
        title: 'API Endpoints',
        subtitle: 'what-how of RESTful API',
      },
    },
  },
  resources: {
    main: {
      title: 'BAET.no reloaded!!!',
    },
    links: {
      name: 'My Link |||| My Links',
      title: 'My Links',
      nodata: {
        links: 'You have no links yet...',
        stats: 'no Stats generated yet...'
      },
      fields: {
        id: 'short link',
        long_link: 'long link',
        simple_links: 'custom links',
        userid: 'User Id',
        createdAt: 'Created At',
      },
      buttons: {
        copy: {
          name: 'Copy',
          confirm: 'Copied! -> ',
        },
        share: 'Share',
        stats: {
          name: 'Stats',
          options: {
            d_clicks: 'Clicks per each Link',
            d_types: 'Request client types',
            d_referers: 'Referrers',
            d_country_codes: 'Request locations',
            d_browsers: 'Browser profiles',
            d_platforms: 'Platform profiles',
          },
        },
      },
      form: {
        name: 'Shorten',
        label: 'Shorten',
        title: 'Shorten & Simplify',
        submit: 'Shorten!',
        error: 'Error!!! Check input fields',
        long_link: {
          placeholder: 'Paste long link here (url to shorten)',
          hint: 'E.g. https://www.youtube.com/user/MontyPython',
          floatingLabelText: 'Long link/url',
        },
        simple_link: {
          hint: 'Simple names',
          expand_button: 'and... Simplify!',
          chips: {
            floatingLabelText: 'Simple names',
            placeholder: 'You can assign simple names to make it easy to remember',
            hint: 'e.g. Write "montypython" then press Enter',
          },
        },
        errors: {
          long_link: {
            required: 'long_link is required...',
            invalid: 'long_link is NOT a proper url, e.g. it must begin with http://... but yours is "%{long_link}" ',
            len: {
              min: 'long_link must be min %{len_min} characters long',
              max: 'long_link can be max %{len_max} characters long',
            }
          },
          simple_link: {
            len:
                'The simple_link must be more than %{min} and less than %{max} characters long... %{simple_link}',
            alpha:
                'The simple_link can consist of only alphanumeric chars (letter, number), underscore (_) and dash (-)... %{simple_link}',
            limit: 'Simple links are limited by %{limit}',
          },
          recaptcha: 'You must validate ReCAPTCHA!!!',
          submit: 'Link creation failed!!!'
        },
      },
    },
    stats: {
      name: 'Stat |||| Stats',
    },
    clicks: {
      name: 'Click |||| Clicks',
    },
  },
};
