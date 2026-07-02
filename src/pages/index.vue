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

    <v-btn color="secondary" to="/horarios">
      Consulta os Horários
    </v-btn>
  </div>

  <div class="m-auto text-center mt-25 max-w-200">
    <h3 class="text-3xl uppercase bold italic text-secondary">Como Chegar</h3>

    <h4 class="text-2xl bold text-on-background text-left">Carris Metropolitana</h4>

    <v-container class="on-background text-left">
      <v-row>
        <v-col
          v-for="line in carrisMetropolitana"
          :key="line.id"
          cols="12"
          sm="6"
        >
          <a
            class="on-background no-underline grid grid-cols-[auto_1fr]"
            :href="`https://carrismetropolitana.pt/lines/${line.id}`"
          >
            <v-chip
              class="me-3 font-bold"
              :color="line.color"
              size="large"
              variant="elevated"
            >
              {{ line.id }}
            </v-chip>

            <span class="on-background">
              {{ line.name }}
            </span>
          </a>
        </v-col>
      </v-row>
    </v-container>

    <h4 class="text-2xl bold text-on-background text-left">Shuttle Técnico</h4>

    <p class="mt-5 text-left">
      O serviço gratuito de Shuttles do Instituto Superior Técnico será prolongado para o evento. O serviço passa pelos locais
      <span class="font-bold">Campus Oeiras (Taguspark) > Sete Rios > Campus Alameda</span>.<br>
      Os seguintes horários estarão em funcionamento:

      <v-data-table class="shuttle-table rounded elevation-1 mt-5" hide-default-footer :items="shuttleTecnico">
        <template #item.partida="{ value }">
          <span class="on-background">{{ value.time }}</span> ({{ value.place }})
        </template>

        <template #item.chegada="{ value }">
          <span class="on-background">{{ value.time }}</span> ({{ value.place }})
        </template>
      </v-data-table>
    </p>
  </div>

  <div class="m-auto text-center mt-25 max-w-200">
    <h3 class="text-3xl uppercase bold italic text-secondary">Com o apoio de</h3>
    <v-img class="m-auto" src="@/assets/img/partners/ist-white.svg" width="200" />
  </div>
</template>

<script lang="ts" setup>
  import Hero from '@/components/Hero.vue'

  const lineColors = {
    red: 'rgb(198, 29, 35)',
    blue: 'rgb(61, 133, 198)',
  }

  const carrisMetropolitana = [
    { id: '1523', name: 'Agualva-Cacém (Estação) - Oeiras (Estação)', color: lineColors.red },
    { id: '1524', name: 'Tercena (Estação) | Circular via Casal do Cotão – Taguspark', color: lineColors.blue },
    { id: '1608', name: 'Oeiras (Estação Norte) - Taguspark (Rotunda Sef)', color: lineColors.red },
    { id: '1531', name: 'Paço De Arcos (Estação Norte) - São Marcos (Rotunda)', color: lineColors.red },
    { id: '1612', name: 'Agualva-Cacém (Estação) - Carcavelos (Estação) via Taguspark (Novo Banco)', color: lineColors.red },
    { id: '1616', name: 'Paço de Arcos (Estação Norte) - Taguspark (Rotunda SEF) via Bº Navegadores', color: lineColors.red },
    { id: '1529', name: 'Oeiras (Estação Norte) - Barcarena (Fábrica da Pólvora) via Taguspark (Novo Banco)', color: lineColors.red },
    { id: '1733', name: 'Marquês Pombal (Metro) - São Marcos via Queijas (Rotunda) e Taguspark', color: lineColors.red },
    { id: '1617', name: 'Paço De Arcos (Estação Norte) - Talaíde (Igreja)', color: lineColors.red },
  ]

  const shuttleTecnico = [
    { partida: { time: '7h40', place: 'Campus Oeiras' }, chegada: { time: '8h40', place: 'Campus Alameda' } },
    { partida: { time: '11h40', place: 'Campus Oeiras' }, chegada: { time: '12h40', place: 'Campus Alameda' } },
    { partida: { time: '14h40', place: 'Campus Oeiras' }, chegada: { time: '15h40', place: 'Campus Alameda' } },
    { partida: { time: '00h10', place: 'Campus Oeiras' }, chegada: { time: '00h50', place: 'Campus Alameda' } },
  ]
</script>

<style scoped>
.shuttle-table {
  border: 1px solid var(--v-border-color)
}

.shuttle-table :deep(th) {
  color: rgba(var(--v-theme-secondary));
}
</style>
