<template>
  <v-sheet class="header w-full h-screen relative">
    <div class="absolute inset-0 flex flex-col justify-center items-center">
      <h1 class="italic text-6xl font-bold text-white text-center mt-3 mb-2">Jogália - Evento Gaming e eSports</h1>
      <h2 class="font-normal text-2xl text-white text-center uppercase">9 a 12 de Julho no Instituto Superior Técnico - Campus Oeiras</h2>

      <div class="w-full max-w-3xl mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading font-bold text-5xl md:text-6xl text-primary tracking-tight leading-none">00</span>
          <span class="font-heading font-bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Dias</span>
        </div>

        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading font-bold text-5xl md:text-6xl text-primary tracking-tight leading-none">00</span>
          <span class="font-heading font-bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Horas</span>
        </div>

        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading font-bold text-5xl md:text-6xl text-primary tracking-tight leading-none">00</span>
          <span class="font-heading font-bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Minutos</span>
        </div>

        <div class="rounded-3xl bg-white text-center py-6 px-4 flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.02]">
          <span class="font-heading font-bold text-5xl md:text-6xl text-primary tracking-tight leading-none">00</span>
          <span class="font-heading font-bold uppercase text-xs md:text-sm text-primary mt-2 tracking-wider">Segundos</span>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">

</script>

<style scoped>
.header {
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(@/assets/header_bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.header-img {
  width: 100% !important;
  height: 100% !important;
}
</style>
