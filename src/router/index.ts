/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Equipas from '@/pages/equipas.vue'
import Index from '@/pages/index.vue'
import Inscricoes from '@/pages/inscricoes.vue'
import Mapa from '@/pages/mapa.vue'
import Parceiros from '@/pages/parceiros.vue'
import Transmissao from '@/pages/transmissao.vue'
import Horarios from "@/pages/horarios.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
      meta: { isHero: true },
    }, {
      path: '/equipas',
      component: Equipas,
      meta: { isHero: false },
    }, {
      path: '/inscricoes',
      component: Inscricoes,
      meta: { isHero: false },
    }, {
      path: '/horarios',
      component: Horarios,
      meta: { isHero: false },
    }, {
      path: '/mapa',
      component: Mapa,
      meta: { isHero: false },
    }, {
      path: '/parceiros',
      component: Parceiros,
      meta: { isHero: false },
    }, {
      path: '/transmissao',
      component: Transmissao,
      meta: { isHero: false },
    },
  ],
})

export default router
