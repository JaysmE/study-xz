import App from './App'
import { createSSRApp } from 'vue'

export default function () {
  const app = createSSRApp(App)
  return { app }
}
