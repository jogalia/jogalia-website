<template>
  <div
    class="match-card"
    :class="{
      'match-live': match.status === MatchStatus.Happening,
      'match-done': match.status === MatchStatus.Done,
      'match-pending': match.status === MatchStatus.Waiting,
    }"
    :style="{ '--custom-border-color': props.customBorderColor }"
    @click="() => match.status === MatchStatus.Happening ? openTwitch() : null"
  >
    <div class="match-format-tag" :class="{ 'tag-live': match.status === MatchStatus.Happening }">
      <span v-if="match.status === MatchStatus.Happening" class="tag-live-dot" />
      {{ match.status === MatchStatus.Happening ? 'LIVE' : label }}
    </div>

    <div class="match-time-row">
      <v-icon color="on-surface" size="11">mdi-clock-outline</v-icon>
      {{ match.startTime && match.status !== MatchStatus.Happening ? match.startTime : 'Now' }}
    </div>

    <div
      class="team-row"
      :class="[
        {
          draw: match.status === MatchStatus.Done && match.score1 === match.score2,
          winner: match.status === MatchStatus.Done && match.score1 > match.score2,
          loser: match.status === MatchStatus.Done && match.score1 < match.score2,
          tbd: !match.team1
        }
      ]"
    >
      <span class="team-logo-wrap">
        <img
          v-if="team1?.logo ?? false"
          class="team-logo-img"
          :src="team1?.logo"
        >

        <span v-else class="team-logo-placeholder">{{ match.team1 ? match.team1.charAt(0) : '?' }}</span>
      </span>

      <span class="team-name">{{ match.team1 ? match.team1 : 'TBD' }}</span>
      <span v-if="match.status !== MatchStatus.Waiting" class="score">{{ match.score1 }}</span>
    </div>

    <div
      class="team-row"
      :class="[
        {
          draw: match.status === MatchStatus.Done && match.score2 === match.score1,
          winner: match.status === MatchStatus.Done && match.score2 > match.score1,
          loser: match.status === MatchStatus.Done && match.score2 < match.score1,
          tbd: !match.team2
        }
      ]"
    >
      <span class="team-logo-wrap">
        <img
          v-if="team2?.logo ?? false"
          class="team-logo-img"
          :src="team2?.logo"
        >

        <span v-else class="team-logo-placeholder">{{ match.team2 ? match.team2.charAt(0) : '?' }}</span>
      </span>

      <span class="team-name">{{ match.team2 ? match.team2 : 'TBD' }}</span>
      <span v-if="match.status !== MatchStatus.Waiting" class="score">{{ match.score2 }}</span>
    </div>

    <!-- <MatchStatusBadge :is-live="isLive(match)" :match="match" /> -->
  </div>
</template>

<script setup lang="ts">
  import { type Match, MatchStatus, type Team } from '@/api/sheets.ts'

  const props = defineProps<{
    match: Match
    team1?: Team
    team2?: Team
    label: string
    customBorderColor?: string
  }>()

  function openTwitch () {
    window.open('https://www.twitch.tv/jogaliaoficial', '_blank', 'noopener')
  }
</script>

<style scoped>
.match-card {
  position: relative;
  background: rgba(var(--v-theme-surface-light));
  border: 1px solid var(--custom-border-color, var(--v-border-color));
  border-radius: 8px;
  overflow: visible;
  transition: border-color .2s, box-shadow .2s;
}

.match-card.match-done {
  border-color: var(--custom-border-color, var(--v-border-color-highlight));
}

.match-card.match-pending {
  border-color: var(--custom-border-color, var(--v-border-color));
}

.match-card.match-live {
  border-color: rgba(220, 38, 38, .7);
  background: rgba(220, 38, 38, .06);
  box-shadow: 0 0 14px rgba(220, 38, 38, .2);
  animation: live-card-pulse 2.5s ease-in-out infinite;
  cursor: pointer;
}

.match-format-tag {
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .12em;
  background: #716038;
  border: 1px solid rgba(var(--v-theme-secondary));
  border-radius: 3px;
  padding: 1px 6px;
  color: rgba(var(--v-theme-secondary));
  white-space: nowrap;
  z-index: 1;
}

.match-format-tag.tag-live {
  background: #7F1D1D;
  border-color: rgba(220, 38, 38, .6);
  color: #FCA5A5;
}

.tag-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #F87171;
  animation: pulse-dot 1.2s ease-in-out infinite;
  flex-shrink: 0;
}

.match-time-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface));
  padding: 4px 10px 0;
}

.team-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px;
  transition: background .15s;
}

.team-row.winner {
  background: rgba(0, 221, 254, .08);
}

.team-row.loser {
  opacity: .4;
}

.team-row.draw {
  opacity: .7;
}

.team-row.tbd {
  opacity: .35;
}

.team-name {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-background));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.score {
  font-size: 14px;
  font-weight: 900;
  color: rgba(var(--v-theme-secondary));
  min-width: 20px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.team-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.team-logo-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  border-radius: 3px;
}

.team-logo-placeholder {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 134, 243, .15);
  border: 1px solid rgba(6, 134, 243, .2);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 900;
  color: rgba(255, 255, 255, .5);
}</style>
