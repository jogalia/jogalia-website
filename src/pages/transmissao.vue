<template>
  <div class="stream-page">

    <!-- Animated background orbs -->
    <div class="orb orb-1" />
    <div class="orb orb-2" />
    <div class="orb orb-3" />
    <div class="scanlines" />

    <!-- Header -->
    <div class="stream-header">
      <!-- Loading -->
      <div v-if="isLive === null" class="status-badge status-loading">
        <span class="loading-dot" />
        A verificar...
      </div>
      <!-- Online -->
      <div v-else-if="isLive" class="status-badge status-live">
        <span class="live-dot" />
        AO VIVO
      </div>
      <!-- Offline -->
      <div v-else class="status-badge status-offline">
        <span class="offline-dot" />
        OFFLINE
      </div>

      <h1 class="stream-title">Transmissão</h1>
      <p class="stream-subtitle">Canal oficial da Jogália · <span class="channel-name">jogaliaoficial</span></p>
    </div>

    <!-- Player -->
    <div class="player-outer">
      <div class="player-border" :class="{ 'border-live': isLive, 'border-offline': isLive === false }">
        <div class="player-wrap">
          <div id="twitch-embed" class="twitch-player" />
        </div>
      </div>

      <div class="corner corner-tl" />
      <div class="corner corner-tr" />
      <div class="corner corner-bl" />
      <div class="corner corner-br" />
    </div>

    <!-- CTA button -->
    <div class="cta-row">
      <a
        class="twitch-btn"
        href="https://www.twitch.tv/jogaliaoficial"
        rel="noopener noreferrer"
        target="_blank"
      >
        <svg class="twitch-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        </svg>
        Abrir na Twitch
      </a>

      <a
        class="follow-btn"
        href="https://www.twitch.tv/jogaliaoficial"
        rel="noopener noreferrer"
        target="_blank"
      >
        Seguir Canal
      </a>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const isLive = ref<boolean | null>(null)
  const hostname = typeof window === 'undefined' ? 'localhost' : window.location.hostname

  let player: any = null

  onMounted(() => {
    const script = document.createElement('script')
    script.src = 'https://player.twitch.tv/js/embed/v1.js'
    script.addEventListener('load', () => {
      player = new (window as any).Twitch.Player('twitch-embed', {
        channel: 'jogaliaoficial',
        width: '100%',
        height: '100%',
        parent: [hostname],
        autoplay: false,
      })
      player.addEventListener((window as any).Twitch.Player.ONLINE, () => {
        isLive.value = true
      })
      player.addEventListener((window as any).Twitch.Player.OFFLINE, () => {
        isLive.value = false
      })
    })
    document.head.append(script)
  })

  onBeforeUnmount(() => {
    player = null
  })
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────────────────────────── */
.stream-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px 80px;
  overflow: hidden;
  position: relative;
}

/* ── Background orbs ─────────────────────────────────────────────────────────── */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  animation: orb-drift 12s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: rgba(145, 71, 255, 0.12);
  top: -100px;
  left: -150px;
  animation-duration: 14s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(99, 55, 255, 0.10);
  bottom: 0;
  right: -100px;
  animation-duration: 18s;
  animation-delay: -6s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: rgba(220, 38, 38, 0.07);
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  animation-duration: 10s;
  animation-delay: -3s;
}

@keyframes orb-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.05); }
  66%       { transform: translate(-20px, 15px) scale(0.97); }
}

/* subtle scanline texture */
.scanlines {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 0;
}

/* ── Header ──────────────────────────────────────────────────────────────────── */
.stream-header {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 48px 0 32px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.18em;
  margin-bottom: 18px;
}

/* Live */
.status-live {
  background: rgba(220, 38, 38, 0.15);
  border: 1px solid rgba(220, 38, 38, 0.4);
  color: #ef4444;
  animation: badge-pulse 2.5s ease-in-out infinite;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  animation: dot-blink 1.2s ease-in-out infinite;
}

@keyframes dot-blink {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px #ef4444; }
  50%       { opacity: 0.35; box-shadow: none; }
}

@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 0 0 rgba(220, 38, 38, 0); }
  50%       { box-shadow: 0 0 14px rgba(220, 38, 38, 0.2); }
}

/* Offline */
.status-offline {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.35);
}

.offline-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

/* Loading */
.status-loading {
  background: rgba(145, 71, 255, 0.08);
  border: 1px solid rgba(145, 71, 255, 0.25);
  color: rgba(145, 71, 255, 0.7);
}

.loading-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(145, 71, 255, 0.7);
  animation: dot-blink 1s ease-in-out infinite;
}

.stream-title {
  font-size: clamp(32px, 6vw, 64px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0 0 10px;
  text-shadow: 0 0 60px rgba(145, 71, 255, 0.3);
}

.stream-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.38);
  letter-spacing: 0.04em;
  margin: 0;
}

.channel-name {
  color: #9147ff;
  font-weight: 700;
}

/* ── Player ──────────────────────────────────────────────────────────────────── */
.player-outer {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
}

.player-border {
  border-radius: 14px;
  padding: 3px;
  background: linear-gradient(135deg, rgba(145, 71, 255, 0.5), rgba(99, 55, 255, 0.15), rgba(145, 71, 255, 0.5));
  box-shadow: 0 0 40px rgba(145, 71, 255, 0.15), 0 0 80px rgba(145, 71, 255, 0.07);
  transition: background 0.6s, box-shadow 0.6s;
  animation: border-glow 4s ease-in-out infinite;
}

.player-border.border-live {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.7), rgba(145, 71, 255, 0.3), rgba(220, 38, 38, 0.7));
  box-shadow: 0 0 40px rgba(220, 38, 38, 0.25), 0 0 80px rgba(220, 38, 38, 0.1);
  animation: border-glow-live 3s ease-in-out infinite;
}

.player-border.border-offline {
  background: linear-gradient(135deg, rgba(100, 100, 120, 0.3), rgba(60, 60, 80, 0.1), rgba(100, 100, 120, 0.3));
  box-shadow: none;
  animation: none;
}

@keyframes border-glow {
  0%, 100% { box-shadow: 0 0 40px rgba(145, 71, 255, 0.15), 0 0 80px rgba(145, 71, 255, 0.07); }
  50%       { box-shadow: 0 0 60px rgba(145, 71, 255, 0.28), 0 0 120px rgba(145, 71, 255, 0.12); }
}

@keyframes border-glow-live {
  0%, 100% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.25), 0 0 80px rgba(220, 38, 38, 0.1); }
  50%       { box-shadow: 0 0 60px rgba(220, 38, 38, 0.45), 0 0 120px rgba(220, 38, 38, 0.18); }
}

.player-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.twitch-player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* ── Corner decorations ──────────────────────────────────────────────────────── */
.corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: #9147ff;
  border-style: solid;
  opacity: 0.7;
}

.corner-tl { top: -4px;  left: -4px;  border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
.corner-tr { top: -4px;  right: -4px; border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
.corner-bl { bottom: -4px; left: -4px;  border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
.corner-br { bottom: -4px; right: -4px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

/* ── CTA ─────────────────────────────────────────────────────────────────────── */
.cta-row {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.twitch-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: #9147ff;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 13px 28px;
  border-radius: 10px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(145, 71, 255, 0.35);
}

.twitch-btn:hover {
  background: #a855f7;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(145, 71, 255, 0.5);
}

.twitch-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.follow-btn {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 13px 28px;
  border-radius: 10px;
  border: 2px solid rgba(145, 71, 255, 0.45);
  color: rgba(255, 255, 255, 0.75);
  background: rgba(145, 71, 255, 0.08);
  transition: border-color 0.2s, background 0.2s, transform 0.2s, color 0.2s;
}

.follow-btn:hover {
  border-color: #9147ff;
  background: rgba(145, 71, 255, 0.15);
  color: #fff;
  transform: translateY(-2px);
}
</style>
