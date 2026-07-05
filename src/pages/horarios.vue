<template>
  <EditionBadge />

  <!-- Game selector -->
  <GameSelector v-model="selectedGame" :game-details="games" />

  <LoadingComponent v-if="isLoading" />

  <div v-else>
    <div
      v-for="round in rounds"
      :key="round"
    >
      <div class="phase-label">
        <span class="phase-line" />
        <span class="phase-text uppercase">{{ round }}</span>
        <span class="phase-line" />
      </div>

      <v-container v-if="round === GROUPS_ROUND_NAME">
        <v-row>
          <v-col v-for="group in groups" :key="group">
            <GroupView :group-id="group" :group-matches="matches[selectedGame]!.filter(m => m.group === group)" :teams="teams[selectedGame]!" />
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else>
        <v-row>
          <v-col
            v-for="(match, i) in matches[selectedGame]!.filter(m => m.round === round)"
            :key="i"
            class="grow"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <MatchView
              custom-border-color="#FFB404"
              :label="match.group ?? 'MATCH'"
              :match="match"
              :team1="teams[selectedGame]?.find(t => t.name === match.team1)"
              :team2="teams[selectedGame]?.find(t => t.name === match.team2)"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>

</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { Game, getMatches, getTeamMembers, type Match, type Team } from '@/api/sheets.ts'
  import cs2Image from '@/assets/img/games/cs2.png'
  import fcImage from '@/assets/img/games/fc.png'
  import lolImage from '@/assets/img/games/lol.png'
  import rlImage from '@/assets/img/games/rl.png'
  import valImage from '@/assets/img/games/val.png'
  import EditionBadge from '@/components/EditionBadge.vue'
  import GameSelector from '@/components/GameSelector.vue'
  import GroupView from '@/components/horarios/GroupView.vue'
  import MatchView from '@/components/horarios/MatchView.vue'
  import LoadingComponent from '@/components/LoadingComponent.vue'

  const GROUPS_ROUND_NAME = 'Fase de Grupos'

  const games = [
    { id: Game.CS2, label: 'CS2', color: '#F4A723', icon: cs2Image },
    { id: Game.LoL, label: 'LoL', color: '#C89B3C', icon: lolImage },
    { id: Game.Valorant, label: 'Valorant', color: '#FF4655', icon: valImage },
    { id: Game.RocketLeague, label: 'Rocket Lg.', color: '#0286F7', icon: rlImage },
    { id: Game.FCSports, label: 'EA FC Sports', color: '#00ACED', icon: fcImage },
  ]

  const selectedGame = ref<Game>(Game.Valorant)
  const isLoading = ref(true)

  const teams = ref<Partial<Record<Game, Team[]>>>({})
  const matches = ref<Partial<Record<Game, Match[]>>>({})

  onMounted(async () => {
    try {
      teams.value = await getTeamMembers()
      matches.value = await getMatches()
    } catch (error) {
      console.error('Failed to load spreadsheet teams:', error)
    } finally {
      isLoading.value = false
    }
  })

  const rounds = computed<string[]>(() => [...new Set(matches.value[selectedGame.value]?.map((m: Match) => m.round))])
  const groups = computed<string[]>(() => [...new Set(matches.value[selectedGame.value]
    ?.filter(m => m.round === GROUPS_ROUND_NAME && m.group)
    .map((m: Match) => m.group!)),
  ])
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

.phase-label--f4   { margin-top: 32px; }
.phase-text--gold  { color: rgba(255,180,4,.85); }
.phase-text--red   { color: rgba(255,70,85,.85); }
</style>
