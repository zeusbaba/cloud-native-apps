export default {
  pos: {
    search: 'Søk',
    sharer: {
      text: 'Forkorte & Forenkle Linker via BAET.no',
      hashtags: 'kortlink, shortlink'
    },
    header: {
      title: 'BAET.no :: Forkorte & Forenkle Linker!',
      description:
          'URL shortener service that is fast, open, and easy to use. You can even assign multiple custom names for each link!',
      author: 'BeerStorm.net',
      keywords:
          'URL shortener, url shortener custom, short link free, shorten web address, make short url, shorten url for twitter, shorten diz link, liverpool supporters link shortener',
    },
    info: {
      title: 'Om',
      subtitle: 'hva-hvorfor-hvordan',
    },
    about: {
      title: 'Om & FAQ',
      subtitle: 'hvorfor',
    },
    faq: {
      title: 'FAQ',
      subtitle: 'hva-hvordan',
    },
    terms: {
      title: 'Vilkår',
      intro: {
        title: 'Vilkår for bruk',
        subtitle: 'Privacy matters!',
      },
      tc: {
        title: 'Vilkår og betingelser',
        subtitle: 'for bruk',
      },
    },
    developers: {
      title: 'Utviklere',
      intro: {
        title: 'Utviklere',
        subtitle: '...for kodere av kodere!',
      },
      api: {
        title: 'API Endpoints',
        subtitle: 'what-how of RESTful API',
      },
    },
  },
  resources: {
    main: {
      title: 'BAET.no igjen!!!',
    },
    links: {
      name: 'Mine Link |||| Mine Linker',
      title: 'Mine Linker',
      nodata: {
        links: 'Du har ingen linker ennå...',
        stats: 'ingen Stats ennå...'
      },
      fields: {
        id: 'kort link',
        long_link: 'orig link',
        simple_links: 'custom linker',
        userid: 'User Id',
        createdAt: 'opprettet dato',
      },
      buttons: {
        copy: {
          name: 'Kopiere',
          confirm: 'Kopiert! -> ',
        },
        stats: {
          name: 'Stats',
          options: {
            d_clicks: 'Klikk per hver Link',
            d_types: 'Request klienttyper',
            d_referers: 'Referrers',
            d_country_codes: 'Request steder',
            d_browsers: 'Nettleser profiler',
            d_platforms: 'Plattform profiler',
          },
        },
        share: 'Dele',
      },
      form: {
        name: 'Forkorte',
        label: 'Forkorte',
        title: 'Forkorte & Forenkle',
        submit: 'Forkorte!',
        error: 'Error!!! Check input fields',
        long_link: {
          placeholder: 'Lim inn lenken her (url til å forkorte!)',
          hint: 'f.eks. https://www.youtube.com/user/MontyPython',
          floatingLabelText: 'Lange link/url',
        },
        simple_link: {
          hint: 'Enkelt navn',
          expand_button: 'og... Forenkle!',
          chips: {
            floatingLabelText: 'Enkelt navner',
            placeholder: 'Du kan gi enkelt navner som er bedre til å huske',
            hint: 'e.g. Skriv "montypython" og press Enter',
          },
        },
        errors: {
          long_link: {
            required: 'long_link er nødvendig...',
            invalid: 'long_link er IKKE gyldig, f.eks det må begynne med http://... men dine er "%{long_link}" ',
            len: {
              min: 'long_link must be min %{len_min} characters long',
              max: 'long_link can be max %{len_max} characters long',
            }
          },
          simple_link: {
            len:
                'simple_link kan inneholde min %{min} og max %{max} tegner... %{simple_link}',
            alpha:
                'simple_link kan inneholde bare alphanumeric tegner (brev og nummer), underscore (_) eller dash (-)... %{simple_link}',
            limit: 'Enkelt linker er begrenset med %{limit}',
          },
          recaptcha: 'Du må validere ReCAPTCHA!!!',
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
