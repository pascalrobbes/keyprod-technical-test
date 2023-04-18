import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/scss/main.scss'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Moment
import moment from 'moment'

// Vuex store
import store from './store'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'dark'
  }
})

const app = createApp(App)

// Custom Moment filters
app.config.globalProperties.$filters = {
  frenchDateTimeFormat(date) {
    return moment(date).format('DD/MM/YYYY HH:mm')
  }
}

app.use(router)
app.use(vuetify)
app.use(store)

app.mount('#app')
