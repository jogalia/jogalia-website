<template>
  <v-app>
    <Nav />

    <v-main :class="route.meta.isHero ? 'pt-0' : ''">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  import Nav from '@/components/Nav.vue'

  const route = useRoute()
</script>
