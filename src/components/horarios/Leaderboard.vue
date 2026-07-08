<template>
  <div class="standings-table" :style="{ '--grid-cols': points ? '20px 22px 1fr 22px 22px 22px 22px' : '' }">
    <div class="st-head">
      <span class="st-team">Equipa</span>
      <span class="st-stat">V</span>
      <span class="st-stat">D</span>
      <span class="st-stat">E</span>
      <span v-if="points" class="st-stat">P</span>
    </div>

    <div
      v-for="(standing, i) in standings"
      :key="i"
      class="st-row"
      :class="{'st-first': i === 0, 'st-second': i === 1}"
    >
      <span class="st-pos">{{ i + 1 }}</span>

      <span class="st-logo-wrap">
        <img
          v-if="teams.find(t => t.name === standing.team)?.logo ?? false"
          :alt="standing.team"
          class="st-logo"
          :src="teams.find(t => t.name === standing.team)!.logo"
        >

        <span v-else class="st-logo-placeholder">{{ standing.team?.charAt(0) ?? '?' }}</span>
      </span>

      <span class="st-name">{{ standing.team }}</span>
      <span class="st-stat-val">{{ standing.victories }}</span>
      <span class="st-stat-val">{{ standing.defeats }}</span>
      <span class="st-stat-val">{{ standing.draws }}</span>
      <span v-if="points" class="st-stat-val">{{ standing.points }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { type Match, MatchStatus, type Team } from '@/api/sheets.ts'

  type Standing = {
    team: string
    victories: number
    defeats: number
    draws: number
    points: number
  }

  type PointSettings = {
    win: number
    lose: number
    draw: number
  }

  const props = withDefaults(defineProps<{
    matches: Match[]
    teams: Team[]
    points?: PointSettings
  }>(), {})

  const standings = computed<Standing[]>(() => {
    const val: { [key: string]: Standing } = {}

    const ensureTeamExists = (teamName: string) => {
      if (!val[teamName] && props.teams.some(t => t.name === teamName)) {
        val[teamName] = { team: teamName, victories: 0, defeats: 0, draws: 0, points: 0 }
      }
    }

    for (const match of props.matches) {
      ensureTeamExists(match.team1)
      ensureTeamExists(match.team2)

      if (match.status !== MatchStatus.Done) continue

      if (match.score1 > match.score2) {
        val[match.team1].victories++
        val[match.team2].defeats++
      } else if (match.score1 === match.score2) {
        val[match.team1].draws++
        val[match.team2].draws++
      } else {
        val[match.team1].defeats++
        val[match.team2].victories++
      }
    }

    if (props.points) {
      for (const team of props.teams) {
        val[team.name].points = val[team.name].victories * props.points.win
          + val[team.name].defeats * props.points.lose
          + val[team.name].draws * props.points.draw
      }
    }

    return Object.values(val).sort((a: Standing, b: Standing) => props.points ? b.points - a.points : b.victories - a.victories)
  })
</script>

<style scoped>
.standings-table {
  background: rgba(var(--v-theme-surface));
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--v-border-color);
}

.st-head {
  display: grid;
  grid-template-columns: var(--grid-cols, 20px 22px 1fr 22px 22px 22px);
  align-items: center;
  padding: 4px 8px;
  background: rgba(var(--v-theme-surface-light));
  gap: 4px;
}

.st-team {
  grid-column: 3;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .12em;
  color: rgba(var(--v-theme-on-surface));
}

.st-stat {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .08em;
  color: rgba(var(--v-theme-on-surface));
  text-align: center;
}

.st-row {
  display: grid;
  grid-template-columns: var(--grid-cols, 20px 22px 1fr 22px 22px 22px);
  align-items: center;
  padding: 5px 8px;
  gap: 4px;
  border-top: 1px solid var(--v-border-color);
  transition: background .15s;
}

.st-pos {
  font-size: 10px;
  font-weight: 800;
  color: rgba(var(--v-theme-on-surface-light));
  text-align: center;
}

.st-row.st-first .st-pos {
  color: rgba(var(--v-theme-secondary));;
}

.st-row.st-second .st-pos {
  color: rgba(var(--v-theme-neonBlue));
}

.st-logo-wrap {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.st-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 3px;
}

.st-logo-placeholder {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 134, 243, .15);
  border-radius: 3px;
  font-size: 9px;
  font-weight: 900;
  color: rgba(255, 255, 255, .5);
}

.st-name {
  font-size: 11px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-background));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.st-stat-val {
  font-size: 11px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface-light));
  text-align: center;
  font-variant-numeric: tabular-nums;
}

</style>
