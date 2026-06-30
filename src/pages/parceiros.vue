<template>
  <div class="partners-page">

    <div class="edition-badge">JOGÁLIA 2026</div>
    <h1 class="page-title">Parceiros</h1>
    <p class="page-subtitle">As marcas e criadores que tornam este evento ainda melhor</p>

    <!-- Main Sponsors -->
    <section class="partner-section">
      <div class="section-label section-label--gold">Main Sponsors</div>

      <div class="partner-grid">
        <component
          :is="p.url ? 'a' : 'div'"
          v-for="p in mainSponsors"
          :key="p.name"
          class="partner-card card-large"
          :href="p.url"
          :rel="p.url ? 'noopener noreferrer' : undefined"
          :target="p.url ? '_blank' : undefined"
        >
          <div class="logo-wrap" :style="p.logoBg ? { background: p.logoBg, borderRadius: '10px', padding: '10px' } : undefined">
            <img
              v-if="p.logo"
              :alt="p.name"
              class="partner-logo logo-large"
              :src="p.logo"
              :style="p.logoScale ? { transform: `scale(${p.logoScale})` } : undefined"
            >

            <div v-else class="logo-placeholder placeholder-large">{{ p.name[0] }}</div>
          </div>

          <span class="partner-name">{{ p.name }}</span>
        </component>
      </div>
    </section>

    <!-- Media Partners -->
    <section class="partner-section">
      <div class="section-label section-label--cyan">Media Partners</div>

      <div class="partner-grid">
        <component
          :is="p.url ? 'a' : 'div'"
          v-for="p in mediaPartners"
          :key="p.name"
          class="partner-card card-large card-large--cyan"
          :href="p.url"
          :rel="p.url ? 'noopener noreferrer' : undefined"
          :target="p.url ? '_blank' : undefined"
        >
          <div class="logo-wrap" :style="p.logoBg ? { background: p.logoBg, borderRadius: '10px', padding: '10px' } : undefined">
            <img
              v-if="p.logo"
              :alt="p.name"
              class="partner-logo logo-large"
              :src="p.logo"
              :style="p.logoScale ? { transform: `scale(${p.logoScale})` } : undefined"
            >

            <div v-else class="logo-placeholder placeholder-large">{{ p.name[0] }}</div>
          </div>

          <span class="partner-name">{{ p.name }}</span>
        </component>
      </div>
    </section>

    <!-- Marcas -->
    <section class="partner-section">
      <div class="section-label section-label--green">Marcas</div>

      <div class="partner-grid">
        <component
          :is="p.url ? 'a' : 'div'"
          v-for="p in brands"
          :key="p.name"
          class="partner-card card-medium"
          :href="p.url"
          :rel="p.url ? 'noopener noreferrer' : undefined"
          :target="p.url ? '_blank' : undefined"
        >
          <img v-if="p.logo" :alt="p.name" class="partner-logo logo-medium" :src="p.logo">
          <div v-else class="logo-placeholder placeholder-medium">{{ p.name[0] }}</div>
          <span class="partner-name">{{ p.name }}</span>
        </component>
      </div>
    </section>

    <!-- TCGs -->
    <section class="partner-section">
      <div class="section-label section-label--red">TCGs</div>

      <div class="partner-grid">
        <component
          :is="p.url ? 'a' : 'div'"
          v-for="p in tcgs"
          :key="p.name"
          class="partner-card card-tcg"
          :href="p.url"
          :rel="p.url ? 'noopener noreferrer' : undefined"
          :target="p.url ? '_blank' : undefined"
        >
          <img v-if="p.logo" :alt="p.name" class="logo-circle" :src="p.logo">
          <div v-else class="logo-placeholder placeholder-circle">{{ p.name[0] }}</div>
          <span class="partner-name">{{ p.name }}</span>
        </component>
      </div>
    </section>

    <!-- Influencers -->
    <section class="partner-section">
      <div class="section-label section-label--pink">Influencers</div>

      <div class="partner-grid">
        <component
          :is="p.url ? 'a' : 'div'"
          v-for="p in influencers"
          :key="p.name"
          class="partner-card card-photo card-photo--influencer"
          :href="p.url"
          :rel="p.url ? 'noopener noreferrer' : undefined"
          :target="p.url ? '_blank' : undefined"
        >
          <img v-if="p.logo" :alt="p.name" class="photo-img" :src="p.logo">
          <div v-else class="logo-placeholder placeholder-medium">{{ p.name[0] }}</div>
          <span class="photo-name">{{ p.name }}</span>
        </component>
      </div>
    </section>

    <!-- Casters -->
    <section class="partner-section">
      <div class="section-label section-label--blue">Casters</div>

      <div class="partner-grid">
        <component
          :is="p.url ? 'a' : 'div'"
          v-for="p in casters"
          :key="p.name"
          class="partner-card card-photo card-photo--caster"
          :href="p.url"
          :rel="p.url ? 'noopener noreferrer' : undefined"
          :target="p.url ? '_blank' : undefined"
        >
          <img v-if="p.logo" :alt="p.name" class="photo-img" :src="p.logo">
          <div v-else class="logo-placeholder placeholder-medium">{{ p.name[0] }}</div>
          <span class="photo-name">{{ p.name }}</span>
        </component>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
  import acTcgQueijasLogo from '@/assets/img/partners/actcgqueijas.jpg'
  // Influencers
  import cozysafiraLogo from '@/assets/img/partners/cozysafira.png'
  import goncaloRaposaLogo from '@/assets/img/partners/goncaloraposa.jpg'
  import gumzoneLogo from '@/assets/img/partners/gumzone.jpg'
  import obsidianVaultLogo from '@/assets/img/partners/obsidian-vault.jpg'
  import oCardGradingLogo from '@/assets/img/partners/ocg.jpeg'
  import oGuitchoLogo from '@/assets/img/partners/oguitcho.jpg'
  // Casters
  import ruizinhoLogo from '@/assets/img/partners/ruizinho.png'
  import soflopes5Logo from '@/assets/img/partners/soflopes.png'
  // TCGs
  import velezjoaobreaksLogo from '@/assets/img/partners/velezjoaobreaks.jpg'
  import visseLogo from '@/assets/img/partners/visse.png'

  interface Partner {
    name: string
    logo?: string
    url?: string
    logoScale?: number
    logoBg?: string
  }

  // ── Media Partners ────────────────────────────────────────────────────────────
  const mediaPartners: Partner[] = [
    { name: 'RTP Arena', logo: 'https://media.rtp.pt/empresa/wp-content/uploads/sites/31/2019/04/Institutional_RTPArena_Vertical_PositivoCor_web-1.png', url: 'https://arena.rtp.pt/', logoBg: '#ffffff' },
  ]

  // ── Main Sponsors ─────────────────────────────────────────────────────────────
  const mainSponsors: Partner[] = [
    { name: 'HyperX', logo: 'https://images.seeklogo.com/logo-png/42/2/hyperx-logo-png_seeklogo-425410.png', url: 'https://hyperx.com', logoScale: 1.5 },
    { name: 'EXSAD', logo: 'https://exsadgaming.pt/wp-content/uploads/2024/03/Ativo-8-1.png', url: 'https://exsadgaming.pt' },
    { name: 'Templars Arena', logo: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/6842070f22a45a72e30f6f8a/0x0.png', url: 'https://www.instagram.com/templarsarena/' },
  ]

  // ── Marcas ────────────────────────────────────────────────────────────────────
  const brands: Partner[] = [
    { name: 'Robot Extreme', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNRKKTNhyIHOhhnTGMiGuWywSVr4-8Y6-SXA&s' },
  ]

  // ── TCGs ──────────────────────────────────────────────────────────────────────
  const tcgs: Partner[] = [
    { name: 'VELEZJOAOBREAKS', logo: velezjoaobreaksLogo, url: 'https://www.instagram.com/velezjoaobreaks/' },
    { name: 'Obsidian Vault', logo: obsidianVaultLogo, url: 'https://www.instagram.com/obsidianvaultpt/' },
    { name: 'O Card Grading', logo: oCardGradingLogo, url: 'https://www.instagram.com/ocg_pt/' },
    { name: 'AC TCG QUEIJAS', logo: acTcgQueijasLogo, url: 'https://www.instagram.com/ac_tcg_loja/' },
  ]

  // ── Influencers ───────────────────────────────────────────────────────────────
  const influencers: Partner[] = [
    { name: 'cozysafira', logo: cozysafiraLogo, url: 'https://www.instagram.com/cozysafira/' },
    { name: 'Gumzone', logo: gumzoneLogo, url: 'https://www.instagram.com/gumzone__/' },
    { name: 'Gonçalo Raposa', logo: goncaloRaposaLogo, url: 'https://www.instagram.com/goncaloraposa/' },
    { name: 'soflopes5', logo: soflopes5Logo, url: 'https://www.instagram.com/soflopes5/' },
    { name: 'Visse', logo: visseLogo, url: 'https://www.instagram.com/visse04/' },
  ]

  // ── Casters ───────────────────────────────────────────────────────────────────
  const casters: Partner[] = [
    { name: 'Ruizinho', logo: ruizinhoLogo },
    { name: 'Dred' }, // Left as-is since no path was provided
    { name: 'oGuitcho', logo: oGuitchoLogo },
  ]
</script>

<style scoped>
.partners-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  color: #e8eaf0;
  padding-bottom: 100px;
}

/* ── Header ─────────────────────────────────────────────────────────────────── */
.edition-badge {
  text-align: center;
  padding: 32px 24px 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
}

.page-title {
  text-align: center;
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 900;
  letter-spacing: -0.01em;
  color: #fff;
  margin: 12px 0 8px;
}

.page-subtitle {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.38);
  margin: 0 0 56px;
  letter-spacing: 0.02em;
}

/* ── Section ─────────────────────────────────────────────────────────────────── */
.partner-section {
  max-width: 1200px;
  margin: 0 auto 64px;
  padding: 0 32px;
}

.section-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.section-label--gold {
  color: rgba(244, 167, 35, 0.6);
  border-bottom-color: rgba(244, 167, 35, 0.2);
}

.section-label--cyan {
  color: rgba(34, 211, 238, 0.7);
  border-bottom-color: rgba(34, 211, 238, 0.2);
}

.section-label--green {
  color: rgba(74, 222, 128, 0.7);
  border-bottom-color: rgba(74, 222, 128, 0.2);
}

.section-label--red {
  color: rgba(251, 113, 133, 0.7);
  border-bottom-color: rgba(251, 113, 133, 0.2);
}

.section-label--pink {
  color: rgba(232, 121, 249, 0.7);
  border-bottom-color: rgba(232, 121, 249, 0.2);
}

.section-label--blue {
  color: rgba(99, 179, 237, 0.7);
  border-bottom-color: rgba(99, 179, 237, 0.2);
}

/* ── Grid ────────────────────────────────────────────────────────────────────── */
.partner-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

/* ── Cards ───────────────────────────────────────────────────────────────────── */
.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.03);
  text-decoration: none;
  transition: border-color 0.22s, background 0.22s, transform 0.22s, box-shadow 0.22s;
  cursor: pointer;
}

.partner-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.partner-card:hover .partner-logo {
  filter: brightness(1.12);
}

.card-large {
  width: 260px;
  height: 210px;
  padding: 24px 20px 18px;
  justify-content: space-between;
  border-color: rgba(244, 167, 35, 0.25);
  background: rgba(244, 167, 35, 0.04);
  box-shadow:
      0 0 18px rgba(244, 167, 35, 0.12),
      0 0 40px rgba(244, 167, 35, 0.06),
      inset 0 0 24px rgba(244, 167, 35, 0.04);
  animation: sponsor-pulse 3s ease-in-out infinite;
}

.card-large:hover {
  border-color: rgba(244, 167, 35, 0.65) !important;
  background: rgba(244, 167, 35, 0.09) !important;
  box-shadow:
      0 0 32px rgba(244, 167, 35, 0.35),
      0 0 70px rgba(244, 167, 35, 0.18),
      inset 0 0 30px rgba(244, 167, 35, 0.08) !important;
  transform: translateY(-5px) !important;
}

.card-large .partner-name {
  color: rgba(244, 167, 35, 0.7);
}

.card-large--cyan {
  border-color: rgba(34, 211, 238, 0.15);
  background: rgba(34, 211, 238, 0.03);
  box-shadow:
      0 0 12px rgba(34, 211, 238, 0.07),
      0 0 24px rgba(34, 211, 238, 0.04),
      inset 0 0 16px rgba(34, 211, 238, 0.02);
  animation: media-pulse 3s ease-in-out infinite;
}

.card-large--cyan:hover {
  border-color: rgba(34, 211, 238, 0.4) !important;
  background: rgba(34, 211, 238, 0.06) !important;
  box-shadow:
      0 0 20px rgba(34, 211, 238, 0.18),
      0 0 45px rgba(34, 211, 238, 0.09),
      inset 0 0 20px rgba(34, 211, 238, 0.05) !important;
  transform: translateY(-5px) !important;
}

.card-large--cyan .partner-name {
  color: rgba(34, 211, 238, 0.7);
}

@keyframes media-pulse {
  0%, 100% {
    box-shadow:
        0 0 12px rgba(34, 211, 238, 0.07),
        0 0 24px rgba(34, 211, 238, 0.04),
        inset 0 0 16px rgba(34, 211, 238, 0.02);
  }
  50% {
    box-shadow:
        0 0 18px rgba(34, 211, 238, 0.12),
        0 0 36px rgba(34, 211, 238, 0.06),
        inset 0 0 20px rgba(34, 211, 238, 0.04);
  }
}

.card-large:hover .partner-logo {
  filter: brightness(1.2) drop-shadow(0 0 8px rgba(244, 167, 35, 0.5)) !important;
}

.card-medium {
  width: 170px;
  height: 160px;
  padding: 20px 16px 16px;
  justify-content: space-between;
}

/* ── Influencer photo cards ───────────────────────────────────────────────────── */
.card-photo {
  position: relative;
  width: 150px;
  height: 150px;
  padding: 0;
  overflow: hidden;
  justify-content: flex-end;
  gap: 0;
}

.photo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s, filter 0.25s;
}

.card-photo:hover .photo-img {
  transform: scale(1.06);
  filter: brightness(1.05);
}

.card-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.15) 55%, transparent 100%);
  pointer-events: none;
}

.photo-name {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 10px 10px 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.85), 0 0 14px rgba(0, 0, 0, 0.6);
}

@keyframes sponsor-pulse {
  0%, 100% {
    box-shadow:
        0 0 18px rgba(244, 167, 35, 0.12),
        0 0 40px rgba(244, 167, 35, 0.06),
        inset 0 0 24px rgba(244, 167, 35, 0.04);
  }
  50% {
    box-shadow:
        0 0 26px rgba(244, 167, 35, 0.22),
        0 0 55px rgba(244, 167, 35, 0.10),
        inset 0 0 30px rgba(244, 167, 35, 0.07);
  }
}

/* ── Logos ───────────────────────────────────────────────────────────────────── */
.partner-logo {
  object-fit: contain;
  transition: filter 0.22s;
}

.logo-wrap { display: flex; align-items: center; justify-content: center; }
.logo-large  { max-width: 200px; max-height: 130px; }
.logo-medium { max-width: 140px; max-height: 90px; }

.logo-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  transition: filter 0.22s, transform 0.22s;
}

.card-tcg:hover .logo-circle {
  filter: brightness(1.12);
  transform: scale(1.06);
}

.card-tcg {
  width: 170px;
  height: 170px;
  padding: 20px 16px 16px;
  justify-content: space-between;
}

.placeholder-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 32px;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.35);
}

/* ── Placeholder (sem brand) ──────────────────────────────────────────────────── */
.logo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 900;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.placeholder-large  { width: 72px; height: 72px; font-size: 28px; }
.placeholder-medium { width: 52px; height: 52px; font-size: 20px; }

/* ── Partner name ────────────────────────────────────────────────────────────── */
.partner-name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 1.3;
}
</style>
