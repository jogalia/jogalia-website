<template>
  <v-sheet class="hero w-full h-screen relative">
    <div class="absolute inset-0 flex flex-col justify-center items-center">
      <h1 class="text-6xl bold text-white text-center mt-3 mb-2">Jogália - Evento Gaming e Esports</h1>
      <h2 class="font-normal text-2xl text-white text-center uppercase">9 a 12 de Julho no Instituto Superior Técnico - Campus Oeiras</h2>

      <div v-if="isEventUpcoming" class="w-full max-w-3xl mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading bold text-5xl md:text-6xl text-primary tracking-tight leading-none">{{ days }}</span>
          <span class="font-heading bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Dias</span>
        </div>

        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading bold text-5xl md:text-6xl text-primary tracking-tight leading-none">{{ hours }}</span>
          <span class="font-heading bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Horas</span>
        </div>

        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading bold text-5xl md:text-6xl text-primary tracking-tight leading-none">{{ minutes }}</span>
          <span class="font-heading bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Minutos</span>
        </div>

        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading bold text-5xl md:text-6xl text-primary tracking-tight leading-none">{{ seconds }}</span>
          <span class="font-heading bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Segundos</span>
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
  background-image: linear-gradient(to bottom, rgba(0, 7, 43, 0) 0%, rgb(var(--v-theme-midnightBlue)) 100%), url(@/assets/hero.webp);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>
