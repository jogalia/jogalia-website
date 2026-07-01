<template>
  <v-sheet class="hero w-full h-screen relative">
    <div class="absolute inset-0 flex flex-col justify-center items-center on-background">
      <h1 class="text-4xl md:text-6xl font-bold text-center mt-3 mb-2 px-4">Jogália - Evento Gaming e Esports</h1>
      <h2 class="font-normal text-lg md:text-2xl text-center uppercase tracking-wide px-4 opacity-80">9 a 12 de Julho no Instituto Superior Técnico - Campus Oeiras</h2>

      <div v-if="isEventUpcoming" class="w-full max-w-3xl mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center px-4">
        <div class="counter-card">
          <span class="counter-digit">{{ days }}</span>
          <span class="counter-label">Dias</span>
        </div>

        <div class="counter-card">
          <span class="counter-digit">{{ hours }}</span>
          <span class="counter-label">Horas</span>
        </div>

        <div class="counter-card">
          <span class="counter-digit">{{ minutes }}</span>
          <span class="counter-label">Minutos</span>
        </div>

        <div class="counter-card">
          <span class="counter-digit">{{ seconds }}</span>
          <span class="counter-label">Segundos</span>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
  import { computed, onUnmounted, ref } from 'vue'

  const eventMs = new Date(2026, 6, 9, 12).getTime() // July 9th

  const now = ref(Date.now())

  const intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  onUnmounted(() => clearInterval(intervalId))

  const totalMsLeft = computed(() => Math.max(0, eventMs - now.value))

  const isEventUpcoming = computed(() => totalMsLeft.value > 0)
  const totalSecondsLeft = computed(() => Math.floor(totalMsLeft.value / 1000))
  const days = computed(() => Math.floor(totalSecondsLeft.value / 86_400))
  const hours = computed(() => Math.floor(totalSecondsLeft.value / 3600) % 24)
  const minutes = computed(() => Math.floor(totalSecondsLeft.value / 60) % 60)
  const seconds = computed(() => totalSecondsLeft.value % 60)
</script>

<style scoped>
.hero {
  background-image: linear-gradient(to bottom, rgba(0, 7, 43, 0) 0%, rgb(var(--v-theme-midnightBlue)) 100%), url(@/assets/img/hero.webp);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.counter-card {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 24px;
  text-align: center;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--v-border-color);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.counter-card:hover {
  transform: scale(1.02);
  border-color: var(--v-border-color-highlight);
}

/* Ensure digits match high-emphasis text color */
.counter-digit {
  font-weight: 700;
  font-style: italic;
  font-size: 3.5rem;
  line-height: 1;
  color: rgb(var(--v-theme-secondary)); /* Makes the digits glowing blue */
}

@media (min-width: 768px) {
  .counter-digit {
    font-size: 3.75rem; /* text-6xl equivalent */
  }
}

/* Label text uses your muted text token style */
.counter-label {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-top: 0.75rem;
  letter-spacing: 0.12em;
  color: rgba(var(--v-theme-on-background));
}

@media (min-width: 768px) {
  .counter-label {
    font-size: 0.875rem; /* text-sm equivalent */
  }
}
</style>
