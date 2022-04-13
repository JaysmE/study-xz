import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router/index.js'
import ModalButton from './components/modalButton.vue'
import Element from '@/plugins/element.js'
import Svg from '@/plugins/svg.js'

createApp(App)
  .component('ModalButton', ModalButton)
  .use(router)
  .use(Element)
  .use(Svg)
  .mount('#app')
