/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import Mapa from '@/pages/mapa.vue'
import Inscricoes from '@/pages/inscricoes.vue'
import Horarios from '@/pages/horarios.vue'
import Equipas from '@/pages/equipas.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
      meta: { isHero: true }
    }, {
      path: '/mapa',
      component: Mapa,
      meta: { isHero: false }
    }, {
      path: '/inscricoes',
      component: Inscricoes,
      meta: { isHero: false }
    }, {
      path: '/horarios',
      component: Horarios,
      meta: { isHero: false }
    }, {
      path: '/equipas',
      component: Equipas,
      meta: { isHero: false }
    }
  ],
})

export default router
