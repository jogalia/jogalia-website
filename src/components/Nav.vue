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

    <!-- FIRST SPACER: Pushes content to the center -->
    <v-spacer />

    <!-- 2. CENTER: Navigation Links -->
    <div class="flex gap-2 items-center">
      <v-btn
        size="x-large"
        to="/inscricoes"
        variant="text"
      >Inscrições</v-btn>

      <v-btn
        size="x-large"
        to="/horarios"
        variant="text"
      >Horários</v-btn>

      <v-btn
        size="x-large"
        to="/localizacao"
        variant="text"
      >Mapa</v-btn>
    </div>

    <!-- SECOND SPACER: Pushes placeholder to the right -->
    <v-spacer />

    <!-- 3. RIGHT: Empty Counterweight (Guarantees true dead-center for links) -->
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
