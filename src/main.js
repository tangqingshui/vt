import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './util/demo'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(context => {
  console.log(context);
})

app.use(pinia)
app.use(router)

app.mount('#app')
