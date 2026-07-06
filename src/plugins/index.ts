// Types
import type { App } from 'vue'
import router from '../router'
// Plugins
import head from './head'
import i18n from './i18n'
import vuetify from './vuetify'

export function registerPlugins (app: App) {
  app.use(vuetify)
  app.use(i18n)
  app.use(head)
  app.use(router)
}
