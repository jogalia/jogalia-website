<template>
  <v-app>
    <Nav />

    <v-main :class="route.meta.isHero ? 'pt-0' : ''">
      <router-view />

      <Footer />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  import Nav from '@/components/Nav.vue'
  import Footer from "@/components/Footer.vue";

  const route = useRoute()
</script>
