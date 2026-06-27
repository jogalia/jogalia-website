<template>
  <Hero />

  <div class="m-auto text-center mt-10 max-w-200">
    <v-img class="max-w-60 m-auto" src="@/assets/logo.svg" />

    <p class="mt-5 text-lg">
      A Jogália é um evento de Esports, gaming e TCG em Oeiras de 9 a 12 de Julho de 2026, organizado pela NexEra
      e pelo LAGE², no Campus Oeiras do Instituto Superior Técnico. Quatro dias de competições, transmissões em direto,
      TCG, workshops e atividades abertas ao público, num dos mais reconhecidos campus universitários de Portugal em
      Engenharia e Tecnologia.
    </p>

    <v-btn color="secondary">
      Consulta os Horários
    </v-btn>

    <h3 class="mt-30 text-secondary italic bold uppercase text-3xl">Os nossos Parceiros</h3>

    <Splide
      class="mt-10"
      :extensions="{ AutoScroll }"
      :options="splideOptions"
    >
      <SplideSlide>
        <v-img alt="Slide 1" src="@/assets/lage.svg" width="100" />
      </SplideSlide>

      <SplideSlide>
        <v-img alt="Slide 2" src="@/assets/logo.svg" width="100" />
      </SplideSlide>

      <SplideSlide>
        <v-img alt="Slide 3" src="@/assets/nexera.png" width="10v-0" />
      </SplideSlide>
    </Splide>
  </div>

  <Footer />
</template>

<script lang="ts" setup>
  import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
  import { Splide, SplideSlide } from '@splidejs/vue-splide'
  import Footer from '@/components/Footer.vue'
  import Hero from '@/components/Hero.vue'

  import '@splidejs/vue-splide/css'

  const splideOptions = {
    type: 'loop',
    drag: 'free',
    focus: 'center',
    perPage: 3,
    autoScroll: {
      speed: 1,
      pauseOnHover: false,
      pauseOnFocus: false,
    },
  }
</script>
