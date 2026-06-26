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

    <div class="flex gap-2 items-center">
      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/inscricoes"
        variant="text"
      >Inscrições</v-btn>

      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/horarios"
        variant="text"
      >Horários</v-btn>

      <v-btn
        class="italic bold uppercase"
        size="large"
        to="/localizacao"
        variant="text"
      >Mapa</v-btn>
    </div>

    <v-spacer />

    <div class="mr-6 flex-1 max-w-[150px] hidden md:block" />
  </v-app-bar>
</template>

<script setup lang="ts">

</script>

<style scoped>
.nav.v-toolbar--flat {
  background-color: transparent !important;
  transition: background-color 0.3s ease-in-out;
  color: var(--v-theme-on-background);
}

.nav {
  background-color: #00072B !important;
  color: var(--v-theme-on-background);
}

.nav :deep(.v-btn__overlay) {
  background: rgb(var(--v-theme-secondary)) !important;
}

.nav :deep(.v-btn:hover .v-btn__overlay) {
  opacity: 0.2 !important;
}
</style>
