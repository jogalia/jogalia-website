<template>
  <div class="loading-state">
    <v-progress-circular
      class="loading-spinner"
      color="secondary"
      indeterminate
      size="48"
      width="4"
    />

    <span class="loading-text">A carregar...</span>
  </div>
</template>

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
</style>
