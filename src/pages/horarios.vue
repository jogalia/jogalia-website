<template>
  <div class="bracket-page">

    <!-- Game selector -->
    <div class="game-selector">
      <button
        v-for="game in games"
        :key="game.id"
        class="game-card"
        :class="{ active: selectedGame === game.id, live: liveGames.has(game.id) }"
        :style="{ '--game-color': game.color }"
        @click="selectGame(game.id)"
      >
        <span v-if="liveGames.has(game.id)" class="live-pill">
          <span class="live-dot"></span>LIVE
          <v-icon size="10" class="twitch-icon">mdi-twitch</v-icon>
        </span>
        <img :src="game.icon" :alt="game.label" class="game-icon" />
        <span class="game-label">{{ game.label }}</span>
        <span v-if="!liveGames.has(game.id) && gameStartTimes[game.id]" class="game-start-time">
          {{ gameStartTimes[game.id] }}
        </span>
      </button>
    </div>

    <!-- Header -->
    <div class="bracket-header">
      <div class="header-eyebrow">JOGÁLIA 2026 · {{ currentGame.label }}</div>
      <!-- <h1 class="header-title">BRACKET</h1>
      <div class="header-sub">Single Elimination · 16 Teams</div> -->
      <div class="sync-status" :class="syncState">
        <span class="sync-dot"></span>
        <span v-if="syncState === 'loading'">A carregar...</span>
        <span v-else-if="syncState === 'ok'">Atualizado · {{ lastSyncTime }}</span>
        <span v-else-if="syncState === 'error'">Erro ao carregar ficheiros</span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!teamsLoaded || !matchesLoaded" class="empty-state">
      <v-icon size="64" color="#0686F3" class="mb-4">mdi-sword-cross</v-icon>
      <div class="empty-title">
        {{ syncState === 'error' ? 'Não foi possível carregar os ficheiros' : 'A carregar bracket...' }}
      </div>
      <div class="empty-sub">public/{{ selectedGame }}/teams.xlsx · matches.xlsx</div>
    </div>

    <template v-else>
      <!-- MOBILE -->
      <div class="mobile-bracket">
        <div v-for="(roundMatches, rIdx) in bracket" :key="'mob-' + rIdx" class="mobile-round">
          <button class="mobile-round-header" @click="toggleRound(rIdx)" :class="{ collapsed: collapsedRounds[rIdx] }">
            <span class="mobile-round-label">{{ roundLabel(rIdx + 1) }}</span>
            <span class="mobile-round-meta">
              <span class="mobile-round-format">{{ matchFormat(rIdx + 1) }}</span>
              <span class="mobile-round-count">{{ doneCount(roundMatches) }}/{{ roundMatches.length }}</span>
            </span>
            <v-icon class="mobile-chevron" size="18">{{ collapsedRounds[rIdx] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </button>
          <div v-show="!collapsedRounds[rIdx]" class="mobile-round-matches">
            <div
              v-for="match in roundMatches"
              :key="'mob-' + match.match_id"
              class="match-card"
              :class="matchCardClass(match)"
			  @click="onMatchCardClick(match)"
            >
              <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                <span v-if="isLive(match)" class="tag-live-dot"></span>
                {{ isLive(match) ? 'LIVE' : matchFormat(rIdx + 1) }}
              </div>
              <div v-if="match.start_time && !isLive(match) && match.status !== 'done'" class="match-time-row">
                <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon>
                {{ match.start_time }}
              </div>
              <div class="team-row" :class="teamRowClass(match, 1)">
                <span class="team-logo-wrap">
                  <img v-if="match.team1 && !brokenLogos.has(logoKey(match.team1))"
                    :src="logoPath(match.team1)" class="team-logo-img" :alt="match.team1.name"
                    @error="brokenLogos.add(logoKey(match.team1))" />
                  <span v-else-if="match.team1" class="team-logo-placeholder">{{ match.team1.name.charAt(0).toUpperCase() }}</span>
                  <span v-else class="team-logo-placeholder team-logo-tbd">?</span>
                </span>
                <span class="seed" v-if="match.team1">#{{ match.team1.seed }}</span>
                <span class="seed tbd-seed" v-else>?</span>
                <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
                <span class="score" v-if="match.status === 'done' || isLive(match)" v-show="match.score1 != null && match.score1 !== ''">{{ match.score1 }}</span>
              </div>
              <div class="match-divider"></div>
              <div class="team-row" :class="teamRowClass(match, 2)">
                <span class="team-logo-wrap">
                  <img v-if="match.team2 && !brokenLogos.has(logoKey(match.team2))"
                    :src="logoPath(match.team2)" class="team-logo-img" :alt="match.team2.name"
                    @error="brokenLogos.add(logoKey(match.team2))" />
                  <span v-else-if="match.team2" class="team-logo-placeholder">{{ match.team2.name.charAt(0).toUpperCase() }}</span>
                  <span v-else class="team-logo-placeholder team-logo-tbd">?</span>
                </span>
                <span class="seed" v-if="match.team2">#{{ match.team2.seed }}</span>
                <span class="seed tbd-seed" v-else>?</span>
                <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
                <span class="score" v-if="match.status === 'done' || isLive(match)" v-show="match.score2 != null && match.score2 !== ''">{{ match.score2 }}</span>
              </div>
              <div v-if="isLive(match)" class="match-status-badge live-badge"><span class="live-badge-dot"></span> A decorrer</div>
              <div v-else-if="match.status === 'done'" class="match-status-badge done"><v-icon size="10">mdi-check</v-icon> Concluído</div>
              <div v-else class="match-status-badge pending"><v-icon size="10">mdi-clock-outline</v-icon> A aguardar</div>
            </div>
          </div>
        </div>

        <div v-if="champion" class="mobile-champion">
          <img v-if="!brokenLogos.has(logoKey(champion))" :src="logoPath(champion)" class="mobile-champion-logo" :alt="champion.name" @error="brokenLogos.add(logoKey(champion))" />
          <v-icon v-else size="28" color="#FFB404">mdi-trophy</v-icon>
          <div class="mobile-champion-text">
            <div class="mobile-champion-label">CAMPEÃO</div>
            <div class="mobile-champion-name">#{{ champion.seed }} {{ champion.name }}</div>
          </div>
        </div>
      </div>

      <!-- DESKTOP -->
      <div class="bracket-scroll-wrapper desktop-bracket">
        <div class="bracket-grid">
          <div v-for="(roundMatches, rIdx) in bracket" :key="'desk-' + rIdx" class="round-col">
            <div class="round-label">{{ roundLabel(rIdx + 1) }}</div>
            <div class="round-matches">
              <div
                v-for="match in roundMatches"
                :key="'desk-' + match.match_id"
                class="match-card match-card-live-clickable"
                :class="matchCardClass(match)"
				@click="onMatchCardClick(match)"
              >
                <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                  <span v-if="isLive(match)" class="tag-live-dot"></span>
                  {{ isLive(match) ? 'LIVE' : matchFormat(rIdx + 1) }}
                </div>
                <div v-if="match.start_time && !isLive(match) && match.status !== 'done'" class="match-time-row">
                  <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon>
                  {{ match.start_time }}
                </div>
                <div class="team-row" :class="teamRowClass(match, 1)">
                  <span class="team-logo-wrap">
                    <img v-if="match.team1 && !brokenLogos.has(logoKey(match.team1))"
                      :src="logoPath(match.team1)" class="team-logo-img" :alt="match.team1.name"
                      @error="brokenLogos.add(logoKey(match.team1))" />
                    <span v-else-if="match.team1" class="team-logo-placeholder">{{ match.team1.name.charAt(0).toUpperCase() }}</span>
                    <span v-else class="team-logo-placeholder team-logo-tbd">?</span>
                  </span>
                  <span class="seed" v-if="match.team1">#{{ match.team1.seed }}</span>
                  <span class="seed tbd-seed" v-else>?</span>
                  <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
                  <span class="score" v-if="match.status === 'done' || isLive(match)" v-show="match.score1 != null && match.score1 !== ''">{{ match.score1 }}</span>
                </div>
                <div class="match-divider"></div>
                <div class="team-row" :class="teamRowClass(match, 2)">
                  <span class="team-logo-wrap">
                    <img v-if="match.team2 && !brokenLogos.has(logoKey(match.team2))"
                      :src="logoPath(match.team2)" class="team-logo-img" :alt="match.team2.name"
                      @error="brokenLogos.add(logoKey(match.team2))" />
                    <span v-else-if="match.team2" class="team-logo-placeholder">{{ match.team2.name.charAt(0).toUpperCase() }}</span>
                    <span v-else class="team-logo-placeholder team-logo-tbd">?</span>
                  </span>
                  <span class="seed" v-if="match.team2">#{{ match.team2.seed }}</span>
                  <span class="seed tbd-seed" v-else>?</span>
                  <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
                  <span class="score" v-if="match.status === 'done' || isLive(match)" v-show="match.score2 != null && match.score2 !== ''">{{ match.score2 }}</span>
                </div>
                <div v-if="isLive(match)" class="match-status-badge live-badge"><span class="live-badge-dot"></span> A decorrer</div>
                <div v-else-if="match.status === 'done'" class="match-status-badge done"><v-icon size="10">mdi-check</v-icon> Concluído</div>
                <div v-else class="match-status-badge pending"><v-icon size="10">mdi-clock-outline</v-icon> A aguardar</div>
              </div>
            </div>
          </div>

          <div class="round-col champion-col" v-if="champion">
            <div class="round-label">CAMPEÃO</div>
            <div class="round-matches">
              <div class="champion-card">
                <img v-if="!brokenLogos.has(logoKey(champion))" :src="logoPath(champion)" class="champion-logo" :alt="champion.name" @error="brokenLogos.add(logoKey(champion))" />
                <v-icon v-else size="32" color="#FFB404">mdi-trophy</v-icon>
                <div class="champion-seed">#{{ champion.seed }}</div>
                <div class="champion-name">{{ champion.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'

// Game definitions
const games = [
  { id: 'cs2', label: 'CS2',        color: '#F4A723', icon: '/icons/cs2.png' },
  { id: 'lol', label: 'LoL',        color: '#C89B3C', icon: '/icons/lol.png' },
  { id: 'val', label: 'Valorant',   color: '#FF4655', icon: '/icons/val.png' },
  { id: 'rl',  label: 'Rocket Lg.', color: '#0286F7', icon: '/icons/rl.png'  },
  { id: 'fc',  label: 'EA FC',      color: '#00ACED', icon: '/icons/fc.png'  },
]

// Logo helpers
const brokenLogos = reactive(new Set())

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function logoPath(team) {
  return `/logos/${slugify(team.name)}.png`
}

function logoKey(team) {
  return logoPath(team)
}

function onMatchCardClick(match) {
  if (!isLive(match)) return
  const isDesktop = window.innerWidth >= 840
  if (isDesktop) {
    window.open('https://www.twitch.tv/jogaliaoficial', '_blank', 'noopener')
  }
  // On mobile do nothing
  // don't want accidental opens on touch scroll)
}

// Live games cache
const allGameMatches = reactive({})

const liveGames = computed(() => {
  const set = new Set()
  for (const [id, ms] of Object.entries(allGameMatches)) {
    if (ms.some(m => isLiveRaw(m))) set.add(id)
  }
  return set
})

const gameStartTimes = computed(() => {
  const map = {}
  for (const [id, ms] of Object.entries(allGameMatches)) {
    const times = ms.map(m => m.start_time).filter(Boolean)
    if (times.length) map[id] = times[0]
  }
  return map
})

// Selected game
const selectedGame = ref('cs2')
const currentGame  = computed(() => games.find(g => g.id === selectedGame.value) || games[0])

function selectGame(id) {
  if (id === selectedGame.value) return
  selectedGame.value  = id
  teams.value         = []
  matches.value       = []
  teamsLoaded.value   = false
  matchesLoaded.value = false
  syncState.value     = 'loading'
  Object.keys(collapsedRounds).forEach(k => { collapsedRounds[k] = false })
  refresh()
}

// Data
const teams         = ref([])
const matches       = ref([])
const teamsLoaded   = ref(false)
const matchesLoaded = ref(false)
const syncState     = ref('loading')
const lastSyncTime  = ref('')

const collapsedRounds = reactive({ 0: false, 1: false, 2: false, 3: false })
function toggleRound(idx) { collapsedRounds[idx] = !collapsedRounds[idx] }

let pollInterval = null

async function fetchXlsx(url) {
  const res = await fetch(`${url}?_=${Date.now()}`)
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  const buffer = await res.arrayBuffer()
  const wb = XLSX.read(buffer, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  return XLSX.utils.sheet_to_json(ws)
}

async function refreshAllGamesLive() {
  for (const game of games) {
    try {
      allGameMatches[game.id] = await fetchXlsx(`/${game.id}/matches.xlsx`)
    } catch { /* skip */ }
  }
}

async function refresh() {
  try {
    const [teamsData, matchesData] = await Promise.all([
      fetchXlsx(`/${selectedGame.value}/teams.xlsx`),
      fetchXlsx(`/${selectedGame.value}/matches.xlsx`),
    ])
    teams.value         = teamsData
    matches.value       = matchesData
    allGameMatches[selectedGame.value] = matchesData
    teamsLoaded.value   = true
    matchesLoaded.value = true
    syncState.value     = 'ok'
    lastSyncTime.value  = new Date().toLocaleTimeString('pt-PT', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  } catch (e) {
    console.error('[TournamentBracket]', e)
    syncState.value = 'error'
  }
  refreshAllGamesLive()
}

onMounted(() => { refresh(); pollInterval = setInterval(refresh, 10_000) })
onUnmounted(() => clearInterval(pollInterval))

// Live detection
function isLiveRaw(match) {
  const v = match.live
  if (v === null || v === undefined || v === '' || v === 0 || v === '0' || v === false || v === 'false' || v === 'FALSE') return false
  return true
}
function isLive(match) { return isLiveRaw(match) }

// Helpers
function teamBySeed(seed) {
  if (seed == null || seed === '') return null
  return teams.value.find(t => t.seed === seed) || null
}
function teamRowClass(match, slot) {
  return {
    winner: match.status === 'done' && match.winner === slot,
    loser:  match.status === 'done' && match.winner !== slot,
    tbd:    !(slot === 1 ? match.team1 : match.team2),
  }
}
function matchCardClass(match) {
  return {
    'match-live':    isLive(match),
    'match-done':    !isLive(match) && match.status === 'done',
    'match-pending': !isLive(match) && match.status === 'pending',
  }
}
function doneCount(roundMatches) {
  return roundMatches.filter(m => m.status === 'done').length
}

// Computed
const roundCount = computed(() => {
  if (!matches.value.length) return 0
  return Math.max(...matches.value.map(m => m.round))
})

const bracket = computed(() => {
  const rounds = []
  for (let r = 1; r <= roundCount.value; r++) {
    rounds.push(
      matches.value
        .filter(m => m.round === r)
        .map(m => {
          const t1 = teamBySeed(m.team1_seed)
          const t2 = teamBySeed(m.team2_seed)
          const winner = m.status === 'done' ? (m.score1 > m.score2 ? 1 : 2) : null
          return { ...m, team1: t1, team2: t2, winner }
        })
    )
  }
  return rounds
})

const champion = computed(() => {
  const final = bracket.value[roundCount.value - 1]
  if (!final || final.length !== 1 || final[0].status !== 'done') return null
  return final[0].winner === 1 ? final[0].team1 : final[0].team2
})

function roundLabel(round) {
  return { 1: 'ROUND OF 16', 2: 'QUARTAS', 3: 'MEIAS-FINAIS', 4: 'FINAL' }[round] || `RONDA ${round}`
}
function matchFormat(round) { return round >= 3 ? 'BO3' : 'BO1' }
</script>

<style scoped>
.bracket-page { background: #00072B; min-height: 100%; padding: 16px 16px 48px; color: #fff; font-family: 'Rajdhani', 'Roboto Condensed', 'Roboto', sans-serif; }

/* Game selector */
.game-selector { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 24px; }
.game-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 4px 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; cursor: pointer; transition: background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.12s; -webkit-tap-highlight-color: transparent; }
.game-card:active { transform: scale(0.95); }
.game-card.active { background: color-mix(in srgb, var(--game-color) 12%, transparent); border-color: color-mix(in srgb, var(--game-color) 60%, transparent); box-shadow: 0 0 16px color-mix(in srgb, var(--game-color) 25%, transparent); }
.game-card.live { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.6); box-shadow: 0 0 18px rgba(220,38,38,0.3); animation: live-card-pulse 2.5s ease-in-out infinite; }
@keyframes live-card-pulse { 0%,100% { box-shadow: 0 0 18px rgba(220,38,38,0.3); } 50% { box-shadow: 0 0 28px rgba(220,38,38,0.55); } }
.live-pill { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 4px; font-size: 8px; font-weight: 900; letter-spacing: 0.12em; color: #fff; background: #DC2626; border-radius: 4px; padding: 1px 6px; white-space: nowrap; box-shadow: 0 0 8px rgba(220,38,38,0.6); }
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #fff; animation: pulse-dot 1.2s ease-in-out infinite; }
.twitch-icon { opacity: 0.85; }
@media (min-width: 840px) {
  .game-card.live { cursor: pointer; }
  .game-card.live:hover .live-pill { background: #a21caf; }
}
.game-icon { width: 36px; height: 36px; object-fit: contain; background: rgba(255,255,255,0.04); border-radius: 6px; }
.game-card:not(.active):not(.live) .game-icon { filter: grayscale(60%) opacity(0.6); }
.game-label { font-size: 9px; font-weight: 800; letter-spacing: 0.1em; color: rgba(255,255,255,0.45); white-space: nowrap; }
.game-card.active .game-label, .game-card.live .game-label { color: #fff; }
.game-start-time { font-size: 8px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 0.05em; }

/* Header */
.bracket-header { text-align: center; margin-bottom: 24px; }
.header-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; color: #FFB404; margin-bottom: 6px; }
.header-title { font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 900; letter-spacing: 0.15em; line-height: 1; background: linear-gradient(135deg, #00DDFE 0%, #0686F3 60%, #03037F 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 6px; }
.header-sub { font-size: 13px; color: rgba(255,255,255,0.45); letter-spacing: 0.1em; margin-bottom: 14px; }

/* Sync pill */
.sync-status { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; padding: 5px 14px; border-radius: 20px; border: 1px solid transparent; transition: all 0.3s; }
.sync-status.loading { color: rgba(255,255,255,0.4); border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); }
.sync-status.ok      { color: rgba(0,221,254,0.8);   border-color: rgba(0,221,254,0.2);   background: rgba(0,221,254,0.05); }
.sync-status.error   { color: rgba(250,102,0,0.9);   border-color: rgba(250,102,0,0.3);   background: rgba(250,102,0,0.06); }
.sync-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.sync-status.loading .sync-dot { background: rgba(255,255,255,0.3); }
.sync-status.ok      .sync-dot { background: #00DDFE; box-shadow: 0 0 6px #00DDFE; animation: pulse-dot 2s ease-in-out infinite; }
.sync-status.error   .sync-dot { background: #FA6600; }
@keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

/* Empty */
.empty-state { text-align: center; padding: 60px 16px; }
.empty-title { font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
.empty-sub   { font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }

/* Layout switch */
.mobile-bracket  { display: flex; flex-direction: column; gap: 10px; }
.desktop-bracket { display: none; }
@media (min-width: 840px) {
  .mobile-bracket  { display: none; }
  .desktop-bracket { display: block; }
  .game-selector   { max-width: 480px; margin-left: auto; margin-right: auto; }
}

/* Mobile accordion */
.mobile-round { border: 1px solid rgba(6,134,243,0.15); border-radius: 10px; overflow: hidden; background: rgba(3,3,127,0.15); }
.mobile-round-header { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: rgba(6,134,243,0.07); border: none; cursor: pointer; text-align: left; color: #fff; transition: background 0.15s; -webkit-tap-highlight-color: transparent; }
.mobile-round-header:active { background: rgba(6,134,243,0.14); }
.mobile-round-label  { font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: rgba(255,255,255,0.7); flex: 1; }
.mobile-round-meta   { display: flex; align-items: center; gap: 8px; }
.mobile-round-format { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: #00DDFE; background: rgba(0,221,254,0.1); border: 1px solid rgba(0,221,254,0.25); border-radius: 3px; padding: 1px 6px; }
.mobile-round-count  { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); }
.mobile-chevron { color: rgba(255,255,255,0.3) !important; }
.mobile-round-matches { display: flex; flex-direction: column; gap: 14px; padding: 14px 12px; }

/* Mobile champion */
.mobile-champion { display: flex; align-items: center; gap: 14px; padding: 16px 18px; background: rgba(255,180,4,0.06); border: 1px solid rgba(255,180,4,0.35); border-radius: 10px; box-shadow: 0 0 20px rgba(255,180,4,0.08); }
.mobile-champion-logo { width: 40px; height: 40px; object-fit: contain; border-radius: 6px; flex-shrink: 0; }
.mobile-champion-label { font-size: 9px; font-weight: 800; letter-spacing: 0.18em; color: #FFB404; margin-bottom: 2px; }
.mobile-champion-name  { font-size: 16px; font-weight: 900; color: #fff; letter-spacing: 0.04em; }

/* Desktop bracket */
.bracket-scroll-wrapper { overflow-x: auto; padding-bottom: 16px; display: flex; justify-content: center; }
.bracket-grid { display: flex; gap: 0; min-width: max-content; align-items: stretch; margin: 0 auto; }
.round-col { display: flex; flex-direction: column; min-width: 210px; width: 210px; }
.round-label { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; color: rgba(255,255,255,0.35); text-align: center; padding: 0 12px 14px; white-space: nowrap; }
.round-matches { display: flex; flex-direction: column; flex: 1; justify-content: space-around; gap: 12px; padding: 0 8px; position: relative; }
.round-col:not(:last-child) .round-matches::after { content: ''; position: absolute; right: -8px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(6,134,243,0.2) 20%, rgba(6,134,243,0.2) 80%, transparent); }

/* Match card */
.match-card { position: relative; background: rgba(3,3,127,0.25); border: 1px solid rgba(6,134,243,0.2); border-radius: 8px; overflow: visible; transition: border-color 0.2s, box-shadow 0.2s; }
.match-card.match-done    { border-color: rgba(6,134,243,0.45); }
.match-card.match-pending { border-color: rgba(255,255,255,0.08); }
.match-card.match-live    { border-color: rgba(220,38,38,0.7); background: rgba(220,38,38,0.06); box-shadow: 0 0 14px rgba(220,38,38,0.2); animation: live-card-pulse 2.5s ease-in-out infinite; }
.match-time-row { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.4); padding: 4px 10px 0; letter-spacing: 0.04em; }

/* Format/LIVE tag */
.match-format-tag { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; letter-spacing: 0.12em; background: #03037F; border: 1px solid rgba(6,134,243,0.4); border-radius: 3px; padding: 1px 6px; color: #00DDFE; white-space: nowrap; }
.match-format-tag.tag-live { background: #7F1D1D; border-color: rgba(220,38,38,0.6); color: #FCA5A5; }
.tag-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #F87171; animation: pulse-dot 1.2s ease-in-out infinite; flex-shrink: 0; }

/* Team logo */
.team-logo-wrap { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex-shrink: 0; }
.team-logo-img { width: 22px; height: 22px; object-fit: contain; border-radius: 3px; }
.team-logo-placeholder { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: rgba(6,134,243,0.15); border: 1px solid rgba(6,134,243,0.2); border-radius: 3px; font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.5); }
.team-logo-tbd { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.2); }

/* Team rows */
.team-row { display: flex; align-items: center; gap: 7px; padding: 8px 10px; transition: background 0.15s; }
.team-row.winner { background: rgba(0,221,254,0.08); }
.team-row.loser  { opacity: 0.4; }
.team-row.tbd    { opacity: 0.35; }
.seed { font-size: 9px; font-weight: 800; color: #FFB404; min-width: 20px; letter-spacing: 0.04em; }
.seed.tbd-seed { color: rgba(255,255,255,0.3); }
.team-name { flex: 1; font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.03em; }
.score { font-size: 14px; font-weight: 900; color: #00DDFE; min-width: 20px; text-align: right; font-variant-numeric: tabular-nums; }
.team-row.winner .score { color: #00DDFE; }
.team-row.loser  .score { color: rgba(255,255,255,0.3); }
.match-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 0 10px; }

/* Status badge */
.match-status-badge { display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; padding: 4px 10px; border-top: 1px solid rgba(255,255,255,0.05); }
.match-status-badge.done       { color: rgba(0,221,254,0.6); }
.match-status-badge.pending    { color: rgba(255,255,255,0.25); }
.match-status-badge.live-badge { color: #FCA5A5; border-top-color: rgba(220,38,38,0.15); }
.live-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #F87171; flex-shrink: 0; animation: pulse-dot 1.2s ease-in-out infinite; }

/* Desktop champion */
.champion-col { min-width: 160px; width: 160px; }
.champion-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 24px 16px; background: rgba(255,180,4,0.06); border: 1px solid rgba(255,180,4,0.35); border-radius: 8px; box-shadow: 0 0 24px rgba(255,180,4,0.1); margin: 0 8px; }
.champion-logo { width: 48px; height: 48px; object-fit: contain; border-radius: 6px; }
.champion-seed { font-size: 11px; font-weight: 800; color: #FFB404; letter-spacing: 0.1em; }
.champion-name { font-size: 14px; font-weight: 900; color: #fff; text-align: center; letter-spacing: 0.05em; }

.match-card-live-clickable {
  cursor: pointer;
}

/* Only show pointer cursor on desktop */
@media (max-width: 839px) {
  .match-card-live-clickable {
    cursor: default;
  }
}
</style>