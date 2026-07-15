<template>
  <EditionBadge />
  <h1 class="page-title">Resultados</h1>
  <p class="page-subtitle">Descobre e partilha os resultados finais da edição Jogália 2026.</p>

  <!-- Game selector -->
  <GameSelector v-model="selectedGame" :game-details="games" />

  <LoadingComponent v-if="isLoading" />

  <div v-else>
    <v-container class="mt-10">
      <div class="podium-wrapper">
        <!-- 2nd Place -->
        <div class="podium-column">
          <div class="flex items-center sm:flex-col sm:justify-center">
            <TeamLogo :team="secondPlace" />
            <h3 class="m-2 text-center">{{ secondPlace?.name ?? '???' }}</h3>
          </div>

          <div class="podium h-[150px]">
            <div class="podium-badge">2º</div>
          </div>
        </div>

        <!-- 1st Place -->
        <div class="podium-column">
          <div class="flex items-center sm:flex-col sm:justify-center">
            <TeamLogo :team="firstPlace" />
            <h3 class="m-2 text-center">{{ firstPlace?.name ?? '???' }}</h3>
          </div>

          <div class="podium h-[200px]">
            <div class="podium-badge">1º</div>
          </div>
        </div>

        <!-- 3rd Place -->
        <div class="podium-column">
          <div class="flex items-center sm:flex-col sm:justify-center">
            <TeamLogo :team="thirdPlace" />

            <h3 class="m-2 text-center sm:text-left">
              {{ thirdPlace?.name ?? '???' }}
            </h3>
          </div>

          <div class="podium h-[100px]">
            <div class="podium-badge">3º</div>
          </div>
        </div>
      </div>

      <v-row class="mt-5" justify="center">
        <v-col cols="auto">
          <RouterLink class="on-surface-light no-underline uppercase bold" to="/horarios">Mais Resultados</RouterLink>
        </v-col>
      </v-row>

      <v-row class="mt-10" justify="center">
        <v-col cols="auto">
          <v-btn color="neonBlue" @click="shareResults()">
            Partilha os Resultados
            <template #append>
              <v-icon>mdi-share-variant</v-icon>
            </template>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <v-snackbar
    v-model="snackbar"
    class="mb-10"
    color="neonBlue"
    location="bottom"
    rounded="pill"
    :timeout="1500"
  >
    Copiado com sucesso.
  </v-snackbar>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { Game, getTeamMembers, type Team } from '@/api/sheets.ts'
  import cs2Image from '@/assets/img/games/cs2.png'
  import fcImage from '@/assets/img/games/fc.png'
  import lolImage from '@/assets/img/games/lol.png'
  import rlImage from '@/assets/img/games/rl.png'
  import valImage from '@/assets/img/games/val.png'
  import EditionBadge from '@/components/EditionBadge.vue'
  import TeamLogo from '@/components/equipas/TeamLogo.vue'
  import GameSelector from '@/components/GameSelector.vue'
  import LoadingComponent from '@/components/LoadingComponent.vue'

  const games = [
    { id: Game.CS2, label: 'CS2', color: '#F4A723', icon: cs2Image },
    { id: Game.LoL, label: 'LoL', color: '#C89B3C', icon: lolImage },
    { id: Game.Valorant, label: 'Valorant', color: '#FF4655', icon: valImage },
    { id: Game.RocketLeague, label: 'Rocket Lg.', color: '#0286F7', icon: rlImage },
    { id: Game.FCSports, label: 'EA FC Sports', color: '#00ACED', icon: fcImage },
  ]

  const selectedGame = ref<Game>(Game.CS2)
  const isLoading = ref(true)

  const teams = ref<Partial<Record<Game, Team[]>>>({})

  const firstPlace = computed(() => teams.value[selectedGame.value]?.find(t => t.finalPlace === 1))
  const secondPlace = computed(() => teams.value[selectedGame.value]?.find(t => t.finalPlace === 2))
  const thirdPlace = computed(() => teams.value[selectedGame.value]?.find(t => t.finalPlace === 3))

  onMounted(async () => {
    try {
      teams.value = await getTeamMembers()
    } catch (error) {
      console.error('Failed to load spreadsheet teams:', error)
    } finally {
      isLoading.value = false
    }
  })

  const snackbar = ref(false)

  async function shareResults () {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: 'Descobre os resultados da edição do evento Jogália 2026.',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share canceled or failed:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)

        snackbar.value = true
      } catch (error) {
        console.error('Failed to copy link:', error)
      }
    }
  }
</script>

<style scoped>
/* Header */

.page-title {
  text-align: center;
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 900;
  letter-spacing: -0.01em;
  color: rgba(var(--v-theme-on-background));
  margin: 12px 0 8px;
}

.page-subtitle {
  text-align: center;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface));
  letter-spacing: 0.02em;
}

/* Podium */
.podium-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.podium-column {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: rgba(var(--v-theme-surface));
  border: 1px solid var(--v-border-color-highlight);
  border-radius: 12px;
  padding: 16px;
  width: 100%;
}

.podium {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.podium-badge {
  position: static;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: rgba(var(--v-theme-on-surface));
  background-color: rgba(var(--v-theme-surface-light));
  border: 2px solid rgba(var(--v-theme-secondary));
}

@media (min-width: 640px) {
  .podium-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 24px;
    max-width: 100%;
  }

  .podium-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    border: none;
    padding: 0;
    width: auto;
  }

  .podium {
    display: flex;
    position: relative;
    justify-content: center;
    width: 180px;
    background: rgba(var(--v-theme-surface));
    border: 1px solid var(--v-border-color-highlight);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  .podium-badge {
    position: absolute;
    bottom: 16px;
    width: 50px;
    height: 50px;
  }
}
</style>
