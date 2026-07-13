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
        <div class="podium-column">
          <TeamLogo :team="secondPlace" />
          <h3 class="text-center m-2">{{ secondPlace?.name ?? '???' }}</h3>

          <div class="podium h-[150px]">
            <div class="podium-badge">2</div>
          </div>
        </div>

        <div class="podium-column">
          <TeamLogo :team="firstPlace" />
          <h3 class="text-center m-2">{{ firstPlace?.name ?? '???' }}</h3>

          <div class="podium h-[200px]">
            <div class="podium-badge">1</div>
          </div>
        </div>

        <div class="podium-column">
          <TeamLogo :team="thirdPlace" />
          <h3 class="text-center m-2">{{ thirdPlace?.name ?? '???' }}</h3>

          <div class="podium h-[100px]">
            <div class="podium-badge">3</div>
          </div>
        </div>
      </div>
    </v-container>
  </div>

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
</script>

<style scoped>
/* Phase dividers */
.phase-label {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 30px 0 20px;
}
.phase-line  {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(var(--v-theme-secondary)), transparent);
}

.phase-text  {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .25em;
  color: rgba(var(--v-theme-secondary));
  white-space: nowrap;
}

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
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 24px;
  width: 100%;
}

.podium-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podium {
  position: relative;
  display: flex;
  justify-content: center;
  width: 200px;
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: rgba(var(--v-theme-on-surface));
  background-color: rgba(var(--v-theme-surface-light));
  border: 2px solid rgba(var(--v-theme-secondary));
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15); /* Gives the circle its own depth */
}

</style>
