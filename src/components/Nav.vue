<template>
  <v-app-bar
    class="nav"
    scroll-behavior="elevate"
    scroll-threshold="140"
  >
    <div class="ml-6 flex-1 max-w-[150px] flex items-center"> <!-- se for isotopo eh 60px -->
      <router-link class="w-full" to="/">
        <v-img src="@/assets/logo.svg" />
      </router-link>
    </div>

    <v-spacer />

    <div class="hidden md:flex gap-2 items-center">
      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/equipas"
        variant="text"
      >Equipas</v-btn>

      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/horarios"
        variant="text"
      >Horários</v-btn>

      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/mapa"
        variant="text"
      >Mapa</v-btn>

      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/parceiros"
        variant="text"
      >Parceiros</v-btn>

      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/transmissao"
        variant="text"
      >Transmissão</v-btn>
    </div>

    <v-spacer />

    <div class="mr-6 flex-1 max-w-[150px] hidden md:block" />

    <div class="block md:hidden">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    class="bg-midnightBlue text-white"
    location="right"
    temporary
  >
    <v-list class="bg-midnightBlue pt-4">
      <v-list-item class="italic bold uppercase py-3" to="/inscricoes">Inscrições</v-list-item>
      <v-list-item class="italic bold uppercase py-3" to="/horarios">Horários</v-list-item>
      <v-list-item class="italic bold uppercase py-3" to="/localizacao">Mapa</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const drawer = ref(false)
</script>

<style scoped>
.nav.v-toolbar--flat {
  background-color: transparent !important;
  transition: background-color 0.3s ease-in-out;
  color: var(--v-theme-on-background);
}

.nav {
  background-color: rgb(var(--v-theme-midnightBlue)) !important;
  color: var(--v-theme-on-background);
}

.nav :deep(.v-btn__overlay) {
  background: rgb(var(--v-theme-secondary));
  top: auto;
  bottom: 0;
  height: 3px;
  width: 80%;
  left: 10%;
}

.nav :deep(.v-btn:hover .v-btn__overlay) {
  opacity: 1;
}
</style>
