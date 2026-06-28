<template>
  <div class="bracket-page">

    <!-- Game selector -->
    <div class="game-selector">
      <button
        v-for="game in games" :key="game.id"
        class="game-card"
        :class="{ active: selectedGame === game.id, live: liveGames.has(game.id) }"
        :style="{ '--game-color': game.color }"
        @click="selectGame(game.id)"
      >
        <span v-if="liveGames.has(game.id)" class="live-pill">
          <span class="live-dot"></span>LIVE
          <v-icon size="10">mdi-twitch</v-icon>
        </span>
        <img :src="game.icon" :alt="game.label" class="game-icon" />
        <span class="game-label">{{ game.label }}</span>
        <span v-if="!liveGames.has(game.id) && gameStartTimes[game.id]" class="game-start-time">{{ gameStartTimes[game.id] }}</span>
      </button>
    </div>

    <!-- Header -->
    <div class="bracket-header">
      <div class="header-eyebrow">JOGÁLIA 2026 · {{ currentGame.label }}</div>
      <div class="sync-status" :class="syncState">
        <span class="sync-dot"></span>
        <span v-if="syncState === 'loading'">A carregar...</span>
        <span v-else-if="syncState === 'ok'">Atualizado · {{ lastSyncTime }}</span>
        <span v-else>Erro ao carregar ficheiros</span>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!teamsLoaded || !matchesLoaded" class="empty-state">
      <v-icon size="64" color="#0686F3" class="mb-4">mdi-sword-cross</v-icon>
      <div class="empty-title">{{ syncState === 'error' ? 'Não foi possível carregar os ficheiros' : 'A carregar bracket...' }}</div>
      <div class="empty-sub">public/{{ selectedGame }}/teams.xlsx · matches.xlsx</div>
    </div>

    <!-- ══ EA FC LEAGUE VIEW ══ -->
    <template v-else-if="selectedGame === 'fc'">
      <div class="phase-label">
        <span class="phase-line"></span>
        <span class="phase-text phase-text--gold">LIGA · TODOS CONTRA TODOS</span>
        <span class="phase-line"></span>
      </div>

      <div class="league-table-wrap">
        <div class="league-table">
          <div class="lt-header">
            <span class="lt-pos-col"></span>
            <span class="lt-logo-col"></span>
            <span class="lt-name-col">Equipa</span>
            <span class="lt-stat-col">J</span>
            <span class="lt-stat-col lt-highlight">V</span>
            <span class="lt-stat-col">E</span>
            <span class="lt-stat-col">D</span>
            <span class="lt-stat-col">GM</span>
            <span class="lt-stat-col">GS</span>
            <span class="lt-stat-col">GD</span>
            <span class="lt-stat-col lt-pts-col">Pts</span>
          </div>
          <div
            v-for="(entry, i) in leagueStandings"
            :key="'lt-' + entry.seed"
            class="lt-row"
            :class="leagueRowClass(i)"
          >
            <span class="lt-pos-col lt-pos-val" :class="leaguePosClass(i)">{{ i + 1 }}</span>
            <span class="lt-logo-col">
              <span class="lt-logo-wrap">
                <img v-if="entry.team && !brokenLogos.has(logoKey(entry.team))"
                  :src="logoPath(entry.team)" class="lt-logo"
                  @error="brokenLogos.add(logoKey(entry.team))" />
                <span v-else class="lt-logo-placeholder">{{ entry.name.charAt(0) }}</span>
              </span>
            </span>
            <span class="lt-name-col lt-name-val">
              <span class="lt-seed">#{{ entry.seed }}</span>{{ entry.name }}
            </span>
            <span class="lt-stat-col lt-stat-val">{{ entry.played }}</span>
            <span class="lt-stat-col lt-stat-val lt-wins">{{ entry.wins }}</span>
            <span class="lt-stat-col lt-stat-val">{{ entry.draws }}</span>
            <span class="lt-stat-col lt-stat-val lt-losses">{{ entry.losses }}</span>
            <span class="lt-stat-col lt-stat-val">{{ entry.gf }}</span>
            <span class="lt-stat-col lt-stat-val">{{ entry.ga }}</span>
            <span class="lt-stat-col lt-stat-val" :class="entry.gd > 0 ? 'lt-gd-pos' : entry.gd < 0 ? 'lt-gd-neg' : ''">{{ entry.gd > 0 ? '+' + entry.gd : entry.gd }}</span>
            <span class="lt-stat-col lt-pts-col lt-pts-val">{{ entry.pts }}</span>
          </div>
        </div>
        <div class="league-legend">
          <span class="legend-dot legend-dot--gold"></span><span class="legend-label">1.º lugar · Campeão</span>
        </div>
      </div>

      <div class="phase-label" style="margin-top:28px">
        <span class="phase-line"></span>
        <span class="phase-text">RESULTADOS · CALENDÁRIO</span>
        <span class="phase-line"></span>
      </div>

      <div class="league-matches-grid">
        <div
          v-for="match in leagueMatches"
          :key="'lm-' + match.match_id"
          class="match-card"
          :class="matchCardClass(match)"
          @click="onMatchCardClick(match)"
        >
          <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
            <span v-if="isLive(match)" class="tag-live-dot"></span>
            {{ isLive(match) ? 'LIVE' : 'LIGA' }}
          </div>
          <div v-if="match.start_time && !isLive(match) && match.status !== 'done'" class="match-time-row">
            <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
          </div>
          <MatchTeamRows :match="match" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
          <MatchStatusBadge :match="match" :is-live="isLive(match)" />
        </div>
      </div>
    </template>

    <!-- ══ VALORANT VIEW ══ -->
    <template v-else-if="selectedGame === 'val'">

        <!-- FASE DE GRUPOS -->
      <div class="phase-label">
        <span class="phase-line"></span>
        <span class="phase-text">FASE DE GRUPOS · BO1 · 5 EQUIPAS POR GRUPO</span>
        <span class="phase-line"></span>
      </div>

      <div class="val-groups-grid">
        <div
          v-for="grp in valGroupList" :key="grp.id"
          class="group-block"
          :style="{ '--grp-color': grp.color }"
        >
          <div class="group-header">
            <span class="group-badge">{{ grp.arena }}</span>
            <span class="group-badge-sub">GRUPO {{ grp.id }}</span>
            <div class="group-standings-mini">
              <span
                v-for="(entry, i) in valGroupStandings(grp.id)" :key="entry.seed"
                class="standing-pip"
                :class="{ 'pip-first': i === 0, 'pip-second': i === 1, 'pip-done': entry.played > 0 }"
                :title="`#${entry.seed} ${entry.name} — ${entry.wins}V ${entry.losses}D`"
              ></span>
            </div>
          </div>

          <div class="standings-table">
            <div class="st-head">
              <span class="st-team">Equipa</span>
              <span class="st-stat">V</span>
              <span class="st-stat">D</span>
              <span class="st-stat">J</span>
            </div>
            <div
              v-for="(entry, i) in valGroupStandings(grp.id)" :key="'st-' + entry.seed"
              class="st-row"
              :class="valStandingRowClass(grp.id, i)"
            >
              <span class="st-pos" :class="{ 'st-pos--advance': i < 2 && valGroupComplete(grp.id) }">{{ i + 1 }}</span>
              <span class="st-logo-wrap">
                <img v-if="entry.team && !brokenLogos.has(logoKey(entry.team))"
                  :src="logoPath(entry.team)" class="st-logo"
                  @error="brokenLogos.add(logoKey(entry.team))" />
                <span v-else class="st-logo-placeholder">{{ entry.name.charAt(0) }}</span>
              </span>
              <span class="st-name">#{{ entry.seed }} {{ entry.name }}</span>
              <span class="st-stat-val">{{ entry.wins }}</span>
              <span class="st-stat-val">{{ entry.losses }}</span>
              <span class="st-stat-val st-played">{{ entry.played }}</span>
            </div>
          </div>

          <button class="matches-toggle" @click="toggleGroup(grp.id)">
            <span>{{ collapsedGroups[grp.id] ? 'Ver jogos' : 'Esconder jogos' }}</span>
            <v-icon size="14">{{ collapsedGroups[grp.id] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </button>

          <div v-show="!collapsedGroups[grp.id]" class="group-matches">
            <div
              v-for="match in valGroupMatches(grp.id)" :key="'vgm-' + match.match_id"
              class="match-card"
              :class="matchCardClass(match)"
              @click="onMatchCardClick(match)"
            >
              <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                <span v-if="isLive(match)" class="tag-live-dot"></span>
                {{ isLive(match) ? 'LIVE' : 'BO1' }}
              </div>
              <div v-if="match.start_time && !isLive(match) && match.status !== 'done'" class="match-time-row">
                <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
              </div>
              <MatchTeamRows :match="match" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
              <MatchStatusBadge :match="match" :is-live="isLive(match)" />
            </div>
          </div>

          <!-- Top 2 advance strip -->
          <div class="val-advances-wrap">
            <div v-if="valGroupComplete(grp.id)" class="val-advances-list">
              <div
                v-for="(entry, i) in valGroupStandings(grp.id).slice(0,2)" :key="'adv-'+entry.seed"
                class="val-advance-row"
                :class="i === 0 ? 'val-advance-row--first' : 'val-advance-row--second'"
              >
                <v-icon size="11" :color="i === 0 ? '#FFB404' : '#94A3B8'" style="flex-shrink:0">mdi-arrow-right-circle</v-icon>
                <img v-if="entry.team && !brokenLogos.has(logoKey(entry.team))"
                  :src="logoPath(entry.team)" class="gw-logo"
                  @error="brokenLogos.add(logoKey(entry.team))" />
                <span v-else class="gw-logo-placeholder">{{ entry.name.charAt(0) }}</span>
                <span class="gw-seed">#{{ entry.seed }}</span>
                <span class="gw-name">{{ entry.name }}</span>
                <span class="gw-advances" :class="i === 0 ? 'gw-advances--mf1' : 'gw-advances--mf2'">
                  {{ grp.id === 'A' ? (i === 0 ? 'MF1 · vs 2.ºB' : 'MF2 · vs 1.ºB') : (i === 0 ? 'MF2 · vs 2.ºA' : 'MF1 · vs 1.ºA') }}
                </span>
              </div>
            </div>
            <div v-else class="group-winner-tbd">
              <v-icon size="12" style="opacity:0.3">mdi-help-circle-outline</v-icon>
              <span>Top 2 a definir</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MEIAS-FINAIS BO1 -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line"></span>
        <span class="phase-text phase-text--red">MEIAS-FINAIS · BO1 · 22:10</span>
        <span class="phase-line"></span>
      </div>

      <div class="val-ko-grid">
        <div class="val-ko-semis">
          <div
            v-for="match in valSemiFinals" :key="'vsf-' + match.match_id"
            class="match-card val-ko-card"
            :class="matchCardClass(match)"
            @click="onMatchCardClick(match)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
              <span v-if="isLive(match)" class="tag-live-dot"></span>
              {{ isLive(match) ? 'LIVE' : 'BO1' }}
            </div>
            <div v-if="match.start_time && !isLive(match) && match.status !== 'done'" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
            </div>
            <MatchTeamRows :match="match" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
            <MatchStatusBadge :match="match" :is-live="isLive(match)" />
          </div>
        </div>
      </div>

      <!-- FINAL + 3.º LUGAR -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line"></span>
        <span class="phase-text phase-text--gold">FINAL & 3.º LUGAR · BO3 · 23:10</span>
        <span class="phase-line"></span>
      </div>

      <div class="val-final-grid">

        <!-- 3rd place -->
        <div class="val-final-col">
          <div class="val-final-col-label">3.º / 4.º LUGAR</div>
          <div
            v-if="valThirdPlace"
            class="match-card match-card--bo3"
            :class="matchCardClass(valThirdPlace)"
            @click="onMatchCardClick(valThirdPlace)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(valThirdPlace) }">
              <span v-if="isLive(valThirdPlace)" class="tag-live-dot"></span>
              {{ isLive(valThirdPlace) ? 'LIVE' : 'BO3' }}
            </div>
            <div v-if="valThirdPlace.start_time && !isLive(valThirdPlace) && valThirdPlace.status !== 'done'" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ valThirdPlace.start_time }}
            </div>
            <MatchTeamRows :match="valThirdPlace" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
            <MatchStatusBadge :match="valThirdPlace" :is-live="isLive(valThirdPlace)" />
          </div>
          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar meias-finais</span>
          </div>

          <!-- 3rd place winner -->
          <div v-if="valThirdPlaceWinner" class="val-podium-row val-podium-row--bronze">
            <v-icon size="13" color="#94A3B8" style="flex-shrink:0">mdi-medal</v-icon>
            <img v-if="!brokenLogos.has(logoKey(valThirdPlaceWinner))"
              :src="logoPath(valThirdPlaceWinner)" class="gw-logo"
              @error="brokenLogos.add(logoKey(valThirdPlaceWinner))" />
            <span v-else class="gw-logo-placeholder">{{ valThirdPlaceWinner.name.charAt(0) }}</span>
            <span class="gw-seed">#{{ valThirdPlaceWinner.seed }}</span>
            <span class="gw-name">{{ valThirdPlaceWinner.name }}</span>
            <span class="gw-advances gw-advances--bronze">3.º LUGAR</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="val-final-divider">
          <div class="val-final-vs">VS</div>
        </div>

        <!-- Final -->
        <div class="val-final-col">
          <div class="val-final-col-label val-final-col-label--gold">FINAL</div>
          <div
            v-if="valFinal"
            class="match-card match-card--bo3 match-card--the-final"
            :class="matchCardClass(valFinal)"
            @click="onMatchCardClick(valFinal)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(valFinal) }">
              <span v-if="isLive(valFinal)" class="tag-live-dot"></span>
              {{ isLive(valFinal) ? 'LIVE' : 'BO3' }}
            </div>
            <div v-if="valFinal.start_time && !isLive(valFinal) && valFinal.status !== 'done'" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ valFinal.start_time }}
            </div>
            <MatchTeamRows :match="valFinal" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
            <MatchStatusBadge :match="valFinal" :is-live="isLive(valFinal)" />
          </div>
          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar meias-finais</span>
          </div>

          <!-- Champion -->
          <div v-if="valChampion" class="champion-card" style="margin-top:12px">
            <div class="champion-glow"></div>
            <img v-if="!brokenLogos.has(logoKey(valChampion))" :src="logoPath(valChampion)" class="champion-logo" @error="brokenLogos.add(logoKey(valChampion))" />
            <v-icon v-else size="40" color="#FFB404">mdi-trophy</v-icon>
            <div class="champion-seed">#{{ valChampion.seed }}</div>
            <div class="champion-name">{{ valChampion.name }}</div>
          </div>
        </div>

      </div>

    </template>

    <!-- ══ BRACKET VIEW (CS2 / LoL / RL) ══ -->
    <template v-else>

      <div class="phase-label">
        <span class="phase-line"></span>
        <span class="phase-text">FASE DE GRUPOS · BO1</span>
        <span class="phase-line"></span>
      </div>

      <div class="groups-grid">
        <div
          v-for="grp in groupList" :key="grp.id"
          class="group-block"
          :style="{ '--grp-color': grp.color }"
        >
          <div class="group-header">
            <span class="group-badge">GRUPO {{ grp.id }}</span>
            <div class="group-standings-mini">
              <span
                v-for="(entry, i) in groupStandings(grp.id)" :key="entry.seed"
                class="standing-pip"
                :class="{ 'pip-first': i === 0, 'pip-done': entry.played > 0 }"
                :title="`#${entry.seed} ${entry.name} — ${entry.wins}V ${entry.losses}D`"
              ></span>
            </div>
          </div>

          <div class="standings-table">
            <div class="st-head">
              <span class="st-team">Equipa</span>
              <span class="st-stat">V</span>
              <span class="st-stat">D</span>
              <span class="st-stat">J</span>
            </div>
            <div
              v-for="(entry, i) in groupStandings(grp.id)" :key="'st-' + entry.seed"
              class="st-row"
              :class="{ 'st-first': i === 0 && groupComplete(grp.id) }"
            >
              <span class="st-pos">{{ i + 1 }}</span>
              <span class="st-logo-wrap">
                <img v-if="entry.team && !brokenLogos.has(logoKey(entry.team))"
                  :src="logoPath(entry.team)" class="st-logo"
                  @error="brokenLogos.add(logoKey(entry.team))" />
                <span v-else class="st-logo-placeholder">{{ entry.name.charAt(0) }}</span>
              </span>
              <span class="st-name">#{{ entry.seed }} {{ entry.name }}</span>
              <span class="st-stat-val">{{ entry.wins }}</span>
              <span class="st-stat-val">{{ entry.losses }}</span>
              <span class="st-stat-val st-played">{{ entry.played }}</span>
            </div>
          </div>

          <button class="matches-toggle" @click="toggleGroup(grp.id)">
            <span>{{ collapsedGroups[grp.id] ? 'Ver jogos' : 'Esconder jogos' }}</span>
            <v-icon size="14">{{ collapsedGroups[grp.id] ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </button>

          <div v-show="!collapsedGroups[grp.id]" class="group-matches">
            <div
              v-for="match in groupMatches(grp.id)" :key="'gm-' + match.match_id"
              class="match-card"
              :class="matchCardClass(match)"
              @click="onMatchCardClick(match)"
            >
              <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                <span v-if="isLive(match)" class="tag-live-dot"></span>
                {{ isLive(match) ? 'LIVE' : 'BO1' }}
              </div>
              <div v-if="match.start_time && !isLive(match) && match.status !== 'done'" class="match-time-row">
                <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
              </div>
              <MatchTeamRows :match="match" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
              <MatchStatusBadge :match="match" :is-live="isLive(match)" />
            </div>
          </div>

          <div class="group-winner-wrap">
            <div v-if="groupWinner(grp.id)" class="group-winner-card">
              <v-icon size="13" color="#FFB404" style="flex-shrink:0">mdi-trophy</v-icon>
              <img v-if="!brokenLogos.has(logoKey(groupWinner(grp.id)))"
                :src="logoPath(groupWinner(grp.id))" class="gw-logo"
                @error="brokenLogos.add(logoKey(groupWinner(grp.id)))" />
              <span v-else class="gw-logo-placeholder">{{ groupWinner(grp.id).name.charAt(0) }}</span>
              <span class="gw-seed">#{{ groupWinner(grp.id).seed }}</span>
              <span class="gw-name">{{ groupWinner(grp.id).name }}</span>
              <span class="gw-advances">AVANÇA</span>
            </div>
            <div v-else class="group-winner-tbd">
              <v-icon size="12" style="opacity:0.3">mdi-help-circle-outline</v-icon>
              <span>1.º lugar a definir</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FINAL 4 -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line"></span>
        <span class="phase-text phase-text--gold">FINAL 4</span>
        <span class="phase-line"></span>
      </div>

      <div class="final4-wrapper">
        <div class="final4-grid">

          <div class="f4-col">
            <div class="f4-col-label">MEIAS-FINAIS · BO3</div>
            <div class="f4-semis">
              <div
                v-for="match in semiFinals" :key="'sf-' + match.match_id"
                class="match-card match-card--bo3"
                :class="matchCardClass(match)"
                @click="onMatchCardClick(match)"
              >
                <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                  <span v-if="isLive(match)" class="tag-live-dot"></span>
                  {{ isLive(match) ? 'LIVE' : 'BO3' }}
                </div>
                <div v-if="match.start_time && !isLive(match) && match.status !== 'done'" class="match-time-row">
                  <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
                </div>
                <MatchTeamRows :match="match" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
                <MatchStatusBadge :match="match" :is-live="isLive(match)" />
              </div>
            </div>
          </div>

          <div class="f4-connector">
            <svg viewBox="0 0 56 220" preserveAspectRatio="none" style="width:100%;height:100%">
              <path d="M0,55 L28,55 L28,110 L56,110" stroke="rgba(6,134,243,0.22)" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
              <path d="M0,165 L28,165 L28,110 L56,110" stroke="rgba(6,134,243,0.22)" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
            </svg>
          </div>

          <div class="f4-col">
            <div class="f4-col-label">FINAL · BO3</div>
            <div class="f4-final" v-if="theFinal">
              <div
                class="match-card match-card--bo3 match-card--the-final"
                :class="matchCardClass(theFinal)"
                @click="onMatchCardClick(theFinal)"
              >
                <div class="match-format-tag" :class="{ 'tag-live': isLive(theFinal) }">
                  <span v-if="isLive(theFinal)" class="tag-live-dot"></span>
                  {{ isLive(theFinal) ? 'LIVE' : 'BO3' }}
                </div>
                <div v-if="theFinal.start_time && !isLive(theFinal) && theFinal.status !== 'done'" class="match-time-row">
                  <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ theFinal.start_time }}
                </div>
                <MatchTeamRows :match="theFinal" :broken-logos="brokenLogos" @broken="brokenLogos.add($event)" />
                <MatchStatusBadge :match="theFinal" :is-live="isLive(theFinal)" />
              </div>
            </div>
          </div>

          <div class="f4-col f4-col--champion" v-if="champion">
            <div class="f4-col-label">CAMPEÃO</div>
            <div class="champion-card">
              <div class="champion-glow"></div>
              <img v-if="!brokenLogos.has(logoKey(champion))" :src="logoPath(champion)" class="champion-logo" @error="brokenLogos.add(logoKey(champion))" />
              <v-icon v-else size="40" color="#FFB404">mdi-trophy</v-icon>
              <div class="champion-seed">#{{ champion.seed }}</div>
              <div class="champion-name">{{ champion.name }}</div>
            </div>
          </div>

        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, defineComponent } from 'vue'
import * as XLSX from 'xlsx'

// ── Shared sub-components ─────────────────────────────────────────────────────
const TeamLogo = defineComponent({
  props: ['team', 'brokenLogos'],
  emits: ['broken'],
  setup(props, { emit }) {
    function slugify(n) { return n.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'') }
    function logoPath(t) { return `/logos/${slugify(t.name)}.png` }
    function logoKey(t)  { return logoPath(t) }
    return { logoPath, logoKey }
  },
  template: `
    <span class="team-logo-wrap">
      <template v-if="team">
        <img v-if="!brokenLogos.has(logoKey(team))"
          :src="logoPath(team)" class="team-logo-img" :alt="team.name"
          @error="$emit('broken', logoKey(team))" />
        <span v-else class="team-logo-placeholder">{{ team.name.charAt(0).toUpperCase() }}</span>
      </template>
      <span v-else class="team-logo-placeholder team-logo-tbd">?</span>
    </span>
  `
})

// Reusable team rows for match cards
const MatchTeamRows = defineComponent({
  props: ['match', 'brokenLogos'],
  emits: ['broken'],
  components: { TeamLogo },
  setup(props) {
    function teamRowClass(m, slot) {
      if (m.status === 'done' && m.winner === null) return { draw: true }
      return {
        winner: m.status === 'done' && m.winner === slot,
        loser:  m.status === 'done' && m.winner !== slot,
        tbd:    !(slot === 1 ? m.team1 : m.team2),
      }
    }
    function showScore(m, slot) {
      const score = slot === 1 ? m.score1 : m.score2
      return (m.status === 'done' || (m.live && m.live !== '' && m.live !== '0' && m.live !== 'false' && m.live !== 'FALSE' && m.live !== false && m.live !== 0)) && score != null && score !== ''
    }
    return { teamRowClass, showScore }
  },
  template: `
    <div class="team-row" :class="teamRowClass(match, 1)">
      <TeamLogo :team="match.team1" :broken-logos="brokenLogos" @broken="$emit('broken', $event)" />
      <span class="seed" v-if="match.team1">#{{ match.team1.seed }}</span>
      <span class="seed tbd-seed" v-else>?</span>
      <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
      <span class="score" v-if="showScore(match, 1)">{{ match.score1 }}</span>
    </div>
    <div class="match-divider"></div>
    <div class="team-row" :class="teamRowClass(match, 2)">
      <TeamLogo :team="match.team2" :broken-logos="brokenLogos" @broken="$emit('broken', $event)" />
      <span class="seed" v-if="match.team2">#{{ match.team2.seed }}</span>
      <span class="seed tbd-seed" v-else>?</span>
      <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
      <span class="score" v-if="showScore(match, 2)">{{ match.score2 }}</span>
    </div>
  `
})

// Reusable status badge
const MatchStatusBadge = defineComponent({
  props: ['match', 'isLive'],
  template: `
    <div v-if="isLive" class="match-status-badge live-badge"><span class="live-badge-dot"></span> A decorrer</div>
    <div v-else-if="match.status === 'done'" class="match-status-badge done"><v-icon size="10">mdi-check</v-icon> Concluído</div>
    <div v-else class="match-status-badge pending"><v-icon size="10">mdi-clock-outline</v-icon> A aguardar</div>
  `
})

// ── Config ────────────────────────────────────────────────────────────────────
// CS2/LoL/RL: 4 groups of 4
const groupList = [
  { id: 'A', color: '#F4A723' },
  { id: 'B', color: '#A855F7' },
  { id: 'C', color: '#00DDFE' },
  { id: 'D', color: '#22C55E' },
]

// Valorant: 2 groups of 5
const valGroupList = [
  { id: 'A', color: '#FF4655', arena: 'ARENA OMEN' },
  { id: 'B', color: '#BD3944', arena: 'ARENA EXSAD' },
]

const games = [
  { id: 'cs2', label: 'CS2',        color: '#F4A723', icon: '/icons/cs2.png' },
  { id: 'lol', label: 'LoL',        color: '#C89B3C', icon: '/icons/lol.png' },
  { id: 'val', label: 'Valorant',   color: '#FF4655', icon: '/icons/val.png' },
  { id: 'rl',  label: 'Rocket Lg.', color: '#0286F7', icon: '/icons/rl.png'  },
  { id: 'fc',  label: 'EA FC',      color: '#00ACED', icon: '/icons/fc.png'  },
]

// ── Logos ─────────────────────────────────────────────────────────────────────
const brokenLogos = reactive(new Set())
function slugify(n) { return n.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'') }
function logoPath(t) { return `/logos/${slugify(t.name)}.png` }
function logoKey(t)  { return logoPath(t) }

// ── Collapse state ────────────────────────────────────────────────────────────
const collapsedGroups = reactive({ A: false, B: false, C: false, D: false })
function toggleGroup(id) { collapsedGroups[id] = !collapsedGroups[id] }

// ── Click ─────────────────────────────────────────────────────────────────────
function onMatchCardClick(match) {
  if (!match || !isLive(match)) return
  if (window.innerWidth >= 840) window.open('https://www.twitch.tv/jogaliaoficial', '_blank', 'noopener')
}

// ── Live ──────────────────────────────────────────────────────────────────────
function isLiveRaw(m) {
  const v = m.live
  if (v === null || v === undefined || v === '' || v === 0 || v === '0' || v === false || v === 'false' || v === 'FALSE') return false
  return true
}
function isLive(m) { return m ? isLiveRaw(m) : false }

// ── All-games live tracking ───────────────────────────────────────────────────
const allGameMatches = reactive({})
const liveGames = computed(() => {
  const s = new Set()
  for (const [id, ms] of Object.entries(allGameMatches)) { if (ms.some(m => isLiveRaw(m))) s.add(id) }
  return s
})
const gameStartTimes = computed(() => {
  const map = {}
  for (const [id, ms] of Object.entries(allGameMatches)) {
    const t = ms.map(m => m.start_time).filter(Boolean)
    if (t.length) map[id] = t[0]
  }
  return map
})

// ── Selected game ─────────────────────────────────────────────────────────────
const selectedGame = ref('cs2')
const currentGame  = computed(() => games.find(g => g.id === selectedGame.value) || games[0])
function selectGame(id) {
  if (id === selectedGame.value) return
  selectedGame.value = id
  teams.value = []; matches.value = []
  teamsLoaded.value = false; matchesLoaded.value = false
  syncState.value = 'loading'
  refresh()
}

// ── Data ──────────────────────────────────────────────────────────────────────
const teams = ref([]); const matches = ref([])
const teamsLoaded = ref(false); const matchesLoaded = ref(false)
const syncState = ref('loading'); const lastSyncTime = ref('')
let pollInterval = null

async function fetchXlsx(url) {
  const res = await fetch(`${url}?_=${Date.now()}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = await res.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
}

async function refreshAllGamesLive() {
  for (const g of games) {
    try { allGameMatches[g.id] = await fetchXlsx(`/${g.id}/matches.xlsx`) } catch {}
  }
}

async function refresh() {
  try {
    const [td, md] = await Promise.all([
      fetchXlsx(`/${selectedGame.value}/teams.xlsx`),
      fetchXlsx(`/${selectedGame.value}/matches.xlsx`),
    ])
    teams.value = td; matches.value = md
    allGameMatches[selectedGame.value] = md
    teamsLoaded.value = true; matchesLoaded.value = true
    syncState.value = 'ok'
    lastSyncTime.value = new Date().toLocaleTimeString('pt-PT', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
  } catch (e) {
    console.error('[TournamentBracket]', e)
    syncState.value = 'error'
  }
  refreshAllGamesLive()
}

onMounted(() => { refresh(); pollInterval = setInterval(refresh, 10_000) })
onUnmounted(() => clearInterval(pollInterval))

// ── Helpers ───────────────────────────────────────────────────────────────────
function teamBySeed(seed) {
  if (!seed || seed === 0) return null
  return teams.value.find(t => t.seed === seed) || null
}

function enrichMatch(m) {
  if (!m) return null
  const t1 = teamBySeed(m.team1_seed), t2 = teamBySeed(m.team2_seed)
  let winner = null
  if (m.status === 'done') {
    const s1 = Number(m.score1), s2 = Number(m.score2)
    if (s1 > s2) winner = 1
    else if (s2 > s1) winner = 2
  }
  return { ...m, team1: t1, team2: t2, winner }
}

function matchCardClass(m) {
  if (!m) return {}
  return {
    'match-live':           isLive(m),
    'match-done':           !isLive(m) && m.status === 'done',
    'match-pending':        !isLive(m) && m.status !== 'done',
    'match-live-clickable': isLive(m),
  }
}

// ── CS2/LoL/RL group helpers (4 groups of 4, 6 matches per group) ─────────────
function groupMatches(grpId) {
  return matches.value.filter(m => m.group === grpId && m.round === 1).map(enrichMatch)
}

function groupComplete(grpId) {
  const ms = groupMatches(grpId)
  return ms.length >= 6 && ms.every(m => m.status === 'done')
}

function groupStandings(grpId) {
  const ms = groupMatches(grpId)
  const seedSet = new Set()
  ms.forEach(m => { if (m.team1_seed) seedSet.add(m.team1_seed); if (m.team2_seed) seedSet.add(m.team2_seed) })
  const stats = {}
  seedSet.forEach(seed => {
    const team = teamBySeed(seed)
    stats[seed] = { seed, name: team?.name ?? `#${seed}`, team, wins: 0, losses: 0, played: 0 }
  })
  ms.forEach(m => {
    if (m.status !== 'done') return
    const w = m.winner === 1 ? m.team1_seed : m.team2_seed
    const l = m.winner === 1 ? m.team2_seed : m.team1_seed
    if (stats[w]) { stats[w].wins++; stats[w].played++ }
    if (stats[l]) { stats[l].losses++; stats[l].played++ }
  })
  return Object.values(stats).sort((a, b) => b.wins - a.wins || a.losses - b.losses)
}

function groupWinner(grpId) {
  if (!groupComplete(grpId)) return null
  return groupStandings(grpId)[0]?.team ?? null
}

// ── CS2/LoL/RL Final 4 (round=2 semis, round=3 final) ────────────────────────
const semiFinals = computed(() => matches.value.filter(m => m.round === 2).map(enrichMatch))
const theFinal   = computed(() => { const m = matches.value.find(m => m.round === 3); return m ? enrichMatch(m) : null })
const champion   = computed(() => {
  const f = theFinal.value
  if (!f || f.status !== 'done') return null
  return f.winner === 1 ? f.team1 : f.team2
})

// ── Valorant group helpers (2 groups of 5, 10 matches per group) ──────────────
function valGroupMatches(grpId) {
  return matches.value.filter(m => m.group === grpId && m.round === 1).map(enrichMatch)
}

function valGroupComplete(grpId) {
  const ms = valGroupMatches(grpId)
  return ms.length >= 10 && ms.every(m => m.status === 'done')
}

function valGroupStandings(grpId) {
  const ms = valGroupMatches(grpId)
  const seedSet = new Set()
  ms.forEach(m => { if (m.team1_seed) seedSet.add(m.team1_seed); if (m.team2_seed) seedSet.add(m.team2_seed) })
  const stats = {}
  seedSet.forEach(seed => {
    const team = teamBySeed(seed)
    stats[seed] = { seed, name: team?.name ?? `#${seed}`, team, wins: 0, losses: 0, played: 0 }
  })
  ms.forEach(m => {
    if (m.status !== 'done') return
    const w = m.winner === 1 ? m.team1_seed : m.team2_seed
    const l = m.winner === 1 ? m.team2_seed : m.team1_seed
    if (stats[w]) { stats[w].wins++; stats[w].played++ }
    if (stats[l]) { stats[l].losses++; stats[l].played++ }
  })
  return Object.values(stats).sort((a, b) => b.wins - a.wins || a.losses - b.losses)
}

function valStandingRowClass(grpId, i) {
  const complete = valGroupComplete(grpId)
  return {
    'st-first':  i === 0 && complete,
    'st-second': i === 1 && complete,
  }
}

// ── Valorant knockout (round=2 semis BO1, round=3 third place BO3, round=4 final BO3)
const valSemiFinals    = computed(() => matches.value.filter(m => m.round === 2).map(enrichMatch))
const valThirdPlace    = computed(() => { const m = matches.value.find(m => m.round === 3); return m ? enrichMatch(m) : null })
const valFinal         = computed(() => { const m = matches.value.find(m => m.round === 4); return m ? enrichMatch(m) : null })
const valChampion      = computed(() => {
  const f = valFinal.value
  if (!f || f.status !== 'done') return null
  return f.winner === 1 ? f.team1 : f.team2
})
const valThirdPlaceWinner = computed(() => {
  const f = valThirdPlace.value
  if (!f || f.status !== 'done') return null
  return f.winner === 1 ? f.team1 : f.team2
})

// ── EA FC League helpers ──────────────────────────────────────────────────────
const leagueMatches = computed(() =>
  matches.value.map(enrichMatch).sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return -1
    if (b.status === 'done' && a.status !== 'done') return 1
    return (a.match_id ?? 0) - (b.match_id ?? 0)
  })
)

const leagueStandings = computed(() => {
  const stats = {}
  teams.value.forEach(t => {
    stats[t.seed] = { seed: t.seed, name: t.name, team: t, pts: 0, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0 }
  })
  leagueMatches.value.forEach(m => {
    if (m.status !== 'done') return
    const s1 = Number(m.score1 ?? 0), s2 = Number(m.score2 ?? 0)
    const e1 = stats[m.team1_seed], e2 = stats[m.team2_seed]
    if (e1) { e1.played++; e1.gf += s1; e1.ga += s2; e1.gd += s1 - s2 }
    if (e2) { e2.played++; e2.gf += s2; e2.ga += s1; e2.gd += s2 - s1 }
    if (s1 > s2) {
      if (e1) { e1.wins++; e1.pts += 3 }
      if (e2) { e2.losses++ }
    } else if (s2 > s1) {
      if (e2) { e2.wins++; e2.pts += 3 }
      if (e1) { e1.losses++ }
    } else {
      if (e1) { e1.draws++; e1.pts += 1 }
      if (e2) { e2.draws++; e2.pts += 1 }
    }
  })
  return Object.values(stats).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.seed - b.seed)
})

function leagueRowClass(i) { return { 'lt-row--champion': i === 0 } }
function leaguePosClass(i) { return i === 0 ? 'lt-pos--gold' : '' }
</script>

<style scoped>
.bracket-page { background: #00072B; min-height: 100%; padding: 16px 16px 64px; color: #fff; font-family: 'Rajdhani','Roboto Condensed','Roboto',sans-serif; }

/* Game selector */
.game-selector { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 24px; }
.game-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 4px 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; cursor: pointer; transition: background .18s,border-color .18s,box-shadow .18s,transform .12s; -webkit-tap-highlight-color: transparent; }
.game-card:active { transform: scale(.95); }
.game-card.active { background: color-mix(in srgb, var(--game-color) 12%, transparent); border-color: color-mix(in srgb, var(--game-color) 60%, transparent); box-shadow: 0 0 16px color-mix(in srgb, var(--game-color) 25%, transparent); }
.game-card.live { background: rgba(220,38,38,.1); border-color: rgba(220,38,38,.6); box-shadow: 0 0 18px rgba(220,38,38,.3); animation: live-card-pulse 2.5s ease-in-out infinite; }
@keyframes live-card-pulse { 0%,100%{box-shadow:0 0 18px rgba(220,38,38,.3)} 50%{box-shadow:0 0 28px rgba(220,38,38,.55)} }
.live-pill { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 4px; font-size: 8px; font-weight: 900; letter-spacing: .12em; color: #fff; background: #DC2626; border-radius: 4px; padding: 1px 6px; white-space: nowrap; }
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #fff; animation: pulse-dot 1.2s ease-in-out infinite; }
.game-icon { width: 36px; height: 36px; object-fit: contain; background: rgba(255,255,255,.04); border-radius: 6px; }
.game-card:not(.active):not(.live) .game-icon { filter: grayscale(60%) opacity(.6); }
.game-label { font-size: 9px; font-weight: 800; letter-spacing: .1em; color: rgba(255,255,255,.45); white-space: nowrap; }
.game-card.active .game-label, .game-card.live .game-label { color: #fff; }
.game-start-time { font-size: 8px; font-weight: 700; color: rgba(255,255,255,.3); }

/* Header */
.bracket-header { text-align: center; margin-bottom: 24px; }
.header-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .2em; color: #FFB404; margin-bottom: 8px; }
.sync-status { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; letter-spacing: .08em; padding: 5px 14px; border-radius: 20px; border: 1px solid transparent; }
.sync-status.loading { color: rgba(255,255,255,.4); border-color: rgba(255,255,255,.1); background: rgba(255,255,255,.04); }
.sync-status.ok      { color: rgba(0,221,254,.8); border-color: rgba(0,221,254,.2); background: rgba(0,221,254,.05); }
.sync-status.error   { color: rgba(250,102,0,.9); border-color: rgba(250,102,0,.3); background: rgba(250,102,0,.06); }
.sync-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.sync-status.ok .sync-dot      { background: #00DDFE; box-shadow: 0 0 6px #00DDFE; animation: pulse-dot 2s ease-in-out infinite; }
.sync-status.error .sync-dot   { background: #FA6600; }
.sync-status.loading .sync-dot { background: rgba(255,255,255,.3); }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }

/* Empty */
.empty-state { text-align: center; padding: 60px 16px; }
.empty-title { font-size: 18px; font-weight: 600; color: rgba(255,255,255,.6); margin-bottom: 8px; }
.empty-sub   { font-size: 13px; color: rgba(255,255,255,.3); letter-spacing: .1em; }

/* Phase dividers */
.phase-label { display: flex; align-items: center; gap: 14px; margin: 0 0 20px; }
.phase-line  { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(6,134,243,.3), transparent); }
.phase-text  { font-size: 11px; font-weight: 900; letter-spacing: .25em; color: rgba(0,221,254,.6); white-space: nowrap; }
.phase-label--f4   { margin-top: 32px; }
.phase-text--gold  { color: rgba(255,180,4,.85); }
.phase-text--red   { color: rgba(255,70,85,.85); }

/* ── VALORANT SCHEDULE STRIP ─────────────────────────────────────────────── */
.val-schedule-strip {
  margin-bottom: 24px;
  background: rgba(255,70,85,.04);
  border: 1px solid rgba(255,70,85,.15);
  border-radius: 10px;
  overflow-x: auto;
  padding: 10px 12px;
}
.val-schedule-inner {
  display: flex;
  gap: 0;
  min-width: max-content;
}
.val-sched-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  border-right: 1px solid rgba(255,255,255,.06);
  min-width: 100px;
}
.val-sched-item:last-child { border-right: none; }
.val-sched-item--break {
  background: rgba(255,255,255,.03);
  opacity: 0.5;
}
.val-sched-item--ko {
  background: rgba(255,180,4,.04);
}
.val-sched-time {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .1em;
  color: rgba(255,70,85,.8);
}
.val-sched-item--break .val-sched-time { color: rgba(255,255,255,.3); }
.val-sched-item--ko .val-sched-time { color: #FFB404; }
.val-sched-desc {
  font-size: 9px;
  font-weight: 600;
  color: rgba(255,255,255,.4);
  text-align: center;
  line-height: 1.3;
}
.val-sched-item--ko .val-sched-desc { color: rgba(255,180,4,.7); }

/* ── VALORANT GROUPS (2-col side by side) ────────────────────────────────── */
.val-groups-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 4px;
}
@media (min-width: 640px) {
  .val-groups-grid { grid-template-columns: 1fr 1fr; }
}

.group-badge-sub {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .1em;
  color: rgba(255,255,255,.3);
  margin-left: 6px;
}

/* 2nd place advance styling in standings */
.st-row.st-second { background: rgba(6,134,243,.05); }
.st-pos--advance { color: #FF4655 !important; }

/* Val advances strip */
.val-advances-wrap { margin-top: 2px; }
.val-advances-list { display: flex; flex-direction: column; gap: 5px; }
.val-advance-row {
  display: flex; align-items: center; gap: 7px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid;
}
.val-advance-row--first  { background: rgba(255,180,4,.06); border-color: rgba(255,180,4,.25); }
.val-advance-row--second { background: rgba(6,134,243,.05); border-color: rgba(6,134,243,.2); }
.gw-advances--mf1 { color: #FFB404; background: rgba(255,180,4,.1); border: 1px solid rgba(255,180,4,.25); }
.gw-advances--mf2 { color: #00DDFE; background: rgba(0,221,254,.08); border: 1px solid rgba(0,221,254,.2); }
.gw-advances--bronze { color: #94A3B8; background: rgba(148,163,184,.08); border: 1px solid rgba(148,163,184,.2); }

/* ── VALORANT SEMI-FINALS ────────────────────────────────────────────────── */
.val-ko-grid { margin-bottom: 4px; }
.val-ko-semis {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 540px) {
  .val-ko-semis { grid-template-columns: 1fr 1fr; }
}
.val-ko-card { border-color: rgba(255,70,85,.3) !important; }

/* ── VALORANT FINAL GRID ─────────────────────────────────────────────────── */
.val-final-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  align-items: start;
}
.val-final-col { display: flex; flex-direction: column; gap: 10px; }
.val-final-col-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .18em;
  color: rgba(255,255,255,.3);
  text-align: center;
  margin-bottom: 4px;
}
.val-final-col-label--gold { color: rgba(255,180,4,.75); }

.val-final-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  padding-top: 28px;
}
.val-final-vs {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .15em;
  color: rgba(255,255,255,.15);
}

.val-tbd-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(255,255,255,.02);
  border: 1px dashed rgba(255,255,255,.08);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,.2);
  text-align: center;
}

/* Podium row (3rd place) */
.val-podium-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid;
}
.val-podium-row--bronze {
  background: rgba(148,163,184,.05);
  border-color: rgba(148,163,184,.2);
}

/* Groups grid (CS2/LoL/RL) */
.groups-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 640px)  { .groups-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1100px) {
  .groups-grid { grid-template-columns: repeat(4, 1fr); }
  .game-selector { max-width: 480px; margin: 0 auto 24px; }
}

/* Group block */
.group-block { background: rgba(3,3,127,.1); border: 1px solid color-mix(in srgb, var(--grp-color) 22%, transparent); border-radius: 12px; padding: 14px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
.group-header { display: flex; align-items: center; justify-content: space-between; }
.group-badge  { font-size: 12px; font-weight: 900; letter-spacing: .18em; color: var(--grp-color); }
.group-standings-mini { display: flex; gap: 4px; }
.standing-pip { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.15); transition: background .3s; }
.standing-pip.pip-done   { background: rgba(255,255,255,.25); }
.standing-pip.pip-first  { background: var(--grp-color, #FFB404); border-color: transparent; box-shadow: 0 0 6px var(--grp-color, #FFB404); }
.standing-pip.pip-second { background: rgba(0,221,254,.5); border-color: transparent; }

/* Standings table */
.standings-table { background: rgba(0,0,0,.2); border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,.06); }
.st-head { display: grid; grid-template-columns: 20px 22px 1fr 22px 22px 22px; align-items: center; padding: 4px 8px; background: rgba(255,255,255,.04); gap: 4px; }
.st-team { grid-column: 3; font-size: 8px; font-weight: 800; letter-spacing: .12em; color: rgba(255,255,255,.3); }
.st-stat { font-size: 8px; font-weight: 800; letter-spacing: .08em; color: rgba(255,255,255,.3); text-align: center; }
.st-row { display: grid; grid-template-columns: 20px 22px 1fr 22px 22px 22px; align-items: center; padding: 5px 8px; gap: 4px; border-top: 1px solid rgba(255,255,255,.04); transition: background .15s; }
.st-row.st-first { background: rgba(255,180,4,.07); }
.st-pos { font-size: 10px; font-weight: 800; color: rgba(255,255,255,.25); text-align: center; }
.st-row.st-first .st-pos { color: #FFB404; }
.st-row.st-second .st-pos { color: #00DDFE; }
.st-logo-wrap { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; }
.st-logo { width: 20px; height: 20px; object-fit: contain; border-radius: 3px; }
.st-logo-placeholder { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; background: rgba(6,134,243,.15); border-radius: 3px; font-size: 9px; font-weight: 900; color: rgba(255,255,255,.5); }
.st-name { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-row.st-first .st-name { color: #fff; }
.st-row.st-second .st-name { color: rgba(255,255,255,.9); }
.st-stat-val { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.5); text-align: center; font-variant-numeric: tabular-nums; }
.st-row.st-first .st-stat-val { color: rgba(255,255,255,.85); }
.st-played { color: rgba(255,255,255,.25) !important; }

/* Matches toggle */
.matches-toggle { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 6px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 700; letter-spacing: .1em; color: rgba(255,255,255,.35); transition: background .15s, color .15s; -webkit-tap-highlight-color: transparent; }
.matches-toggle:hover { background: rgba(255,255,255,.06); color: rgba(255,255,255,.6); }

/* Match list */
.group-matches { display: flex; flex-direction: column; gap: 10px; }

/* Match card */
.match-card { position: relative; background: rgba(3,3,127,.25); border: 1px solid rgba(6,134,243,.2); border-radius: 8px; overflow: visible; transition: border-color .2s, box-shadow .2s; }
.match-card--bo3 { border-color: rgba(6,134,243,.3); }
.match-card--the-final { border-color: rgba(255,180,4,.35); box-shadow: 0 0 20px rgba(255,180,4,.07); }
.match-card.match-done    { border-color: rgba(6,134,243,.45); }
.match-card.match-pending { border-color: rgba(255,255,255,.08); }
.match-card.match-live    { border-color: rgba(220,38,38,.7); background: rgba(220,38,38,.06); box-shadow: 0 0 14px rgba(220,38,38,.2); animation: live-card-pulse 2.5s ease-in-out infinite; }
.match-live-clickable { cursor: pointer; }
.match-format-tag { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; letter-spacing: .12em; background: #03037F; border: 1px solid rgba(6,134,243,.4); border-radius: 3px; padding: 1px 6px; color: #00DDFE; white-space: nowrap; z-index: 1; }
.match-format-tag.tag-live { background: #7F1D1D; border-color: rgba(220,38,38,.6); color: #FCA5A5; }
.tag-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #F87171; animation: pulse-dot 1.2s ease-in-out infinite; flex-shrink: 0; }
.match-time-row { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; color: rgba(255,255,255,.4); padding: 4px 10px 0; }
.team-logo-wrap { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex-shrink: 0; }
.team-logo-img  { width: 22px; height: 22px; object-fit: contain; border-radius: 3px; }
.team-logo-placeholder { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: rgba(6,134,243,.15); border: 1px solid rgba(6,134,243,.2); border-radius: 3px; font-size: 10px; font-weight: 900; color: rgba(255,255,255,.5); }
.team-logo-tbd  { background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.08); color: rgba(255,255,255,.2); }
.team-row { display: flex; align-items: center; gap: 7px; padding: 8px 10px; transition: background .15s; }
.team-row.winner { background: rgba(0,221,254,.08); }
.team-row.loser  { opacity: .4; }
.team-row.draw   { opacity: .7; }
.team-row.tbd    { opacity: .35; }
.seed { font-size: 9px; font-weight: 800; color: #FFB404; min-width: 20px; }
.seed.tbd-seed { color: rgba(255,255,255,.3); }
.team-name { flex: 1; font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.score { font-size: 14px; font-weight: 900; color: #00DDFE; min-width: 20px; text-align: right; font-variant-numeric: tabular-nums; }
.team-row.winner .score { color: #00DDFE; }
.team-row.loser  .score { color: rgba(255,255,255,.3); }
.team-row.draw   .score { color: rgba(255,255,255,.6); }
.match-divider { height: 1px; background: rgba(255,255,255,.07); margin: 0 10px; }
.match-status-badge { display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; letter-spacing: .1em; padding: 4px 10px; border-top: 1px solid rgba(255,255,255,.05); }
.match-status-badge.done       { color: rgba(0,221,254,.6); }
.match-status-badge.pending    { color: rgba(255,255,255,.25); }
.match-status-badge.live-badge { color: #FCA5A5; border-top-color: rgba(220,38,38,.15); }
.live-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #F87171; flex-shrink: 0; animation: pulse-dot 1.2s ease-in-out infinite; }

/* Group winner */
.group-winner-wrap { margin-top: 2px; }
.group-winner-card { display: flex; align-items: center; gap: 7px; padding: 6px 10px; background: rgba(255,180,4,.07); border: 1px solid rgba(255,180,4,.28); border-radius: 6px; }
.gw-logo { width: 20px; height: 20px; object-fit: contain; border-radius: 3px; }
.gw-logo-placeholder { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; background: rgba(255,180,4,.15); border-radius: 3px; font-size: 10px; font-weight: 900; color: #FFB404; }
.gw-seed { font-size: 9px; font-weight: 800; color: #FFB404; }
.gw-name { flex: 1; font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gw-advances { font-size: 8px; font-weight: 900; letter-spacing: .1em; color: #FFB404; background: rgba(255,180,4,.1); border: 1px solid rgba(255,180,4,.25); border-radius: 3px; padding: 1px 5px; white-space: nowrap; }
.group-winner-tbd { display: flex; align-items: center; gap: 6px; padding: 6px 10px; font-size: 11px; color: rgba(255,255,255,.2); font-weight: 600; }

/* Final 4 (CS2/LoL/RL) */
.final4-wrapper { overflow-x: auto; padding-bottom: 8px; }
.final4-grid { display: flex; align-items: center; justify-content: center; min-width: max-content; margin: 0 auto; }
.f4-col { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 0 8px; }
.f4-col-label { font-size: 10px; font-weight: 800; letter-spacing: .18em; color: rgba(255,255,255,.3); text-align: center; white-space: nowrap; }
.f4-col:first-child { width: 220px; }
.f4-col:nth-child(3) { width: 220px; }
.f4-col--champion   { width: 150px; }
.f4-semis { display: flex; flex-direction: column; gap: 20px; width: 100%; }
.f4-final { width: 100%; }
.f4-connector { width: 56px; height: 220px; flex-shrink: 0; }

/* Champion */
.champion-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px 16px; background: rgba(255,180,4,.06); border: 1px solid rgba(255,180,4,.4); border-radius: 10px; overflow: hidden; width: 100%; }
.champion-glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(255,180,4,.14) 0%, transparent 70%); pointer-events: none; }
.champion-logo { width: 52px; height: 52px; object-fit: contain; border-radius: 8px; position: relative; }
.champion-seed { font-size: 11px; font-weight: 800; color: #FFB404; letter-spacing: .1em; }
.champion-name { font-size: 15px; font-weight: 900; color: #fff; text-align: center; }

/* ── LEAGUE TABLE (EA FC) ──────────────────────────────────────────────────── */
.league-table-wrap { background: rgba(3,3,127,.12); border: 1px solid rgba(0,172,237,.18); border-radius: 12px; overflow: hidden; }
.league-table { width: 100%; }
.lt-header { display: grid; grid-template-columns: 28px 26px 1fr 30px 30px 30px 30px 34px 34px 38px 40px; align-items: center; padding: 6px 10px; background: rgba(0,0,0,.25); border-bottom: 1px solid rgba(0,172,237,.15); gap: 2px; }
.lt-header span { font-size: 8px; font-weight: 900; letter-spacing: .12em; color: rgba(255,255,255,.3); text-align: center; }
.lt-name-col { text-align: left !important; }
.lt-row { display: grid; grid-template-columns: 28px 26px 1fr 30px 30px 30px 30px 34px 34px 38px 40px; align-items: center; padding: 6px 10px; gap: 2px; border-bottom: 1px solid rgba(255,255,255,.04); transition: background .15s; }
.lt-row:last-child { border-bottom: none; }
.lt-row--champion { background: rgba(255,180,4,.06); border-left: 2px solid #FFB404; padding-left: 8px; }
.lt-pos-val { font-size: 11px; font-weight: 800; color: rgba(255,255,255,.25); text-align: center; }
.lt-pos--gold { color: #FFB404; }
.lt-logo-wrap { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
.lt-logo { width: 22px; height: 22px; object-fit: contain; border-radius: 3px; }
.lt-logo-placeholder { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: rgba(0,172,237,.15); border-radius: 3px; font-size: 9px; font-weight: 900; color: rgba(255,255,255,.5); }
.lt-name-val { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px; }
.lt-row--champion .lt-name-val { color: #fff; }
.lt-seed { font-size: 9px; font-weight: 800; color: #FFB404; flex-shrink: 0; }
.lt-stat-val { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.45); text-align: center; font-variant-numeric: tabular-nums; }
.lt-row--champion .lt-stat-val { color: rgba(255,255,255,.75); }
.lt-wins { color: rgba(0,221,254,.7) !important; }
.lt-row--champion .lt-wins { color: #00DDFE !important; }
.lt-losses { color: rgba(255,255,255,.3) !important; }
.lt-gd-pos { color: #22C55E !important; }
.lt-gd-neg { color: rgba(239,68,68,.7) !important; }
.lt-pts-val { font-size: 14px !important; font-weight: 900 !important; color: #fff !important; text-align: center; font-variant-numeric: tabular-nums; }
.lt-row--champion .lt-pts-val { color: #FFB404 !important; }
.league-legend { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-top: 1px solid rgba(255,255,255,.06); background: rgba(0,0,0,.15); }
.legend-dot { width: 8px; height: 8px; border-radius: 1px; flex-shrink: 0; }
.legend-dot--gold { background: #FFB404; }
.legend-label { font-size: 9px; font-weight: 700; letter-spacing: .1em; color: rgba(255,255,255,.35); }
.league-matches-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 540px) { .league-matches-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 900px) { .league-matches-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1200px) { .league-matches-grid { grid-template-columns: repeat(4, 1fr); } }
</style>