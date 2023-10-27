import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'mdi' // default - only for display purposes
    },
    theme: {
        options: {
            customProperties: true
        },
        themes: {

        }
    },
    lang: {
        locales: { es },
        current: 'es'
    }
})
