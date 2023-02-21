import App from './App.vue'
import './styles'

import { createApp } from 'vue'

import 'vfonts/OpenSans.css'
import '@unocss/reset/normalize.css'
import 'uno.css'



async function bootstrap() {
  const app = createApp(App)

  app.mount('#app')
}

void bootstrap()

