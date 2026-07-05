<template>
  <div class="game-selector">
    <button
      v-for="game in gameDetails"
      :key="game.id"
      class="game-card"
      :class="{ active: modelValue === game.id }"
      :style="{ '--game-color': game.color }"
      @click="modelValue = game.id"
    >
      <img :alt="game.label" class="game-icon" :src="game.icon">
      <span class="game-label">{{ game.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { Game } from '@/api/sheets.ts'

  const modelValue = defineModel<Game>({ required: true })

  defineProps<{
    gameDetails: { id: Game, label: string, color: string, icon: any }[]
  }>()

</script>

<style scoped>
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
</style>
