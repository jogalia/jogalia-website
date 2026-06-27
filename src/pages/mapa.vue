<template>
  <div class="map-page">

    <!-- Filtros -->
    <div class="filter-row">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-btn"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Zonas -->
    <div class="zone-grid">
      <div
        v-for="zone in visibleZones"
        :key="zone.id"
        class="zone-card"
        :class="{ active: activeZone === zone.id }"
        @click="toggleZone(zone.id)"
      >
        <div class="zone-symbol" :class="zone.symbolClass">{{ zone.id }}</div>
        <div>
          <div class="zone-name">{{ zone.name }}</div>
          <div class="zone-location">{{ zone.location }}</div>
          <div class="zone-tag" :class="zone.tagClass">{{ zone.filterLabel }}</div>
        </div>
      </div>
    </div>

    <!-- mapa interativo -->
    <p class="section-label mt-6">Mapa interativo — toca numa zona</p>
    <div class="map-wrapper" ref="mapWrapper" @click.self="clearZone">
      <img
        src="@/assets/map.jpeg"
        alt="Planta do recinto Jogália 2026"
        class="map-img"
      />

      <!-- SVG hotspot overlay - viewBox e image size (905×622) -->
      <svg
        class="map-svg"
        viewBox="0 0 905 622"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          v-for="spot in hotspots"
          :key="spot.zone + spot.x"
          class="zone-hit"
          :class="{ active: activeZone === spot.zone }"
          :x="spot.x" :y="spot.y"
          :width="spot.w" :height="spot.h"
          :rx="spot.rx || 6"
          @click.stop="toggleZone(spot.zone)"
          @mouseenter="showTooltip(spot, $event)"
          @mouseleave="hideTooltip"
        />
      </svg>

      <!-- tooltip | quando passas o rato por cima de uma zona -->
      <div
        v-if="tooltip.visible"
        class="map-tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        {{ tooltip.zone }} · {{ tooltip.name }}
      </div>
    </div>

    <!-- Legenda -->
    <div class="legend">
      <div v-for="l in legend" :key="l.label" class="legend-item">
        <div class="legend-dot" :style="{ background: l.color }" />
        <span>{{ l.label }}</span>
      </div>
    </div>

    <!-- Tlm quick-nav (fixa bottom) -->
    <div class="quick-nav">
      <button
        v-for="zone in zones"
        :key="zone.id"
        class="qn-btn"
        :class="{ active: activeZone === zone.id }"
        @click="onQuickNav(zone.id)"
      >
        {{ zone.id }} · {{ zone.shortName }}
      </button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

// Types
interface Zone {
  id: string
  name: string
  shortName: string
  location: string
  filterLabel: string
  cat: string
  symbolClass: string
  tagClass: string
}

interface Hotspot {
  zone: string
  x: number
  y: number
  w: number
  h: number
  rx?: number
}

// ── Data ────────────────────────────────────────────────────────────────────
const zones: Zone[] = [
  { id: 'A', name: 'Palco Central',       shortName: 'Palco',    location: 'Átrio Central',            filterLabel: 'Palco & Empresas', cat: 'main',   symbolClass: 'cat-main',   tagClass: 'tag-main'   },
  { id: 'B', name: 'Bancas de Empresas',  shortName: 'Empresas', location: 'Átrio Central',            filterLabel: 'Palco & Empresas', cat: 'main',   symbolClass: 'cat-main',   tagClass: 'tag-main'   },
  { id: 'C', name: 'Casting Booth',       shortName: 'Casting',  location: 'Sala 0-65',                filterLabel: 'Gaming',           cat: 'gaming', symbolClass: 'cat-gaming', tagClass: 'tag-gaming' },
  { id: 'D', name: 'Arenas',              shortName: 'Arenas',   location: 'Sala 0-65',                filterLabel: 'Gaming',           cat: 'gaming', symbolClass: 'cat-gaming', tagClass: 'tag-gaming' },
  { id: 'E', name: 'Simuladores',         shortName: 'Sims',     location: 'Sala 0-49',                filterLabel: 'Gaming',           cat: 'gaming', symbolClass: 'cat-gaming', tagClass: 'tag-gaming' },
  { id: 'F', name: 'Bancas TCG',          shortName: 'TCG',      location: 'Átrio Norte',              filterLabel: 'TCG',              cat: 'tcg',    symbolClass: 'cat-tcg',    tagClass: 'tag-tcg'    },
  { id: 'G', name: 'Torneios TCG',        shortName: 'Torneios', location: 'Salas 0-13 / 0-15 / 0-17', filterLabel: 'TCG',             cat: 'tcg',    symbolClass: 'cat-tcg',    tagClass: 'tag-tcg'    },
  { id: 'H', name: 'Auditório 5',         shortName: 'Auditório',location: 'Auditório principal',      filterLabel: 'Auditório',        cat: 'venue',  symbolClass: 'cat-venue',  tagClass: 'tag-venue'  },
  { id: '1', name: 'Zona de Restauração', shortName: 'Comida',   location: 'Área de alimentação',      filterLabel: 'Restauração',      cat: 'food',   symbolClass: 'cat-food',   tagClass: 'tag-food'   },
  { id: '2', name: 'Sala de Refeições',   shortName: 'Refeições',location: 'Área de refeições',        filterLabel: 'Restauração',      cat: 'food',   symbolClass: 'cat-food',   tagClass: 'tag-food'   },
]

// SVG hotspots - coordenadas para 905×622 viewBox
const hotspots: Hotspot[] = [
  { zone: 'A', x: 195, y: 230, w: 130, h: 110 },
  { zone: 'B', x: 290, y: 265, w:  80, h:  75 },
  { zone: 'C', x: 200, y: 370, w: 115, h:  75 },
  { zone: 'D', x: 228, y: 315, w: 110, h:  60 },
  { zone: 'E', x: 348, y: 298, w:  42, h:  50 },
  { zone: 'F', x: 598, y: 138, w: 105, h:  85 },
  { zone: 'G', x: 580, y: 242, w: 105, h:  72 },
  { zone: 'H', x: 474, y:  82, w:  72, h:  55 },
  { zone: '1', x:  28, y: 375, w:  72, h:  80 },
  { zone: '1', x: 700, y: 148, w:  82, h:  80 },
  { zone: '2', x: 393, y: 255, w:  68, h:  68 },
]

const filters = [
  { value: 'all',    label: 'Tudo' },
  { value: 'main',   label: 'Palco & Empresas' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'tcg',    label: 'TCG' },
  { value: 'venue',  label: 'Auditório' },
  { value: 'food',   label: 'Restauração' },
]

const legend = [
  { label: 'Palco & Empresas (A, B)', color: '#0686F3' },
  { label: 'Gaming (C, D, E)',        color: '#FA6600' },
  { label: 'TCG (F, G)',              color: '#00DDFE' },
  { label: 'Auditório (H)',           color: '#FFB404' },
  { label: 'Restauração (1, 2)',      color: 'rgba(0,221,254,.4)' },
]

// configs estados
const activeFilter = ref('all')
const activeZone   = ref<string | null>(null)
const mapWrapper   = ref<HTMLElement | null>(null)

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  zone: '',
  name: '',
})

const visibleZones = computed(() =>
  activeFilter.value === 'all'
    ? zones
    : zones.filter(z => z.cat === activeFilter.value)
)

// helpers
function toggleZone(id: string) {
  activeZone.value = activeZone.value === id ? null : id
  if (activeZone.value === null) tooltip.value.visible = false
}

function clearZone() {
  activeZone.value = null
  tooltip.value.visible = false
}

function showTooltip(spot: Hotspot, event: MouseEvent) {
  const wrapper = mapWrapper.value
  if (!wrapper) return

  // The SVG scales with the image — compute where the spot centre is in wrapper-local px
  const svg = (event.target as SVGElement).ownerSVGElement!
  const svgRect = svg.getBoundingClientRect()
  const wRect   = wrapper.getBoundingClientRect()

  const scaleX = svgRect.width  / 905
  const scaleY = svgRect.height / 622

  const cx = (spot.x + spot.w / 2) * scaleX + (svgRect.left - wRect.left)
  const cy =  spot.y               * scaleY  + (svgRect.top  - wRect.top)

  const zone = zones.find(z => z.id === spot.zone)

  tooltip.value = {
    visible: true,
    x: cx,
    y: cy,
    zone: spot.zone,
    name: zone?.name ?? '',
  }
}

function hideTooltip() {
  if (activeZone.value === null) tooltip.value.visible = false
}

function onQuickNav(id: string) {
  toggleZone(id)
  mapWrapper.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
/* vuetify.ts | tenho de pesquisar como importantar para aqui o css, nao faz sentido ter as cenas duplicadas */
.map-page {
  --azure-blue:      #0686F3;
  --vivid-orange:    #FA6600;
  --neon-blue:       #00DDFE;
  --imperial-yellow: #FFB404;
  --midnight-blue:   #00072B;
  --surface-dim:     rgba(255, 255, 255, 0.06);
  --surface-mid:     rgba(255, 255, 255, 0.10);
  --border:          rgba(0, 221, 254, 0.18);
  --text-primary:    #ffffff;
  --text-muted:      rgba(255, 255, 255, 0.55);

  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 100px;
  font-family: 'Space Grotesk', sans-serif;
}

.section-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--neon-blue);
  text-transform: uppercase;
  margin-bottom: 12px;
}

/* Filros */
.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-btn {
  background: var(--surface-dim);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--neon-blue);
  color: var(--neon-blue);
}

.filter-btn.active {
  background: var(--neon-blue);
  border-color: var(--neon-blue);
  color: var(--midnight-blue);
  font-weight: 700;
}

/* Zonas */
.zone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  margin-bottom: 8px;
}

.zone-card {
  background: var(--surface-dim);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, background 0.15s;
}

.zone-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 221, 254, 0.4);
  background: var(--surface-mid);
}

.zone-card.active {
  border-color: var(--imperial-yellow);
  background: rgba(255, 180, 4, 0.07);
  box-shadow: 0 0 0 1px rgba(255, 180, 4, 0.2);
}

.zone-symbol {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Mono', monospace;
  font-size: 17px;
  font-weight: 700;
  flex-shrink: 0;
}

.cat-main   { background: rgba(6,  134, 243, 0.18); color: var(--azure-blue);      }
.cat-gaming { background: rgba(250, 102,   0, 0.18); color: var(--vivid-orange);   }
.cat-tcg    { background: rgba(3,    3, 127, 0.40);  color: var(--neon-blue);      }
.cat-venue  { background: rgba(255, 180,   4, 0.15); color: var(--imperial-yellow);}
.cat-food   { background: rgba(0,  221, 254, 0.12);  color: var(--neon-blue);      }

.zone-name     { font-size: 14px; font-weight: 700; margin-bottom: 3px; color: var(--text-primary); }
.zone-location { font-size: 11px; color: var(--text-muted); }

.zone-tag {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 4px;
  margin-top: 6px;
  display: inline-block;
  text-transform: uppercase;
}

.tag-main   { background: rgba(6,  134, 243, 0.15); color: var(--azure-blue);       }
.tag-gaming { background: rgba(250, 102,   0, 0.15); color: var(--vivid-orange);    }
.tag-tcg    { background: rgba(0,  221, 254, 0.12);  color: var(--neon-blue);       }
.tag-venue  { background: rgba(255, 180,   4, 0.12); color: var(--imperial-yellow); }
.tag-food   { background: rgba(0,  221, 254, 0.10);  color: var(--neon-blue);       }

/* Mapa */
.map-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #111;
  line-height: 0;
}

.map-img {
  width: 100%;
  height: auto;
  display: block;
  opacity: 0.92;
}

.map-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.zone-hit {
  pointer-events: all;
  cursor: pointer;
  fill: transparent;
  stroke: transparent;
  transition: fill 0.18s, stroke 0.18s;
}

.zone-hit:hover {
  fill: rgba(0, 221, 254, 0.15);
  stroke: var(--neon-blue);
  stroke-width: 2;
}

.zone-hit.active {
  fill: rgba(255, 180, 4, 0.22);
  stroke: var(--imperial-yellow);
  stroke-width: 2.5;
}

/* Tooltip */
.map-tooltip {
  position: absolute;
  background: rgba(0, 7, 43, 0.92);
  border: 1px solid var(--imperial-yellow);
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  pointer-events: none;
  white-space: nowrap;
  transform: translate(-50%, calc(-100% - 8px));
  backdrop-filter: blur(8px);
  z-index: 10;
}

/* Legenda */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  flex-shrink: 0;
}

/* Mobile quick-nav */
.quick-nav {
  display: none;
}

@media (max-width: 600px) {
  .quick-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 7, 43, 0.95);
    border-top: 1px solid var(--border);
    backdrop-filter: blur(16px);
    padding: 8px 12px 18px;
    gap: 6px;
    z-index: 200;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .quick-nav::-webkit-scrollbar { display: none; }

  .qn-btn {
    background: var(--surface-dim);
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    padding: 5px 11px;
    border-radius: 999px;
    white-space: nowrap;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .qn-btn.active {
    background: var(--imperial-yellow);
    border-color: var(--imperial-yellow);
    color: var(--midnight-blue);
  }
}

@media (max-width: 480px) {
  .zone-grid { grid-template-columns: 1fr; }
}

.mt-6 { margin-top: 1.5rem; }
</style>