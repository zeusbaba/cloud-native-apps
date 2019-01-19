import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './i18n_en.js';
import nb from './i18n_nb.js';

Vue.use(VueI18n);

let conf = {
  locale: 'nb',
  fallbackLocale: 'en',
  messages : {
    nb: { ...nb },
    en: { ...en }
  }
};

const index = new VueI18n(conf);
export default index
