<template>
  <div class="group-block">
    <div class="group-header">
      <span class="group-badge">GRUPO {{ groupLabel }}</span>
    </div>

    <div class="standings-table">
      <div class="st-head">
        <span class="st-team">Equipa</span>
        <span class="st-stat">V</span>
        <span class="st-stat">D</span>
        <span class="st-stat">E</span>
      </div>

      <div
        v-for="(standing, i) in standings"
        :key="i"
        class="st-row"
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
      </div>
    </div>

    <div class="group-matches">
      <MatchView
        v-for="(match, i) in groupMatches"
        :key="i"
        label="BO1"
        :match="match"
        :team1="teams.find(t => t.name === match.team1)"
        :team2="teams.find(t => t.name === match.team2)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { type Match, MatchStatus, type Team } from '@/api/sheets.ts'
  import MatchView from '@/components/horarios/MatchView.vue'

  type Standing = {
    team: string
    group: string
    victories: number
    defeats: number
    draws: number
  }

  const props = withDefaults(defineProps<{
    groupId: string
    groupCustomLabel?: string
    groupMatches: Match[]
    teams: Team[]
  }>(), {})

  const groupLabel = props.groupCustomLabel || props.groupId

  const standings = computed<Standing[]>(() => {
    const val: { [key: string]: Standing } = {}

    const ensureTeamExists = (teamName: string) => {
      if (!val[teamName] && props.teams.some(t => t.name === teamName)) {
        val[teamName] = { team: teamName, group: props.groupId, victories: 0, defeats: 0, draws: 0 }
      }
    }

    for (const match of props.groupMatches) {
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

    return Object.values(val).sort((a: Standing, b: Standing) => b.victories - a.victories)
  })

</script>

<style scoped>
/* Group block */
.group-block {
  background: rgba(var(--v-theme-surface));
  border: 1px solid var(--v-border-color-highlight);
  border-radius: 12px;
  padding: 14px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-badge {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .18em;
  color: rgba(var(--v-theme-on-surface));
}

/* Standings table */
.standings-table {
  background: rgba(0, 0, 0, .2);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .06);
}

.st-head {
  display: grid;
  grid-template-columns: 20px 22px 1fr 22px 22px 22px;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255, 255, 255, .04);
  gap: 4px;
}

.st-team {
  grid-column: 3;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .12em;
  color: rgba(255, 255, 255, .3);
}

.st-stat {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .08em;
  color: rgba(255, 255, 255, .3);
  text-align: center;
}

.st-row {
  display: grid;
  grid-template-columns: 20px 22px 1fr 22px 22px 22px;
  align-items: center;
  padding: 5px 8px;
  gap: 4px;
  border-top: 1px solid rgba(255, 255, 255, .04);
  transition: background .15s;
}

.st-row.st-first {
  background: rgba(255, 180, 4, .07);
}

.st-pos {
  font-size: 10px;
  font-weight: 800;
  color: rgba(255, 255, 255, .25);
  text-align: center;
}

.st-row.st-first .st-pos {
  color: #FFB404;
}

.st-row.st-second .st-pos {
  color: #00DDFE;
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
  color: rgba(255, 255, 255, .8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.st-row.st-first .st-name {
  color: #fff;
}

.st-row.st-second .st-name {
  color: rgba(255, 255, 255, .9);
}

.st-stat-val {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, .5);
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.st-row.st-first .st-stat-val {
  color: rgba(255, 255, 255, .85);
}

/* Match list */
.group-matches {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Group winner */
.group-winner-wrap {
  margin-top: 2px;
}

.group-winner-card {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  background: rgba(255, 180, 4, .07);
  border: 1px solid rgba(255, 180, 4, .28);
  border-radius: 6px;
}

.gw-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 3px;
}

.gw-logo-placeholder {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 180, 4, .15);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 900;
  color: #FFB404;
}

.gw-seed {
  font-size: 9px;
  font-weight: 800;
  color: #FFB404;
}

.gw-name {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gw-advances {
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
  color: #FFB404;
  background: rgba(255, 180, 4, .1);
  border: 1px solid rgba(255, 180, 4, .25);
  border-radius: 3px;
  padding: 1px 5px;
  white-space: nowrap;
}

.group-winner-tbd {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, .2);
  font-weight: 600;
}
</style>
