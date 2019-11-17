// ...Vuetify https://vuetifyjs.com/en/getting-started/quick-start

import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from "vuetify/es5/util/colors";
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.use(Vuetify);

const opts = {
    icons: {
        iconfont: 'fa'
    },
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: colors.orange.darken4,
                secondary: colors.orange.darken1,
                accent: colors.orange.accent3
            }
        }
    }
};

export default new Vuetify(opts)
