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
  import { useHead, useSeoMeta } from '@unhead/vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Footer from '@/components/Footer.vue'
  import Nav from '@/components/Nav.vue'

  const route = useRoute()

  const pageTitle = computed(() => {
    const subtitle = route.meta?.title ? String(route.meta.title) : ''
    return subtitle ? `Jogália | ${subtitle}` : 'Jogália | Esports & TCG'
  })

  const pageDescription = computed(() => {
    return route.meta?.description ? String(route.meta.description) : 'Esports, Gaming, Tecnologia e TCG no IST Oeiras.'
  })

  useHead({
    title: pageTitle,
    htmlAttrs: { lang: 'pt' },
  })

  useSeoMeta({
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage: 'https://jogalia.tecnico.ulisboa.pt/logo.png',
  })
</script>
