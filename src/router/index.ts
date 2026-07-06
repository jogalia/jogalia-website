/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Equipas from '@/pages/equipas.vue'
import Horarios from '@/pages/horarios.vue'
import Index from '@/pages/index.vue'
import Inscricoes from '@/pages/inscricoes.vue'
import Mapa from '@/pages/mapa.vue'
import Parceiros from '@/pages/parceiros.vue'
import Transmissao from '@/pages/transmissao.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
      meta: {
        isHero: true,
        description: 'A Jogália é um evento de Esports, gaming e TCG em Oeiras de 9 a 12 de Julho de 2026, organizado'
          + ' pela NexEra e pelo LAGE². Quatro dias de competições, transmissões em direto, TCG, workshops e atividades'
          + ' abertas ao público.',
      },
    }, {
      path: '/equipas',
      component: Equipas,
      meta: {
        title: 'Equipas',
        description: 'Descobre as equipas do Jogália 2026 que vão participar nos torneios dos teus jogos favoritos.',
      },
    }, {
      path: '/inscricoes',
      component: Inscricoes,
    }, {
      path: '/horarios',
      component: Horarios,
      meta: {
        title: 'Horários',
        description: 'Consulta os horários oficiais dos torneios dos teus jogos favoritos.',
      },
    }, {
      path: '/mapa',
      component: Mapa,
      meta: {
        title: 'Mapa',
        description: 'Não te percas no maior evento Gaming o IST Oeiras! Explora o mapa para o Jogália 2026 e descobre onde são as tuas atividades favoritas.',
      },
    }, {
      path: '/parceiros',
      component: Parceiros,
      meta: {
        title: 'Parceiros',
        description: 'Conhece as marcas e entidades que tornam o Jogália 2026 possível. Descobre os parceiros oficiais que apoiam o maior evento de Gaming do IST Oeiras.',
      },
    }, {
      path: '/transmissao',
      component: Transmissao,
      meta: {
        title: 'Transmissão',
        description: 'Segue os jogos dos diversos torneios que a Jogália 2026 oferece, LIVE na Twitch.',
      },
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

export default router
