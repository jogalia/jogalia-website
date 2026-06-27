/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import Mapa from '@/pages/mapa.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
      meta: { isHero: true }
    },{
      path: '/mapa',
      component: Mapa,
      meta: { isHero: false }
    }
  ],
})

export default router
