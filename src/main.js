import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './util/myPromise-1'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(context => {
  console.log(context);
})

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
