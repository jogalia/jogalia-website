<template>
  <div class="teams-page">
    <EditionBadge />

    <!-- Game selector -->
    <div class="game-selector">
      <button
        v-for="game in games"
        :key="game.id"
        class="game-card"
        :class="{ active: selectedGame === game.id }"
        :style="{ '--game-color': game.color }"
        @click="selectedGame = game.id"
      >
        <img :alt="game.label" class="game-icon" :src="game.icon">
        <span class="game-label">{{ game.label }}</span>
      </button>
    </div>

    <!-- Sub-header -->
    <div class="teams-header">
      <div class="header-eyebrow">
        {{ currentGame.label }} · {{ currentTeams.length }} {{ currentGame.id === Game.FCSports ? 'Atletas' : 'Equipas' }}
      </div>
    </div>

    <!-- ── LOADING OVERLAY ── -->
    <div v-if="isLoading" class="loading-state">
      <v-progress-circular
        class="loading-spinner"
        color="secondary"
        indeterminate
        size="48"
        width="4"
      />

      <span class="loading-text">A carregar equipas...</span>
    </div>

    <!-- EA FC: lista vertical -->
    <div v-else-if="selectedGame === Game.FCSports" class="fc-list">
      <div class="fc-header">
        <span class="fc-col-num">#</span>
        <span class="fc-col-nick">Nick</span>
        <span class="fc-col-name">Nome</span>
        <span class="fc-col-coach">Coach</span>
      </div>

      <div
        v-for="(team, i) in currentTeams"
        :key="team.name"
        class="fc-row"
        :class="{ 'fc-row--tbd': !team.roster[0]?.nick }"
      >
        <span class="fc-col-num">{{ i + 1 }}</span>
        <span class="fc-col-nick">{{ team.roster[0]?.nick || 'A confirmar' }}</span>
        <span class="fc-col-name">{{ team.roster[0]?.fullName || '' }}</span>

        <span class="fc-col-coach">
          <template v-if="team.roster[1]?.nick">
            <span class="fc-coach-nick">{{ team.roster[1].nick }}</span>
            <span v-if="team.roster[1].fullName" class="fc-coach-name"> · {{ team.roster[1].fullName }}</span>
          </template>
        </span>
      </div>
    </div>

    <!-- Outros jogos: grid de cards -->
    <div v-else class="teams-grid">
      <div
        v-for="team in currentTeams"
        :key="team.name"
        class="team-card"
      >
        <!-- Front: logo + name -->
        <div class="card-front">
          <div class="team-logo-wrap">
            <img
              v-if="team.logo && !brokenLogos.has(team.name)"
              :alt="team.name"
              class="team-logo"
              :src="team.logo"
              @error="brokenLogos.add(team.name)"
            >

            <div v-else class="team-logo-placeholder">
              <v-icon color="rgba(255,255,255,0.18)" size="38">mdi-shield-outline</v-icon>
            </div>
          </div>

          <div class="team-name">{{ team.name }}</div>
        </div>

        <!-- Overlay: roster (hover) -->
        <div class="card-overlay">
          <div class="overlay-team-name">{{ team.name }}</div>

          <div class="roster-list">
            <template v-for="(slot, i) in team.roster" :key="i">
              <div
                class="roster-row"
                :class="{ 'is-coach': slot.role === 'Coach', 'is-tbd': !slot.nick }"
              >
                <span class="slot-badge">{{ slot.role === 'Coach' ? 'Coach' : 'P' + (i + 1) }}</span>

                <div class="slot-info">
                  <span class="slot-nick">{{ slot.nick || 'A confirmar' }}</span>
                  <span v-if="slot.fullName" class="slot-fullname">{{ slot.fullName }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import cs2Image from '@/assets/img/games/cs2.png'
  import fcImage from '@/assets/img/games/fc.png'
  import lolImage from '@/assets/img/games/lol.png'
  import rlImage from '@/assets/img/games/rl.png'
  import valImage from '@/assets/img/games/val.png'
  import EditionBadge from '@/components/EditionBadge.vue'
  import { Game, getTeamMembers, type Team } from '@/sheets/sheets.ts'

  const games = [
    { id: Game.CS2, label: 'CS2', color: '#F4A723', icon: cs2Image },
    { id: Game.LoL, label: 'LoL', color: '#C89B3C', icon: lolImage },
    { id: Game.Valorant, label: 'Valorant', color: '#FF4655', icon: valImage },
    { id: Game.RocketLeague, label: 'Rocket Lg.', color: '#0286F7', icon: rlImage },
    { id: Game.FCSports, label: 'EA FC Sports', color: '#00ACED', icon: fcImage },
  ]

  const sheetTeams = ref<Record<string, Team[]>>({})
  const isLoading = ref(true)

  const selectedGame = ref<string>(Game.CS2)
  const brokenLogos = ref(new Set<string>())

  onMounted(async () => {
    try {
      sheetTeams.value = await getTeamMembers()
    } catch (error) {
      console.error('Failed to load spreadsheet teams:', error)
    } finally {
      isLoading.value = false
    }
  })

  const currentGame = computed(() => games.find(g => g.id === selectedGame.value) ?? games[0])
  const currentTeams = computed(() => sheetTeams.value[selectedGame.value] ?? [])
</script>

<style scoped>
/* ── Loading Viewport Styles ───────────────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  gap: 16px;
}

.loading-state :deep(.loading-spinner .v-progress-circular__underlay) {
  stroke: rgba(255, 255, 255, 0.1) !important;
}

.loading-text {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(var(--v-theme-on-surface));
  text-transform: uppercase;
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
.teams-page {
  min-height: 100vh;
  padding-bottom: 80px;
}

/* ── Game selector ─────────────────────────────────────────────────────────── */
.game-selector {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px 24px 0;
  flex-wrap: wrap;
}

.game-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 120px;
  height: 88px;
  border-radius: 10px;
  border-color: var(--v-border-color);
  background: rgba(var(--v-theme-surface));
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.game-card:hover {
  border-color: var(--game-color, var(--v-border-color-highlight));
  background: rgba(var(--v-theme-surface-light));
}

.game-card.active {
  border-color: var(--game-color);
  background: color-mix(in srgb, var(--game-color) 14%, transparent);
}

.game-icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.game-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface));
  text-align: center;
  line-height: 1.2;
}

.game-card.active .game-label {
  color: rgba(var(--v-theme-on-background));
}

/* ── Sub-header ────────────────────────────────────────────────────────────── */
.teams-header {
  text-align: center;
  padding: 24px 24px 4px;
}

.header-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface-light));
}

/* ── Teams grid ────────────────────────────────────────────────────────────── */
.teams-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 28px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── Team card ─────────────────────────────────────────────────────────────── */
.team-card {
  position: relative;
  width: 190px;
  height: 250px;
  border-radius: 12px;
  border: 1px solid var(--v-border-color);
  background: rgba(var(--v-theme-surface));;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.team-card:hover {
  border-color: var(--v-border-color-highlight);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.45);
}

/* ── Card front ────────────────────────────────────────────────────────────── */
.card-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px 14px 18px;
  gap: 14px;
  transition: opacity 0.22s, transform 0.22s;
}

.team-card:hover .card-front {
  opacity: 0;
  transform: scale(0.94);
}

.team-logo-wrap {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
}

.team-logo-placeholder {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-name {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: rgba(var(--v-theme-on-background));
  letter-spacing: 0.02em;
  line-height: 1.3;
}

/* ── Card overlay ──────────────────────────────────────────────────────────── */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 4, 30, 0.97);
  display: flex;
  flex-direction: column;
  padding: 12px 12px 10px;
  transform: translateY(100%);
  transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}

.team-card:hover .card-overlay {
  transform: translateY(0);
}

.overlay-team-name {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface));
  margin-bottom: 8px;
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Roster ────────────────────────────────────────────────────────────────── */
.roster-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  justify-content: center;
}

.roster-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.roster-row.is-coach {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.slot-badge {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface-light));
  padding-top: 2px;
  min-width: 28px;
  flex-shrink: 0;
}

.is-coach .slot-badge {
  color: rgb(var(--v-theme-secondary));
  min-width: 36px;
}

.slot-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.slot-nick {
  font-size: 12px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-background));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.35;
}

.is-tbd .slot-nick {
  color: rgba(var(--v-theme-on-surface-light));
  font-style: italic;
}

.slot-fullname {
  font-size: 9.5px;
  color: rgba(var(--v-theme-on-surface-light));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

/* ── EA FC list ────────────────────────────────────────────────────────────── */
.fc-list {
  max-width: 860px;
  margin: 28px auto 0;
  padding: 0 24px;
  border: 1px solid var(--v-border-color);
  border-radius: 12px;
  overflow: hidden;
}

.fc-header,
.fc-row {
  display: grid;
  grid-template-columns: 36px 1fr 1fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 52px;
}

.fc-header {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  height: 40px;
}

.fc-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
}

.fc-row:last-child {
  border-bottom: none;
}

.fc-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.fc-col-num {
  font-size: 11px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface-light));
  text-align: center;
}

.fc-col-nick {
  font-size: 13px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-background));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-col-name {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-col-coach {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-coach-nick {
  font-weight: 700;
  color: rgb(var(--v-theme-secondary));
}

.fc-coach-name {
  color: rgba(var(--v-theme-on-surface));
  font-size: 11px;
}

.fc-row--tbd .fc-col-nick {
  color: rgba(var(--v-theme-on-surface-light));
  font-style: italic;
  font-weight: 400;
}
</style>
