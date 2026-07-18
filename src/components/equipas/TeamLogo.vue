<template>
  <div class="team-logo-wrap">
    <img
      v-if="team?.logo && !broken"
      :alt="team.name"
      class="team-logo"
      :src="team.logo"
      @error="broken = true"
    >

    <div v-else class="team-logo-placeholder">
      <v-icon color="rgba(255,255,255,0.18)" :size="size! / 2">mdi-shield-outline</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Team } from '@/api/sheets.ts'
  import { ref } from 'vue'

  const props = withDefaults(defineProps<{
    team?: Team
    size?: number
  }>(), {
    size: 100,
  })

  const broken = ref(false)
</script>

<style scoped>

.team-logo-wrap {
  width: v-bind("props.size + 'px'");
  height: v-bind("props.size + 'px'");
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.team-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
}

.team-logo-placeholder {
  width: v-bind("props.size + 'px'");
  height: v-bind("props.size + 'px'");
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
