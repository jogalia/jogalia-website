<template>
  <Hero />

  <div class="m-auto text-center mt-10 max-w-200">
    <v-img class="max-w-60 m-auto" src="@/assets/img/brand/logo.svg" />

    <p class="mt-5 text-lg">
      A Jogália é um evento de Esports, gaming e TCG em Oeiras de 9 a 12 de Julho de 2026, organizado pela NexEra
      e pelo LAGE², no Campus Oeiras do Instituto Superior Técnico. Quatro dias de competições, transmissões em direto,
      TCG, workshops e atividades abertas ao público, num dos mais reconhecidos campus universitários de Portugal em
      Engenharia e Tecnologia.
    </p>

    <v-btn color="secondary">
      Consulta os Horários
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
  import Hero from '@/components/Hero.vue'
</script>
