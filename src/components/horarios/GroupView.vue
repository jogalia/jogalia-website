<template>
  <div class="group-block">
    <div class="group-header">
      <span class="group-badge">GRUPO {{ groupLabel }}</span>
    </div>

    <Leaderboard :matches="groupMatches" :teams="teams" />

    <div class="group-matches">
      <MatchView
        v-for="(match, i) in groupMatches"
        :key="i"
        :label="game === Game.RocketLeague ? 'BO3' : 'BO1'"
        :match="match"
        :team1="teams.find(t => t.name === match.team1)"
        :team2="teams.find(t => t.name === match.team2)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Game, type Match, type Team } from '@/api/sheets.ts'
  import Leaderboard from '@/components/horarios/Leaderboard.vue'
  import MatchView from '@/components/horarios/MatchView.vue'

  const props = withDefaults(defineProps<{
    groupId: string
    groupCustomLabel?: string
    groupMatches: Match[]
    teams: Team[]
    game: Game
  }>(), {})

  const groupLabel = props.groupCustomLabel || props.groupId
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
