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
          <span class="live-dot" />LIVE
          <v-icon size="10">mdi-twitch</v-icon>
        </span>

        <img :alt="game.label" class="game-icon" :src="game.icon">
        <span class="game-label">{{ game.label }}</span>
        <span v-if="!liveGames.has(game.id) && gameStartTimes[game.id]" class="game-start-time">{{ gameStartTimes[game.id] }}</span>
      </button>
    </div>

    <!-- Header -->
    <div class="bracket-header">
      <div class="header-eyebrow">JOGÁLIA 2026 · {{ currentGame.label }}</div>

		<a
    v-if="randomizerLinks[selectedGame]"
    :href="randomizerLinks[selectedGame]"
    target="_blank"
    rel="noopener noreferrer"
    class="randomizer-btn"
  >
    <v-icon size="16">mdi-shuffle-variant</v-icon>
    Ver Randomizer
  </a>

      <div class="sync-status" :class="syncState">
        <span class="sync-dot" />
        <span v-if="syncState === 'loading'">A carregar...</span>
        <span v-else-if="syncState === 'ok'">Atualizado · {{ lastSyncTime }}</span>
        <span v-else>Erro ao carregar ficheiros</span>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!teamsLoaded || !matchesLoaded" class="empty-state">
      <v-icon class="mb-4" color="#0686F3" size="64">mdi-sword-cross</v-icon>
      <div class="empty-title">{{ syncState === 'error' ? 'Não foi possível carregar os ficheiros' : 'A carregar bracket...' }}</div>
      <div class="empty-sub">Google Sheets · {{ selectedGame }}_teams / {{ selectedGame }}_matches</div>
    </div>

    <!-- ══ EA FC LEAGUE VIEW ══ -->
    <template v-else-if="selectedGame === 'fc'">
      <div class="phase-label">
        <span class="phase-line" />
        <span class="phase-text phase-text--gold">LIGA · TODOS CONTRA TODOS</span>
        <span class="phase-line" />
      </div>

      <div class="league-table-wrap">
        <div class="league-table">
          <div class="lt-header">
            <span class="lt-pos-col" />
            <span class="lt-logo-col" />
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
                <img
                  v-if="entry.team && entry.team.logo && !brokenLogos.has(logoKey(entry.team))"
                  class="lt-logo"
                  :src="logoPath(entry.team)"
                  @error="brokenLogos.add(logoKey(entry.team))"
                >

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
          <span class="legend-dot legend-dot--gold" /><span class="legend-label">1.º lugar · Campeão</span>
        </div>
      </div>

      <div class="phase-label" style="margin-top:28px">
        <span class="phase-line" />
        <span class="phase-text">RESULTADOS · CALENDÁRIO</span>
        <span class="phase-line" />
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
            <span v-if="isLive(match)" class="tag-live-dot" />
            {{ isLive(match) ? 'LIVE' : 'LIGA' }}
          </div>

          <div v-if="match.start_time && !isLive(match)" class="match-time-row">
            <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
          </div>

          <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
            <span class="team-logo-wrap">
              <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
              <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
            <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
          </div>

          <div class="match-divider" />

          <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
            <span class="team-logo-wrap">
              <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
              <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
            <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
          </div>

          <MatchStatusBadge :is-live="isLive(match)" :match="match" />
        </div>
      </div>

	  <!-- FASE 1 · BO3 (1º vs 4º / 2º vs 3º) -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--red">PLAYOFFS · FASE 1 · BO3</span>
        <span class="phase-line" />
      </div>

      <div class="val-ko-grid">
        <div class="val-ko-semis">
          <div
            v-for="match in fcFase1Matches"
            :key="'fcf1-' + match.match_id"
            class="match-card match-card--bo3 val-ko-card"
            :class="matchCardClass(match)"
            @click="onMatchCardClick(match)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
              <span v-if="isLive(match)" class="tag-live-dot" />
              {{ isLive(match) ? 'LIVE' : ('JOGO ' + (match.label || '?')) }}
            </div>

            <div v-if="match.start_time && !isLive(match)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
            </div>

            <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
              <span class="team-logo-wrap">
                <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
                <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
              <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
              <span class="team-logo-wrap">
                <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
                <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
              <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(match)" :match="match" />
          </div>
        </div>
      </div>

      <!-- FASE 2 · BO3 (Final + 3º/4º lugar) -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--gold">PLAYOFFS · FASE 2 · BO3</span>
        <span class="phase-line" />
      </div>

      <div class="val-final-grid">

        <!-- 3.º / 4.º lugar -->
        <div class="val-final-col">
          <div class="val-final-col-label">3.º / 4.º LUGAR</div>
          <div
            v-if="fcThirdPlace"
            class="match-card match-card--bo3"
            :class="matchCardClass(fcThirdPlace)"
            @click="onMatchCardClick(fcThirdPlace)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(fcThirdPlace) }">
              <span v-if="isLive(fcThirdPlace)" class="tag-live-dot" />
              {{ isLive(fcThirdPlace) ? 'LIVE' : 'BO3' }}
            </div>

            <div v-if="fcThirdPlace.start_time && !isLive(fcThirdPlace)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ fcThirdPlace.start_time }}
            </div>

            <div class="team-row" :class="[fcThirdPlace.status==='done'&&fcThirdPlace.winner===null?'draw':{winner:fcThirdPlace.status==='done'&&fcThirdPlace.winner===1,loser:fcThirdPlace.status==='done'&&fcThirdPlace.winner!==1,tbd:!fcThirdPlace.team1}]">
              <span class="team-logo-wrap">
                <img v-if="fcThirdPlace.team1 && fcThirdPlace.team1.logo && !brokenLogos.has(logoKey(fcThirdPlace.team1))" class="team-logo-img" :src="logoPath(fcThirdPlace.team1)" @error="brokenLogos.add(logoKey(fcThirdPlace.team1))">
                <span v-else class="team-logo-placeholder">{{ fcThirdPlace.team1 ? fcThirdPlace.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="fcThirdPlace.team1" class="seed">#{{ fcThirdPlace.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ fcThirdPlace.team1 ? fcThirdPlace.team1.name : 'Derrotado Jogo E' }}</span>
              <span v-if="fcThirdPlace.status==='done'||isLive(fcThirdPlace)" class="score">{{ fcThirdPlace.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[fcThirdPlace.status==='done'&&fcThirdPlace.winner===null?'draw':{winner:fcThirdPlace.status==='done'&&fcThirdPlace.winner===2,loser:fcThirdPlace.status==='done'&&fcThirdPlace.winner!==2,tbd:!fcThirdPlace.team2}]">
              <span class="team-logo-wrap">
                <img v-if="fcThirdPlace.team2 && fcThirdPlace.team2.logo && !brokenLogos.has(logoKey(fcThirdPlace.team2))" class="team-logo-img" :src="logoPath(fcThirdPlace.team2)" @error="brokenLogos.add(logoKey(fcThirdPlace.team2))">
                <span v-else class="team-logo-placeholder">{{ fcThirdPlace.team2 ? fcThirdPlace.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="fcThirdPlace.team2" class="seed">#{{ fcThirdPlace.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ fcThirdPlace.team2 ? fcThirdPlace.team2.name : 'Derrotado Jogo F' }}</span>
              <span v-if="fcThirdPlace.status==='done'||isLive(fcThirdPlace)" class="score">{{ fcThirdPlace.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(fcThirdPlace)" :match="fcThirdPlace" />
          </div>
          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar Fase 1</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="val-final-divider">
          <div class="val-final-vs"></div>
        </div>

        <!-- Final -->
        <div class="val-final-col">
          <div class="val-final-col-label val-final-col-label--gold">FINAL</div>
          <div
            v-if="fcFinal"
            class="match-card match-card--bo3 match-card--the-final"
            :class="matchCardClass(fcFinal)"
            @click="onMatchCardClick(fcFinal)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(fcFinal) }">
              <span v-if="isLive(fcFinal)" class="tag-live-dot" />
              {{ isLive(fcFinal) ? 'LIVE' : 'BO3' }}
            </div>

            <div v-if="fcFinal.start_time && !isLive(fcFinal)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ fcFinal.start_time }}
            </div>

            <div class="team-row" :class="[fcFinal.status==='done'&&fcFinal.winner===null?'draw':{winner:fcFinal.status==='done'&&fcFinal.winner===1,loser:fcFinal.status==='done'&&fcFinal.winner!==1,tbd:!fcFinal.team1}]">
              <span class="team-logo-wrap">
                <img v-if="fcFinal.team1 && fcFinal.team1.logo && !brokenLogos.has(logoKey(fcFinal.team1))" class="team-logo-img" :src="logoPath(fcFinal.team1)" @error="brokenLogos.add(logoKey(fcFinal.team1))">
                <span v-else class="team-logo-placeholder">{{ fcFinal.team1 ? fcFinal.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="fcFinal.team1" class="seed">#{{ fcFinal.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ fcFinal.team1 ? fcFinal.team1.name : 'Vencedor Jogo E' }}</span>
              <span v-if="fcFinal.status==='done'||isLive(fcFinal)" class="score">{{ fcFinal.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[fcFinal.status==='done'&&fcFinal.winner===null?'draw':{winner:fcFinal.status==='done'&&fcFinal.winner===2,loser:fcFinal.status==='done'&&fcFinal.winner!==2,tbd:!fcFinal.team2}]">
              <span class="team-logo-wrap">
                <img v-if="fcFinal.team2 && fcFinal.team2.logo && !brokenLogos.has(logoKey(fcFinal.team2))" class="team-logo-img" :src="logoPath(fcFinal.team2)" @error="brokenLogos.add(logoKey(fcFinal.team2))">
                <span v-else class="team-logo-placeholder">{{ fcFinal.team2 ? fcFinal.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="fcFinal.team2" class="seed">#{{ fcFinal.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ fcFinal.team2 ? fcFinal.team2.name : 'Vencedor Jogo F' }}</span>
              <span v-if="fcFinal.status==='done'||isLive(fcFinal)" class="score">{{ fcFinal.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(fcFinal)" :match="fcFinal" />
          </div>
          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar Fase 1</span>
          </div>

          <!-- Champion -->
          <div v-if="fcChampion" class="champion-card" style="margin-top:12px">
            <div class="champion-glow" />
            <img v-if="fcChampion.logo && !brokenLogos.has(logoKey(fcChampion))" class="champion-logo" :src="logoPath(fcChampion)" @error="brokenLogos.add(logoKey(fcChampion))">
            <v-icon v-else color="#FFB404" size="40">mdi-trophy</v-icon>
            <div class="champion-seed">#{{ fcChampion.seed }}</div>
            <div class="champion-name">{{ fcChampion.name }}</div>
          </div>
        </div>

      </div>
    </template>

    <!-- ══ VALORANT VIEW ══ -->
    <template v-else-if="selectedGame === 'val'">

      <!-- FASE DE GRUPOS -->
      <div class="phase-label">
        <span class="phase-line" />
        <span class="phase-text">FASE DE GRUPOS · BO1 · 5 EQUIPAS POR GRUPO</span>
        <span class="phase-line" />
      </div>

      <div class="val-groups-grid">
        <div
          v-for="grp in valGroupList"
          :key="grp.id"
          class="group-block"
          :style="{ '--grp-color': grp.color }"
        >
          <div class="group-header">
            <span class="group-badge">{{ grp.arena }}</span>
            <span class="group-badge-sub">GRUPO {{ grp.id }}</span>

            <div class="group-standings-mini">
              <span
                v-for="(entry, i) in valGroupStandings(grp.id)"
                :key="entry.seed"
                class="standing-pip"
                :class="{ 'pip-first': i === 0, 'pip-second': i === 1, 'pip-done': entry.played > 0 }"
                :title="`#${entry.seed} ${entry.name} — ${entry.wins}V ${entry.losses}D`"
              />
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
              v-for="(entry, i) in valGroupStandings(grp.id)"
              :key="'st-' + entry.seed"
              class="st-row"
              :class="valStandingRowClass(grp.id, i)"
            >
              <span class="st-pos" :class="{ 'st-pos--advance': i < 2 && valGroupComplete(grp.id) }">{{ i + 1 }}</span>

              <span class="st-logo-wrap">
                <img
                  v-if="entry.team && entry.team.logo && !brokenLogos.has(logoKey(entry.team))"
                  class="st-logo"
                  :src="logoPath(entry.team)"
                  @error="brokenLogos.add(logoKey(entry.team))"
                >

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
              v-for="match in valGroupMatches(grp.id)"
              :key="'vgm-' + match.match_id"
              class="match-card"
              :class="matchCardClass(match)"
              @click="onMatchCardClick(match)"
            >
              <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                <span v-if="isLive(match)" class="tag-live-dot" />
                {{ isLive(match) ? 'LIVE' : 'BO1' }}
              </div>

              <div v-if="match.start_time && !isLive(match)" class="match-time-row">
                <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
              </div>

              <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
                <span class="team-logo-wrap">
                  <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
                  <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
                </span>

                <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
                <span v-else class="seed tbd-seed">?</span>
                <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
                <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
              </div>

              <div class="match-divider" />

              <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
                <span class="team-logo-wrap">
                  <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
                  <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
                </span>

                <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
                <span v-else class="seed tbd-seed">?</span>
                <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
                <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
              </div>

              <MatchStatusBadge :is-live="isLive(match)" :match="match" />
            </div>
          </div>

          <!-- Top 2 advance strip -->
          <div class="val-advances-wrap">
            <div v-if="valGroupComplete(grp.id)" class="val-advances-list">
              <div
                v-for="(entry, i) in valGroupStandings(grp.id).slice(0,2)"
                :key="'adv-'+entry.seed"
                class="val-advance-row"
                :class="i === 0 ? 'val-advance-row--first' : 'val-advance-row--second'"
              >
                <v-icon :color="i === 0 ? '#FFB404' : '#94A3B8'" size="11" style="flex-shrink:0">mdi-arrow-right-circle</v-icon>

                <img
                  v-if="entry.team && entry.team.logo && !brokenLogos.has(logoKey(entry.team))"
                  class="gw-logo"
                  :src="logoPath(entry.team)"
                  @error="brokenLogos.add(logoKey(entry.team))"
                >

                <span v-else class="gw-logo-placeholder">{{ entry.name.charAt(0) }}</span>
                <span class="gw-seed">#{{ entry.seed }}</span>
                <span class="gw-name">{{ entry.name }}</span>

                <span class="gw-advances" :class="i === 0 ? 'gw-advances--mf1' : 'gw-advances--mf2'">
                  {{ i === 0 ? 'FASE 1 · Jogo E' : 'FASE 1 · Jogo F' }}
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

      <!-- FASE 1 · BO1 -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--red">PLAYOFFS · FASE 1 · BO1</span>
        <span class="phase-line" />
      </div>

      <div class="val-ko-grid">
        <div class="val-ko-semis">
          <div
            v-for="match in valFase1Matches"
            :key="'vf1-' + match.match_id"
            class="match-card val-ko-card"
            :class="matchCardClass(match)"
            @click="onMatchCardClick(match)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
              <span v-if="isLive(match)" class="tag-live-dot" />
              {{ isLive(match) ? 'LIVE' : ('JOGO ' + (match.label || '?')) }}
            </div>

            <div v-if="match.start_time && !isLive(match)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
            </div>

            <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
              <span class="team-logo-wrap">
                <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
                <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
              <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
              <span class="team-logo-wrap">
                <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
                <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
              <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(match)" :match="match" />
          </div>
        </div>
      </div>

      <!-- FASE 2 + FINAL -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--gold">PLAYOFFS · FASE 2 & FINAL</span>
        <span class="phase-line" />
      </div>

      <div class="val-final-grid">

        <!-- Fase 2 -->
        <div class="val-final-col">
          <div class="val-final-col-label">FASE 2 · BO1</div>
          <div
            v-if="valFase2"
            class="match-card val-ko-card"
            :class="matchCardClass(valFase2)"
            @click="onMatchCardClick(valFase2)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(valFase2) }">
              <span v-if="isLive(valFase2)" class="tag-live-dot" />
              {{ isLive(valFase2) ? 'LIVE' : 'BO1' }}
            </div>

            <div v-if="valFase2.start_time && !isLive(valFase2)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ valFase2.start_time }}
            </div>

            <div class="team-row" :class="[valFase2.status==='done'&&valFase2.winner===null?'draw':{winner:valFase2.status==='done'&&valFase2.winner===1,loser:valFase2.status==='done'&&valFase2.winner!==1,tbd:!valFase2.team1}]">
              <span class="team-logo-wrap">
                <img v-if="valFase2.team1 && valFase2.team1.logo && !brokenLogos.has(logoKey(valFase2.team1))" class="team-logo-img" :src="logoPath(valFase2.team1)" @error="brokenLogos.add(logoKey(valFase2.team1))">
                <span v-else class="team-logo-placeholder">{{ valFase2.team1 ? valFase2.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="valFase2.team1" class="seed">#{{ valFase2.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ valFase2.team1 ? valFase2.team1.name : 'Derrotado Jogo E' }}</span>
              <span v-if="valFase2.status==='done'||isLive(valFase2)" class="score">{{ valFase2.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[valFase2.status==='done'&&valFase2.winner===null?'draw':{winner:valFase2.status==='done'&&valFase2.winner===2,loser:valFase2.status==='done'&&valFase2.winner!==2,tbd:!valFase2.team2}]">
              <span class="team-logo-wrap">
                <img v-if="valFase2.team2 && valFase2.team2.logo && !brokenLogos.has(logoKey(valFase2.team2))" class="team-logo-img" :src="logoPath(valFase2.team2)" @error="brokenLogos.add(logoKey(valFase2.team2))">
                <span v-else class="team-logo-placeholder">{{ valFase2.team2 ? valFase2.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="valFase2.team2" class="seed">#{{ valFase2.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ valFase2.team2 ? valFase2.team2.name : 'Vencedor Jogo F' }}</span>
              <span v-if="valFase2.status==='done'||isLive(valFase2)" class="score">{{ valFase2.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(valFase2)" :match="valFase2" />
          </div>
          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar Fase 1</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="val-final-divider">
          <div class="val-final-vs"></div>
        </div>

        <!-- Final -->
        <div class="val-final-col">
          <div class="val-final-col-label val-final-col-label--gold">FINAL · BO3</div>
          <div
            v-if="valFinal"
            class="match-card match-card--bo3 match-card--the-final"
            :class="matchCardClass(valFinal)"
            @click="onMatchCardClick(valFinal)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(valFinal) }">
              <span v-if="isLive(valFinal)" class="tag-live-dot" />
              {{ isLive(valFinal) ? 'LIVE' : 'BO3' }}
            </div>

            <div v-if="valFinal.start_time && !isLive(valFinal)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ valFinal.start_time }}
            </div>

            <div class="team-row" :class="[valFinal.status==='done'&&valFinal.winner===null?'draw':{winner:valFinal.status==='done'&&valFinal.winner===1,loser:valFinal.status==='done'&&valFinal.winner!==1,tbd:!valFinal.team1}]">
              <span class="team-logo-wrap">
                <img v-if="valFinal.team1 && valFinal.team1.logo && !brokenLogos.has(logoKey(valFinal.team1))" class="team-logo-img" :src="logoPath(valFinal.team1)" @error="brokenLogos.add(logoKey(valFinal.team1))">
                <span v-else class="team-logo-placeholder">{{ valFinal.team1 ? valFinal.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="valFinal.team1" class="seed">#{{ valFinal.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ valFinal.team1 ? valFinal.team1.name : 'Vencedor Jogo E' }}</span>
              <span v-if="valFinal.status==='done'||isLive(valFinal)" class="score">{{ valFinal.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[valFinal.status==='done'&&valFinal.winner===null?'draw':{winner:valFinal.status==='done'&&valFinal.winner===2,loser:valFinal.status==='done'&&valFinal.winner!==2,tbd:!valFinal.team2}]">
              <span class="team-logo-wrap">
                <img v-if="valFinal.team2 && valFinal.team2.logo && !brokenLogos.has(logoKey(valFinal.team2))" class="team-logo-img" :src="logoPath(valFinal.team2)" @error="brokenLogos.add(logoKey(valFinal.team2))">
                <span v-else class="team-logo-placeholder">{{ valFinal.team2 ? valFinal.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="valFinal.team2" class="seed">#{{ valFinal.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ valFinal.team2 ? valFinal.team2.name : 'Vencedor Fase 2' }}</span>
              <span v-if="valFinal.status==='done'||isLive(valFinal)" class="score">{{ valFinal.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(valFinal)" :match="valFinal" />
          </div>

          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar Fase 1 / Fase 2</span>
          </div>

          <!-- Champion -->
          <div v-if="valChampion" class="champion-card" style="margin-top:12px">
            <div class="champion-glow" />
            <img v-if="valChampion.logo && !brokenLogos.has(logoKey(valChampion))" class="champion-logo" :src="logoPath(valChampion)" @error="brokenLogos.add(logoKey(valChampion))">
            <v-icon v-else color="#FFB404" size="40">mdi-trophy</v-icon>
            <div class="champion-seed">#{{ valChampion.seed }}</div>
            <div class="champion-name">{{ valChampion.name }}</div>
          </div>
        </div>

      </div>

    </template>

    <!-- ══ ROCKET LEAGUE VIEW ══ -->
    <template v-else-if="selectedGame === 'rl'">

      <!-- FASE DE GRUPOS -->
      <div class="phase-label">
        <span class="phase-line" />
        <span class="phase-text">FASE DE GRUPOS · BO3 · 4 EQUIPAS POR GRUPO</span>
        <span class="phase-line" />
      </div>

      <div class="val-groups-grid">
        <div
          v-for="grp in rlGroupList"
          :key="grp.id"
          class="group-block"
          :style="{ '--grp-color': grp.color }"
        >
          <div class="group-header">
            <span class="group-badge">GRUPO {{ grp.id }}</span>

            <div class="group-standings-mini">
              <span
                v-for="(entry, i) in groupStandings(grp.id)"
                :key="entry.seed"
                class="standing-pip"
                :class="{ 'pip-first': i === 0, 'pip-second': i === 1 || i === 2, 'pip-done': entry.played > 0 }"
                :title="`#${entry.seed} ${entry.name} — ${entry.wins}V ${entry.losses}D`"
              />
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
              v-for="(entry, i) in groupStandings(grp.id)"
              :key="'st-' + entry.seed"
              class="st-row"
              :class="{ 'st-first': i === 0 && groupComplete(grp.id), 'st-second': (i === 1 || i === 2) && groupComplete(grp.id) }"
            >
              <span class="st-pos" :class="{ 'st-pos--advance': i < 3 && groupComplete(grp.id) }">{{ i + 1 }}</span>

              <span class="st-logo-wrap">
                <img
                  v-if="entry.team && entry.team.logo && !brokenLogos.has(logoKey(entry.team))"
                  class="st-logo"
                  :src="logoPath(entry.team)"
                  @error="brokenLogos.add(logoKey(entry.team))"
                >

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
              v-for="match in groupMatches(grp.id)"
              :key="'rgm-' + match.match_id"
              class="match-card"
              :class="matchCardClass(match)"
              @click="onMatchCardClick(match)"
            >
              <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                <span v-if="isLive(match)" class="tag-live-dot" />
                {{ isLive(match) ? 'LIVE' : 'BO3' }}
              </div>

              <div v-if="match.start_time && !isLive(match)" class="match-time-row">
                <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
              </div>

              <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
                <span class="team-logo-wrap">
                  <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
                  <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
                </span>

                <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
                <span v-else class="seed tbd-seed">?</span>
                <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
                <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
              </div>

              <div class="match-divider" />

              <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
                <span class="team-logo-wrap">
                  <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
                  <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
                </span>

                <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
                <span v-else class="seed tbd-seed">?</span>
                <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
                <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
              </div>

              <MatchStatusBadge :is-live="isLive(match)" :match="match" />
            </div>
          </div>

          <div class="val-advances-wrap">
            <div v-if="groupComplete(grp.id)" class="val-advances-list">
              <div
                v-for="(entry, i) in groupStandings(grp.id).slice(0,3)"
                :key="'radv-'+entry.seed"
                class="val-advance-row"
                :class="i === 0 ? 'val-advance-row--first' : 'val-advance-row--second'"
              >
                <v-icon :color="i === 0 ? '#FFB404' : '#94A3B8'" size="11" style="flex-shrink:0">mdi-arrow-right-circle</v-icon>

                <img
                  v-if="entry.team && entry.team.logo && !brokenLogos.has(logoKey(entry.team))"
                  class="gw-logo"
                  :src="logoPath(entry.team)"
                  @error="brokenLogos.add(logoKey(entry.team))"
                >

                <span v-else class="gw-logo-placeholder">{{ entry.name.charAt(0) }}</span>
                <span class="gw-seed">#{{ entry.seed }}</span>
                <span class="gw-name">{{ entry.name }}</span>
                <span class="gw-advances" :class="i === 0 ? 'gw-advances--mf1' : 'gw-advances--mf2'">{{ i + 1 }}.º · AVANÇA</span>
              </div>
            </div>
            <div v-else class="group-winner-tbd">
              <v-icon size="12" style="opacity:0.3">mdi-help-circle-outline</v-icon>
              <span>Apuramento a definir</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FASE 1 -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--gold">PLAYOFFS · FASE 1 · BO5</span>
        <span class="phase-line" />
      </div>

      <div class="rl-stage-grid">
        <div
          v-for="match in rlPhase1"
          :key="'rp1-' + match.match_id"
          class="match-card match-card--bo3"
          :class="matchCardClass(match)"
          @click="onMatchCardClick(match)"
        >
          <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
            <span v-if="isLive(match)" class="tag-live-dot" />
            {{ isLive(match) ? 'LIVE' : ('JOGO ' + (match.label || '?')) }}
          </div>

          <div v-if="match.start_time && !isLive(match)" class="match-time-row">
            <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
          </div>

          <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
            <span class="team-logo-wrap">
              <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
              <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
            <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
          </div>

          <div class="match-divider" />

          <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
            <span class="team-logo-wrap">
              <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
              <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
            <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
          </div>

          <MatchStatusBadge :is-live="isLive(match)" :match="match" />
        </div>
      </div>

      <!-- FASE 2 -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text">PLAYOFFS · FASE 2 · BO5</span>
        <span class="phase-line" />
      </div>

      <div class="rl-stage-grid">
        <div
          v-for="match in rlPhase2"
          :key="'rp2-' + match.match_id"
          class="match-card match-card--bo3"
          :class="matchCardClass(match)"
          @click="onMatchCardClick(match)"
        >
          <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
            <span v-if="isLive(match)" class="tag-live-dot" />
            {{ isLive(match) ? 'LIVE' : ('JOGO ' + (match.label || '?')) }}
          </div>

          <div v-if="match.start_time && !isLive(match)" class="match-time-row">
            <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
          </div>

          <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
            <span class="team-logo-wrap">
              <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
              <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
            <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
          </div>

          <div class="match-divider" />

          <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
            <span class="team-logo-wrap">
              <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
              <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
            <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
          </div>

          <MatchStatusBadge :is-live="isLive(match)" :match="match" />
        </div>
      </div>

      <!-- FASE 3 -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--red">PLAYOFFS · FASE 3 · BO5 · JOGO I</span>
        <span class="phase-line" />
      </div>

      <div class="rl-stage-grid rl-stage-grid--single">
        <div
          v-if="rlPhase3"
          class="match-card match-card--bo3"
          :class="matchCardClass(rlPhase3)"
          @click="onMatchCardClick(rlPhase3)"
        >
          <div class="match-format-tag" :class="{ 'tag-live': isLive(rlPhase3) }">
            <span v-if="isLive(rlPhase3)" class="tag-live-dot" />
            {{ isLive(rlPhase3) ? 'LIVE' : 'BO5' }}
          </div>

          <div v-if="rlPhase3.start_time && !isLive(rlPhase3)" class="match-time-row">
            <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ rlPhase3.start_time }}
          </div>

          <div class="team-row" :class="[rlPhase3.status==='done'&&rlPhase3.winner===null?'draw':{winner:rlPhase3.status==='done'&&rlPhase3.winner===1,loser:rlPhase3.status==='done'&&rlPhase3.winner!==1,tbd:!rlPhase3.team1}]">
            <span class="team-logo-wrap">
              <img v-if="rlPhase3.team1 && rlPhase3.team1.logo && !brokenLogos.has(logoKey(rlPhase3.team1))" class="team-logo-img" :src="logoPath(rlPhase3.team1)" @error="brokenLogos.add(logoKey(rlPhase3.team1))">
              <span v-else class="team-logo-placeholder">{{ rlPhase3.team1 ? rlPhase3.team1.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="rlPhase3.team1" class="seed">#{{ rlPhase3.team1.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ rlPhase3.team1 ? rlPhase3.team1.name : 'Vencedor Jogo J' }}</span>
            <span v-if="rlPhase3.status==='done'||isLive(rlPhase3)" class="score">{{ rlPhase3.score1 }}</span>
          </div>

          <div class="match-divider" />

          <div class="team-row" :class="[rlPhase3.status==='done'&&rlPhase3.winner===null?'draw':{winner:rlPhase3.status==='done'&&rlPhase3.winner===2,loser:rlPhase3.status==='done'&&rlPhase3.winner!==2,tbd:!rlPhase3.team2}]">
            <span class="team-logo-wrap">
              <img v-if="rlPhase3.team2 && rlPhase3.team2.logo && !brokenLogos.has(logoKey(rlPhase3.team2))" class="team-logo-img" :src="logoPath(rlPhase3.team2)" @error="brokenLogos.add(logoKey(rlPhase3.team2))">
              <span v-else class="team-logo-placeholder">{{ rlPhase3.team2 ? rlPhase3.team2.name.charAt(0) : '?' }}</span>
            </span>

            <span v-if="rlPhase3.team2" class="seed">#{{ rlPhase3.team2.seed }}</span>
            <span v-else class="seed tbd-seed">?</span>
            <span class="team-name">{{ rlPhase3.team2 ? rlPhase3.team2.name : 'Vencedor Jogo H' }}</span>
            <span v-if="rlPhase3.status==='done'||isLive(rlPhase3)" class="score">{{ rlPhase3.score2 }}</span>
          </div>

          <MatchStatusBadge :is-live="isLive(rlPhase3)" :match="rlPhase3" />
        </div>
        <div v-else class="val-tbd-card">
          <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
          <span>A aguardar Fase 2</span>
        </div>

        <!-- 3rd place (automatic - loser of Fase 3, no extra match) -->
        <div v-if="rl3rdPlace" class="val-podium-row val-podium-row--bronze" style="margin-top:10px">
          <v-icon color="#94A3B8" size="13" style="flex-shrink:0">mdi-medal</v-icon>

          <img
            v-if="rl3rdPlace.logo && !brokenLogos.has(logoKey(rl3rdPlace))"
            class="gw-logo"
            :src="logoPath(rl3rdPlace)"
            @error="brokenLogos.add(logoKey(rl3rdPlace))"
          >

          <span v-else class="gw-logo-placeholder">{{ rl3rdPlace.name.charAt(0) }}</span>
          <span class="gw-seed">#{{ rl3rdPlace.seed }}</span>
          <span class="gw-name">{{ rl3rdPlace.name }}</span>
          <span class="gw-advances gw-advances--bronze">3.º LUGAR</span>
        </div>
      </div>

      <!-- FINAL -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--gold">FINAL · BO5</span>
        <span class="phase-line" />
      </div>

      <div class="final4-wrapper">
        <div class="final4-grid">
          <div class="f4-col">
            <div v-if="rlFinal" class="f4-final">
              <div
                class="match-card match-card--bo3 match-card--the-final"
                :class="matchCardClass(rlFinal)"
                @click="onMatchCardClick(rlFinal)"
              >
                <div class="match-format-tag" :class="{ 'tag-live': isLive(rlFinal) }">
                  <span v-if="isLive(rlFinal)" class="tag-live-dot" />
                  {{ isLive(rlFinal) ? 'LIVE' : 'BO5' }}
                </div>

                <div v-if="rlFinal.start_time && !isLive(rlFinal)" class="match-time-row">
                  <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ rlFinal.start_time }}
                </div>

                <div class="team-row" :class="[rlFinal.status==='done'&&rlFinal.winner===null?'draw':{winner:rlFinal.status==='done'&&rlFinal.winner===1,loser:rlFinal.status==='done'&&rlFinal.winner!==1,tbd:!rlFinal.team1}]">
                  <span class="team-logo-wrap">
                    <img v-if="rlFinal.team1 && rlFinal.team1.logo && !brokenLogos.has(logoKey(rlFinal.team1))" class="team-logo-img" :src="logoPath(rlFinal.team1)" @error="brokenLogos.add(logoKey(rlFinal.team1))">
                    <span v-else class="team-logo-placeholder">{{ rlFinal.team1 ? rlFinal.team1.name.charAt(0) : '?' }}</span>
                  </span>

                  <span v-if="rlFinal.team1" class="seed">#{{ rlFinal.team1.seed }}</span>
                  <span v-else class="seed tbd-seed">?</span>
                  <span class="team-name">{{ rlFinal.team1 ? rlFinal.team1.name : 'Vencedor Jogo K' }}</span>
                  <span v-if="rlFinal.status==='done'||isLive(rlFinal)" class="score">{{ rlFinal.score1 }}</span>
                </div>

                <div class="match-divider" />

                <div class="team-row" :class="[rlFinal.status==='done'&&rlFinal.winner===null?'draw':{winner:rlFinal.status==='done'&&rlFinal.winner===2,loser:rlFinal.status==='done'&&rlFinal.winner!==2,tbd:!rlFinal.team2}]">
                  <span class="team-logo-wrap">
                    <img v-if="rlFinal.team2 && rlFinal.team2.logo && !brokenLogos.has(logoKey(rlFinal.team2))" class="team-logo-img" :src="logoPath(rlFinal.team2)" @error="brokenLogos.add(logoKey(rlFinal.team2))">
                    <span v-else class="team-logo-placeholder">{{ rlFinal.team2 ? rlFinal.team2.name.charAt(0) : '?' }}</span>
                  </span>

                  <span v-if="rlFinal.team2" class="seed">#{{ rlFinal.team2.seed }}</span>
                  <span v-else class="seed tbd-seed">?</span>
                  <span class="team-name">{{ rlFinal.team2 ? rlFinal.team2.name : 'Vencedor Jogo I' }}</span>
                  <span v-if="rlFinal.status==='done'||isLive(rlFinal)" class="score">{{ rlFinal.score2 }}</span>
                </div>

                <MatchStatusBadge :is-live="isLive(rlFinal)" :match="rlFinal" />
              </div>
            </div>
            <div v-else class="val-tbd-card">
              <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
              <span>A aguardar Fase 2 / Fase 3</span>
            </div>
          </div>

          <div v-if="rlChampion" class="f4-col f4-col--champion">
            <div class="f4-col-label">CAMPEÃO</div>
            <div class="champion-card">
              <div class="champion-glow" />
              <img v-if="rlChampion.logo && !brokenLogos.has(logoKey(rlChampion))" class="champion-logo" :src="logoPath(rlChampion)" @error="brokenLogos.add(logoKey(rlChampion))">
              <v-icon v-else color="#FFB404" size="40">mdi-trophy</v-icon>
              <div class="champion-seed">#{{ rlChampion.seed }}</div>
              <div class="champion-name">{{ rlChampion.name }}</div>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- ══ BRACKET VIEW (CS2 / LoL) ══ -->
    <template v-else>

      <div class="phase-label">
        <span class="phase-line" />
        <span class="phase-text">FASE DE GRUPOS · BO1</span>
        <span class="phase-line" />
      </div>

      <div class="groups-grid">
        <div
          v-for="grp in groupList"
          :key="grp.id"
          class="group-block"
          :style="{ '--grp-color': grp.color }"
        >
          <div class="group-header">
            <span class="group-badge">GRUPO {{ grp.id }}</span>

            <div class="group-standings-mini">
              <span
                v-for="(entry, i) in groupStandings(grp.id)"
                :key="entry.seed"
                class="standing-pip"
                :class="{ 'pip-first': i === 0, 'pip-done': entry.played > 0 }"
                :title="`#${entry.seed} ${entry.name} — ${entry.wins}V ${entry.losses}D`"
              />
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
              v-for="(entry, i) in groupStandings(grp.id)"
              :key="'st-' + entry.seed"
              class="st-row"
              :class="{ 'st-first': i === 0 && groupComplete(grp.id) }"
            >
              <span class="st-pos">{{ i + 1 }}</span>

              <span class="st-logo-wrap">
                <img
                  v-if="entry.team && entry.team.logo && !brokenLogos.has(logoKey(entry.team))"
                  class="st-logo"
                  :src="logoPath(entry.team)"
                  @error="brokenLogos.add(logoKey(entry.team))"
                >

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
              v-for="match in groupMatches(grp.id)"
              :key="'gm-' + match.match_id"
              class="match-card"
              :class="matchCardClass(match)"
              @click="onMatchCardClick(match)"
            >
              <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
                <span v-if="isLive(match)" class="tag-live-dot" />
                {{ isLive(match) ? 'LIVE' : 'BO1' }}
              </div>

              <div v-if="match.start_time && !isLive(match)" class="match-time-row">
                <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
              </div>

              <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
                <span class="team-logo-wrap">
                  <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
                  <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
                </span>

                <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
                <span v-else class="seed tbd-seed">?</span>
                <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
                <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
              </div>

              <div class="match-divider" />

              <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
                <span class="team-logo-wrap">
                  <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
                  <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
                </span>

                <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
                <span v-else class="seed tbd-seed">?</span>
                <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
                <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
              </div>

              <MatchStatusBadge :is-live="isLive(match)" :match="match" />
            </div>
          </div>

          <div class="group-winner-wrap">
            <div v-if="groupWinner(grp.id)" class="group-winner-card">
              <v-icon color="#FFB404" size="13" style="flex-shrink:0">mdi-trophy</v-icon>

              <img
                v-if="groupWinner(grp.id).logo && !brokenLogos.has(logoKey(groupWinner(grp.id)))"
                class="gw-logo"
                :src="logoPath(groupWinner(grp.id))"
                @error="brokenLogos.add(logoKey(groupWinner(grp.id)))"
              >

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

      <!-- MEIAS-FINAIS -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--red">MEIAS-FINAIS · BO1</span>
        <span class="phase-line" />
      </div>

      <div class="val-ko-grid">
        <div class="val-ko-semis">
          <div
            v-for="match in semiFinals"
            :key="'sf-' + match.match_id"
            class="match-card val-ko-card"
            :class="matchCardClass(match)"
            @click="onMatchCardClick(match)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(match) }">
              <span v-if="isLive(match)" class="tag-live-dot" />
              {{ isLive(match) ? 'LIVE' : ('JOGO ' + (match.label || '?')) }}
            </div>

            <div v-if="match.start_time && !isLive(match)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ match.start_time }}
            </div>

            <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===1,loser:match.status==='done'&&match.winner!==1,tbd:!match.team1}]">
              <span class="team-logo-wrap">
                <img v-if="match.team1 && match.team1.logo && !brokenLogos.has(logoKey(match.team1))" class="team-logo-img" :src="logoPath(match.team1)" @error="brokenLogos.add(logoKey(match.team1))">
                <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="match.team1" class="seed">#{{ match.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ match.team1 ? match.team1.name : 'TBD' }}</span>
              <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[match.status==='done'&&match.winner===null?'draw':{winner:match.status==='done'&&match.winner===2,loser:match.status==='done'&&match.winner!==2,tbd:!match.team2}]">
              <span class="team-logo-wrap">
                <img v-if="match.team2 && match.team2.logo && !brokenLogos.has(logoKey(match.team2))" class="team-logo-img" :src="logoPath(match.team2)" @error="brokenLogos.add(logoKey(match.team2))">
                <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="match.team2" class="seed">#{{ match.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ match.team2 ? match.team2.name : 'TBD' }}</span>
              <span v-if="match.status==='done'||isLive(match)" class="score">{{ match.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(match)" :match="match" />
          </div>
        </div>
      </div>

      <!-- FINAL + 3.º LUGAR -->
      <div class="phase-label phase-label--f4">
        <span class="phase-line" />
        <span class="phase-text phase-text--gold">FINAL & 3.º LUGAR · BO3</span>
        <span class="phase-line" />
      </div>

      <div class="val-final-grid">

        <!-- 3rd place -->
        <div class="val-final-col">
          <div class="val-final-col-label">3.º / 4.º LUGAR</div>
          <div
            v-if="thirdPlace"
            class="match-card match-card--bo3"
            :class="matchCardClass(thirdPlace)"
            @click="onMatchCardClick(thirdPlace)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(thirdPlace) }">
              <span v-if="isLive(thirdPlace)" class="tag-live-dot" />
              {{ isLive(thirdPlace) ? 'LIVE' : 'BO3' }}
            </div>

            <div v-if="thirdPlace.start_time && !isLive(thirdPlace)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ thirdPlace.start_time }}
            </div>

            <div class="team-row" :class="[thirdPlace.status==='done'&&thirdPlace.winner===null?'draw':{winner:thirdPlace.status==='done'&&thirdPlace.winner===1,loser:thirdPlace.status==='done'&&thirdPlace.winner!==1,tbd:!thirdPlace.team1}]">
              <span class="team-logo-wrap">
                <img v-if="thirdPlace.team1 && thirdPlace.team1.logo && !brokenLogos.has(logoKey(thirdPlace.team1))" class="team-logo-img" :src="logoPath(thirdPlace.team1)" @error="brokenLogos.add(logoKey(thirdPlace.team1))">
                <span v-else class="team-logo-placeholder">{{ thirdPlace.team1 ? thirdPlace.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="thirdPlace.team1" class="seed">#{{ thirdPlace.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ thirdPlace.team1 ? thirdPlace.team1.name : 'Derrotado Jogo E' }}</span>
              <span v-if="thirdPlace.status==='done'||isLive(thirdPlace)" class="score">{{ thirdPlace.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[thirdPlace.status==='done'&&thirdPlace.winner===null?'draw':{winner:thirdPlace.status==='done'&&thirdPlace.winner===2,loser:thirdPlace.status==='done'&&thirdPlace.winner!==2,tbd:!thirdPlace.team2}]">
              <span class="team-logo-wrap">
                <img v-if="thirdPlace.team2 && thirdPlace.team2.logo && !brokenLogos.has(logoKey(thirdPlace.team2))" class="team-logo-img" :src="logoPath(thirdPlace.team2)" @error="brokenLogos.add(logoKey(thirdPlace.team2))">
                <span v-else class="team-logo-placeholder">{{ thirdPlace.team2 ? thirdPlace.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="thirdPlace.team2" class="seed">#{{ thirdPlace.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ thirdPlace.team2 ? thirdPlace.team2.name : 'Derrotado Jogo F' }}</span>
              <span v-if="thirdPlace.status==='done'||isLive(thirdPlace)" class="score">{{ thirdPlace.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(thirdPlace)" :match="thirdPlace" />
          </div>
          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar meias-finais</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="val-final-divider">
          <div class="val-final-vs"></div>
        </div>

        <!-- Final -->
        <div class="val-final-col">
          <div class="val-final-col-label val-final-col-label--gold">FINAL</div>
          <div
            v-if="theFinal"
            class="match-card match-card--bo3 match-card--the-final"
            :class="matchCardClass(theFinal)"
            @click="onMatchCardClick(theFinal)"
          >
            <div class="match-format-tag" :class="{ 'tag-live': isLive(theFinal) }">
              <span v-if="isLive(theFinal)" class="tag-live-dot" />
              {{ isLive(theFinal) ? 'LIVE' : 'BO3' }}
            </div>

            <div v-if="theFinal.start_time && !isLive(theFinal)" class="match-time-row">
              <v-icon size="11" style="opacity:0.5">mdi-clock-outline</v-icon> {{ theFinal.start_time }}
            </div>

            <div class="team-row" :class="[theFinal.status==='done'&&theFinal.winner===null?'draw':{winner:theFinal.status==='done'&&theFinal.winner===1,loser:theFinal.status==='done'&&theFinal.winner!==1,tbd:!theFinal.team1}]">
              <span class="team-logo-wrap">
                <img v-if="theFinal.team1 && theFinal.team1.logo && !brokenLogos.has(logoKey(theFinal.team1))" class="team-logo-img" :src="logoPath(theFinal.team1)" @error="brokenLogos.add(logoKey(theFinal.team1))">
                <span v-else class="team-logo-placeholder">{{ theFinal.team1 ? theFinal.team1.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="theFinal.team1" class="seed">#{{ theFinal.team1.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ theFinal.team1 ? theFinal.team1.name : 'Vencedor Jogo E' }}</span>
              <span v-if="theFinal.status==='done'||isLive(theFinal)" class="score">{{ theFinal.score1 }}</span>
            </div>

            <div class="match-divider" />

            <div class="team-row" :class="[theFinal.status==='done'&&theFinal.winner===null?'draw':{winner:theFinal.status==='done'&&theFinal.winner===2,loser:theFinal.status==='done'&&theFinal.winner!==2,tbd:!theFinal.team2}]">
              <span class="team-logo-wrap">
                <img v-if="theFinal.team2 && theFinal.team2.logo && !brokenLogos.has(logoKey(theFinal.team2))" class="team-logo-img" :src="logoPath(theFinal.team2)" @error="brokenLogos.add(logoKey(theFinal.team2))">
                <span v-else class="team-logo-placeholder">{{ theFinal.team2 ? theFinal.team2.name.charAt(0) : '?' }}</span>
              </span>

              <span v-if="theFinal.team2" class="seed">#{{ theFinal.team2.seed }}</span>
              <span v-else class="seed tbd-seed">?</span>
              <span class="team-name">{{ theFinal.team2 ? theFinal.team2.name : 'Vencedor Jogo F' }}</span>
              <span v-if="theFinal.status==='done'||isLive(theFinal)" class="score">{{ theFinal.score2 }}</span>
            </div>

            <MatchStatusBadge :is-live="isLive(theFinal)" :match="theFinal" />
          </div>
          <div v-else class="val-tbd-card">
            <v-icon size="20" style="opacity:0.2">mdi-help-circle-outline</v-icon>
            <span>A aguardar meias-finais</span>
          </div>

          <!-- Champion -->
          <div v-if="champion" class="champion-card" style="margin-top:12px">
            <div class="champion-glow" />
            <img v-if="champion.logo && !brokenLogos.has(logoKey(champion))" class="champion-logo" :src="logoPath(champion)" @error="brokenLogos.add(logoKey(champion))">
            <v-icon v-else color="#FFB404" size="40">mdi-trophy</v-icon>
            <div class="champion-seed">#{{ champion.seed }}</div>
            <div class="champion-name">{{ champion.name }}</div>
          </div>
        </div>

      </div>

    </template>
  </div>
</template>

<script setup>
  import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
  import * as XLSX from 'xlsx'

  // Reusable status badge
  const MatchStatusBadge = defineComponent({
    props: ['match', 'isLive'],
    template: `
    <div v-if="isLive" class="match-status-badge live-badge"><span class="live-badge-dot"></span> A decorrer</div>
    <div v-else-if="match.status === 'done'" class="match-status-badge done"><v-icon size="10">mdi-check</v-icon> Concluído</div>
    <div v-else class="match-status-badge pending"><v-icon size="10">mdi-clock-outline</v-icon> A aguardar</div>
  `,
  })

  // ── Config ────────────────────────────────────────────────────────────────────
  const randomizerLinks = {
  cs2: 'https://app-sorteos.com/w/49P25MQ',
  lol: 'https://app-sorteos.com/w/49P6ZPJ',
  val: 'https://app-sorteos.com/w/75M776E',
  rl: 'https://app-sorteos.com/w/D5KV31O'
}

  // CS2/LoL: 4 groups of 4
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

  // Rocket League: 2 groups of 4
  const rlGroupList = [
    { id: 'A', color: '#0286F7' },
    { id: 'B', color: '#22C55E' },
  ]

  const games = [
    { id: 'cs2', label: 'CS2', color: '#F4A723', icon: '/icons/cs2.png' },
    { id: 'lol', label: 'LoL', color: '#C89B3C', icon: '/icons/lol.png' },
    { id: 'val', label: 'Valorant', color: '#FF4655', icon: '/icons/val.png' },
    { id: 'rl', label: 'Rocket Lg.', color: '#0286F7', icon: '/icons/rl.png' },
    { id: 'fc', label: 'EA FC', color: '#00ACED', icon: '/icons/fc.png' },
  ]

  // ── Logos ─────────────────────────────────────────────────────────────────────
  // Logos come straight from the "logo" column in the Google Sheet (a direct image URL).
  const brokenLogos = reactive(new Set())
  function logoPath (t) {
    return t?.logo ? String(t.logo).trim() : ''
  }
  function logoKey (t) {
    return t?.logo ? String(t.logo).trim() : (t?.name || 'no-logo')
  }

  // ── Collapse state ────────────────────────────────────────────────────────────
  const collapsedGroups = reactive({ A: false, B: false, C: false, D: false })
  function toggleGroup (id) {
    collapsedGroups[id] = !collapsedGroups[id]
  }

  // ── Click ─────────────────────────────────────────────────────────────────────
  function onMatchCardClick (match) {
    if (!match || !isLive(match)) return
    if (window.innerWidth >= 840) window.open('https://www.twitch.tv/jogaliaoficial', '_blank', 'noopener')
  }

  // ── Live ──────────────────────────────────────────────────────────────────────
  function isLiveRaw (m) {
    const v = m.live
    if (v === null || v === undefined || v === '' || v === 0 || v === '0' || v === false || v === 'false' || v === 'FALSE') return false
    return true
  }
  function isLive (m) {
    return m ? isLiveRaw(m) : false
  }

  // ── All-games live tracking ───────────────────────────────────────────────────
  const allGameMatches = reactive({})
  const liveGames = computed(() => {
    const s = new Set()
    for (const [id, ms] of Object.entries(allGameMatches)) {
      if (ms.some(m => isLiveRaw(m))) s.add(id)
    }
    return s
  })
  const gameStartTimes = computed(() => {
    const map = {}
    for (const [id, ms] of Object.entries(allGameMatches)) {
      const t = ms.map(m => m.start_time).filter(Boolean)
      if (t.length > 0) map[id] = t[0]
    }
    return map
  })

  // ── Selected game ─────────────────────────────────────────────────────────────
  const selectedGame = ref('cs2')
  const currentGame = computed(() => games.find(g => g.id === selectedGame.value) || games[0])
  function selectGame (id) {
    if (id === selectedGame.value) return
    selectedGame.value = id
    if (lastWorkbook) {
      applyGameData(lastWorkbook, id)
      syncState.value = 'ok'
    } else {
      teams.value = []; matches.value = []
      teamsLoaded.value = false; matchesLoaded.value = false
      syncState.value = 'loading'
    }
    refresh()
  }

  // ── Data ──────────────────────────────────────────────────────────────────────
  // All teams/matches for every game live in ONE Google Sheets workbook,
  // with one sheet per game named "<gameId>_teams" / "<gameId>_matches"
  // (e.g. "cs2_teams", "cs2_matches", "fc_teams", "fc_matches", ...).
  const SHEET_ID = '1IlDuefwslDPL5kf5P63fwtwpudzlX-YoF3jS7_oeCaI'
  const XLSX_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`

  const teams = ref([]); const matches = ref([])
  const teamsLoaded = ref(false); const matchesLoaded = ref(false)
  const syncState = ref('loading'); const lastSyncTime = ref('')
  let pollInterval = null
  let lastWorkbook = null

  async function fetchWorkbook () {
    const res = await fetch(`${XLSX_URL}&_=${Date.now()}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = await res.arrayBuffer()
    return XLSX.read(buf, { type: 'array' })
  }

  function sheetToJson (wb, sheetName) {
    const ws = wb.Sheets[sheetName]
    return ws ? XLSX.utils.sheet_to_json(ws) : []
  }

  function applyGameData (wb, gameId) {
    teams.value = sheetToJson(wb, `${gameId}_teams`)
    matches.value = sheetToJson(wb, `${gameId}_matches`)
    teamsLoaded.value = teams.value.length > 0
    matchesLoaded.value = matches.value.length > 0
  }

  async function refresh () {
    try {
      const wb = await fetchWorkbook()
      lastWorkbook = wb
      for (const g of games) {
        allGameMatches[g.id] = sheetToJson(wb, `${g.id}_matches`)
      }
      applyGameData(wb, selectedGame.value)
      syncState.value = 'ok'
      lastSyncTime.value = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch (error) {
      console.error('[TournamentBracket]', error)
      syncState.value = 'error'
    }
  }

  onMounted(() => {
    refresh(); pollInterval = setInterval(refresh, 30_000)
  })
  onUnmounted(() => clearInterval(pollInterval))

  // ── Helpers ───────────────────────────────────────────────────────────────────
  // FIX 1: Força comparação numérica para evitar falhas seed string vs número
  function teamBySeed (seed) {
    if (seed === null || seed === undefined || seed === '' || Number(seed) === 0) return null
    return teams.value.find(t => String(t.seed).trim() === String(seed).trim()) || null
  }

  // FIX 2: Converte serial date do Excel para string legível
  function formatStartTime (val) {
    if (!val && val !== 0) return null
    if (typeof val === 'number') {
      const date = new Date(Math.round((val - 25_569) * 86_400 * 1000))
      return date.toLocaleString('pt-PT', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    }
    return String(val).trim() || null
  }

  function enrichMatch (m) {
    if (!m) return null
    const t1 = teamBySeed(m.team1_seed), t2 = teamBySeed(m.team2_seed)
    const s1 = m.score1 != null && m.score1 !== '' ? Number(m.score1) : null
    const s2 = m.score2 != null && m.score2 !== '' ? Number(m.score2) : null
    let winner = null
    if (m.status === 'done' && s1 != null && s2 != null) {
      if (s1 > s2) winner = 1
      else if (s2 > s1) winner = 2
    }
    const label = m.label != null ? String(m.label).trim() : ''
    return { ...m, score1: s1, score2: s2, team1: t1, team2: t2, winner, label, start_time: formatStartTime(m.start_time) }
  }

  function matchCardClass (m) {
    if (!m) return {}
    return {
      'match-live': isLive(m),
      'match-done': !isLive(m) && m.status === 'done',
      'match-pending': !isLive(m) && m.status !== 'done',
      'match-live-clickable': isLive(m),
    }
  }

  // ── Round + label helpers (used across CS2/LoL/RL/Val playoff stages) ────────
  // Every match belongs to a numeric `round` (phase). Within a phase there can be
  // several matches (e.g. RL Fase 1 has jogos E, F, G at once) so we tell them
  // apart with the `label` column filled in manually in the Google Sheet.
  function matchesInRound (round) {
    return matches.value.filter(m => Number(m.round) === round).map(enrichMatch)
  }
  function matchByLabel (round, label) {
    const ms = matchesInRound(round)
    if (label) {
      const found = ms.find(m => m.label.toUpperCase() === label.toUpperCase())
      if (found) return found
    }
    return ms[0] || null
  }

  // ── Group helpers (CS2/LoL: 4 groups of 4 · RL: 2 groups of 4 · round=1, 6 matches/grupo) ─
  function groupMatches (grpId) {
    return matches.value
      .filter(m => String(m.group) === String(grpId) && Number(m.round) === 1)
      .map(enrichMatch)
  }

  function groupComplete (grpId) {
    const ms = groupMatches(grpId)
    return ms.length >= 6 && ms.every(m => m.status === 'done')
  }

  function groupStandings (grpId) {
    const ms = groupMatches(grpId)
    const seedSet = new Set()
    for (const m of ms) {
      if (m.team1_seed) seedSet.add(Number(m.team1_seed))
      if (m.team2_seed) seedSet.add(Number(m.team2_seed))
    }
    const stats = {}
    for (const seed of seedSet) {
      const team = teamBySeed(seed)
      stats[seed] = { seed, name: team?.name ?? `#${seed}`, team, wins: 0, losses: 0, played: 0 }
    }
    for (const m of ms) {
      if (m.status !== 'done') continue
      const w = m.winner === 1 ? Number(m.team1_seed) : Number(m.team2_seed)
      const l = m.winner === 1 ? Number(m.team2_seed) : Number(m.team1_seed)
      if (stats[w]) {
        stats[w].wins++; stats[w].played++
      }
      if (stats[l]) {
        stats[l].losses++; stats[l].played++
      }
    }
    return Object.values(stats).sort((a, b) => b.wins - a.wins || a.losses - b.losses)
  }

  function groupWinner (grpId) {
    if (!groupComplete(grpId)) return null
    return groupStandings(grpId)[0]?.team ?? null
  }

  // ── CS2/LoL Playoffs ──────────────────────────────────────────────────────────
  // round=1 grupos · round=2 meias-finais (jogos E/F) · round=3 3º lugar · round=4 final
  const semiFinals = computed(() => matchesInRound(2))
  const thirdPlace = computed(() => matchByLabel(3))
  const theFinal = computed(() => matchByLabel(4))
  const champion = computed(() => {
    const f = theFinal.value
    if (!f || f.status !== 'done') return null
    return f.winner === 1 ? f.team1 : f.team2
  })

  // ── Valorant group helpers (2 groups of 5, 10 matches per group) ──────────────
  function valGroupMatches (grpId) {
    return matches.value
      .filter(m => String(m.group) === String(grpId) && Number(m.round) === 1)
      .map(enrichMatch)
  }

  function valGroupComplete (grpId) {
    const ms = valGroupMatches(grpId)
    return ms.length >= 10 && ms.every(m => m.status === 'done')
  }

  function valGroupStandings (grpId) {
    const ms = valGroupMatches(grpId)
    const seedSet = new Set()
    for (const m of ms) {
      if (m.team1_seed) seedSet.add(m.team1_seed); if (m.team2_seed) seedSet.add(m.team2_seed)
    }
    const stats = {}
    for (const seed of seedSet) {
      const team = teamBySeed(seed)
      stats[seed] = { seed, name: team?.name ?? `#${seed}`, team, wins: 0, losses: 0, played: 0 }
    }
    for (const m of ms) {
      if (m.status !== 'done') continue
      const w = m.winner === 1 ? m.team1_seed : m.team2_seed
      const l = m.winner === 1 ? m.team2_seed : m.team1_seed
      if (stats[w]) {
        stats[w].wins++; stats[w].played++
      }
      if (stats[l]) {
        stats[l].losses++; stats[l].played++
      }
    }
    return Object.values(stats).sort((a, b) => b.wins - a.wins || a.losses - b.losses)
  }

  function valStandingRowClass (grpId, i) {
    const complete = valGroupComplete(grpId)
    return {
      'st-first': i === 0 && complete,
      'st-second': i === 1 && complete,
    }
  }

  // ── Valorant Playoffs ─────────────────────────────────────────────────────────
  // round=1 grupos · round=2 Fase 1 (jogos E: 1ºA-1ºB / F: 2ºA-2ºB)
  // round=3 Fase 2 (derrotado E vs vencedor F) · round=4 Final (vencedor E vs vencedor Fase 2)
  // 3º lugar = derrotado da Fase 2, sem jogo próprio.
  const valFase1Matches = computed(() => matchesInRound(2))
  const valFase2 = computed(() => matchByLabel(3))
  const valFinal = computed(() => matchByLabel(4))
  const valChampion = computed(() => {
    const f = valFinal.value
    if (!f || f.status !== 'done') return null
    return f.winner === 1 ? f.team1 : f.team2
  })

  // ── Rocket League Playoffs ────────────────────────────────────────────────────
  // round=1 grupos (top 3 de 4 avançam) · round=2 Fase 1 (E: 1ºA-2ºB / F: 1ºB-2ºA / G: 3ºB-3ºA)
  // round=3 Fase 2 (K: vencedorE-vencedorF / J: derrotadoE-derrotadoF / H: derrotadoJ-vencedorG)
  // round=4 Fase 3 (I: vencedorJ-vencedorH, derrotado I = 3º lugar) · round=5 Final (vencedorK-vencedorI)
  const rlPhase1 = computed(() => matchesInRound(2))
  const rlPhase2 = computed(() => matchesInRound(3))
  const rlPhase3 = computed(() => matchByLabel(4))
  const rlFinal = computed(() => matchByLabel(5))
  const rlChampion = computed(() => {
    const f = rlFinal.value
    if (!f || f.status !== 'done') return null
    return f.winner === 1 ? f.team1 : f.team2
  })
  const rl3rdPlace = computed(() => {
    const f = rlPhase3.value
    if (!f || f.status !== 'done') return null
    return f.winner === 1 ? f.team2 : f.team1
  })

  // ── EA FC League helpers ──────────────────────────────────────────────────────
  const leagueMatches = computed(() =>
    matches.value
      .filter(m => Number(m.round) === 1)
      .map(enrichMatch)
      .sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') return -1
        if (b.status === 'done' && a.status !== 'done') return 1
        return (a.match_id ?? 0) - (b.match_id ?? 0)
      }),
  )

  const leagueStandings = computed(() => {
    const stats = {}
    for (const t of teams.value) {
      stats[t.seed] = { seed: t.seed, name: t.name, team: t, pts: 0, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0 }
    }
    for (const m of leagueMatches.value) {
      if (m.status !== 'done') continue
      const s1 = Number(m.score1 ?? 0), s2 = Number(m.score2 ?? 0)
      const e1 = stats[m.team1_seed], e2 = stats[m.team2_seed]
      if (e1) {
        e1.played++; e1.gf += s1; e1.ga += s2; e1.gd += s1 - s2
      }
      if (e2) {
        e2.played++; e2.gf += s2; e2.ga += s1; e2.gd += s2 - s1
      }
      if (s1 > s2) {
        if (e1) {
          e1.wins++; e1.pts += 3
        }
        if (e2) {
          e2.losses++
        }
      } else if (s2 > s1) {
        if (e2) {
          e2.wins++; e2.pts += 3
        }
        if (e1) {
          e1.losses++
        }
      } else {
        if (e1) {
          e1.draws++; e1.pts += 1
        }
        if (e2) {
          e2.draws++; e2.pts += 1
        }
      }
    }
    return Object.values(stats).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.seed - b.seed)
  })

  function leagueRowClass (i) {
    return { 'lt-row--champion': i === 0 }
  }
  function leaguePosClass (i) {
    return i === 0 ? 'lt-pos--gold' : ''
  }

  // ── EA FC Playoffs ────────────────────────────────────────────────────────
  // round=2 Fase 1 BO3 (label E: 1º-4º · label F: 2º-3º)
  // round=3 Fase 2 BO3 (label FINAL: vencedor E - vencedor F · label 3RD: derrotado E - derrotado F)
  const fcFase1Matches = computed(() => matchesInRound(2))
  const fcFinal = computed(() => matchByLabel(3, 'FINAL'))
  const fcThirdPlace = computed(() => matchByLabel(3, '3RD'))
  const fcChampion = computed(() => {
    const f = fcFinal.value
    if (!f || f.status !== 'done') return null
    return f.winner === 1 ? f.team1 : f.team2
  })
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
.bracket-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  text-align: center;
}
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

/* 2nd/3rd place advance styling in standings */
.st-row.st-second { background: rgba(6,134,243,.05); }
.st-pos--advance { color: #FF4655 !important; }

/* advances strip (val + rl) */
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

/* ── PLAYOFF SEMIS / SINGLE-STAGE GRIDS (Val/CS2/LoL) ───────────────────────── */
.val-ko-grid { margin-bottom: 4px; }
.val-ko-semis {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 540px) {
  .val-ko-semis { grid-template-columns: 1fr 1fr; }
}
.val-ko-semis--single { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
.val-ko-card { border-color: rgba(255,70,85,.3) !important; }

/* ── ROCKET LEAGUE MULTI-STAGE GRID ──────────────────────────────────────── */
.rl-stage-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 4px;
}
@media (min-width: 540px) {
  .rl-stage-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 900px) {
  .rl-stage-grid { grid-template-columns: repeat(3, 1fr); }
}
.rl-stage-grid--single { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }

/* ── FINAL GRID (Val / CS2 / LoL) ────────────────────────────────────────── */
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

/* Podium row (3rd place, automatic) */
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

/* Groups grid (CS2/LoL) */
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
.team-row { display: flex; align-items: center; gap: 7px; padding: 8px 10px; transition: background .15s; }
.team-row.winner { background: rgba(0,221,254,.08); }
.team-row.loser  { opacity: .4; }
.team-row.draw   { opacity: .7; }
.team-row.tbd    { opacity: .35; }
.team-name { flex: 1; font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.seed { font-size: 9px; font-weight: 800; color: #FFB404; min-width: 20px; }
.seed.tbd-seed { color: rgba(255,255,255,.3); }
.score { font-size: 14px; font-weight: 900; color: #00DDFE; min-width: 20px; text-align: right; font-variant-numeric: tabular-nums; }
.match-divider { height: 1px; background: rgba(255,255,255,.07); margin: 0 10px; }
.team-logo-wrap { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex-shrink: 0; }
.team-logo-img  { width: 22px; height: 22px; object-fit: contain; border-radius: 3px; }
.team-logo-placeholder { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: rgba(6,134,243,.15); border: 1px solid rgba(6,134,243,.2); border-radius: 3px; font-size: 10px; font-weight: 900; color: rgba(255,255,255,.5); }
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

/* Final (RL champion block reuses this) */
.final4-wrapper { overflow-x: auto; padding-bottom: 8px; }
.final4-grid { display: flex; align-items: center; justify-content: center; gap: 24px; min-width: max-content; margin: 0 auto; }
.f4-col { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 0 8px; }
.f4-col-label { font-size: 10px; font-weight: 800; letter-spacing: .18em; color: rgba(255,255,255,.3); text-align: center; white-space: nowrap; }
.f4-col:first-child { width: 260px; }
.f4-col--champion   { width: 150px; }
.f4-final { width: 100%; }

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

.randomizer-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 172, 237, 0.15);
  border: 1px solid rgba(0, 172, 237, 0.35);
  transition: all .15s ease;
}

.randomizer-btn:hover {
  background: rgba(0, 172, 237, 0.25);
  border-color: rgba(0, 172, 237, 0.6);
}
</style>