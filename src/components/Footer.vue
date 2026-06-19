<template>
  <footer class="jogalia-footer">
    <div class="footer-glow-bar" />

    <div class="footer-inner">
      <!-- Brand column -->
      <div class="footer-brand">
        <v-img src="@/assets/logo.svg" class="footer-logo" />
        <p class="footer-tagline">
          Esports · Gaming · TCG<br />
          9-12 Julho 2026 · Oeiras
        </p>
        <p class="footer-organizers">
          Organizado por <strong>NexEra</strong> e <strong>LAGE²</strong>
        </p>
      </div>

      <!-- Links column -->
      <div class="footer-col">
        <p class="footer-col-title">Evento</p>
        <a href="/horarios" class="footer-link">Horários</a>
        <a href="/inscricoes" class="footer-link">Incrições</a>
        <a href="/localizacao" class="footer-link">Mapa</a>
        <a href="#tcg" class="footer-link">TCG</a>
        <a href="https://twitch.tv/jogaliaoficial" class="footer-link">Transmissão ao Vivo <v-icon size="12" class="ml-1">mdi-open-in-new</v-icon> </a>
      </div>

      <!-- Info column -->
      <div class="footer-col">
        <p class="footer-col-title">Informações</p>
        <a href="#faq" class="footer-link">FAQ</a>
        <a href="#tickets" class="footer-link">Entradas</a>
        <a href="#venue" class="footer-link">Local</a>
        <a
          href="https://tecnico.ulisboa.pt"
          target="_blank"
          rel="noopener"
          class="footer-link footer-link--external"
        >
          Instituto Superior Técnico
          <v-icon size="12" class="ml-1">mdi-open-in-new</v-icon>
        </a>
        <a href="#press" class="footer-link">Imprensa</a>
      </div>

      <!-- Social column -->
      <div class="footer-col">
        <p class="footer-col-title">Comunidade</p>
        <div class="footer-socials">
          <a
            href="https://discord.gg/G2DhTbtSVD"
            target="_blank"
            rel="noopener"
            class="social-btn social-btn--discord"
            aria-label="Discord"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            <span>Discord</span>
          </a>

          <a
            href="https://instagram.com/jogaliaoficial/"
            target="_blank"
            rel="noopener"
            class="social-btn social-btn--instagram"
            aria-label="Instagram"
          >
            <v-icon size="20">mdi-instagram</v-icon>
            <span>Instagram</span>
          </a>

          <a
            href="https://x.com/jogaliaoficial"
            target="_blank"
            rel="noopener"
            class="social-btn social-btn--x"
            aria-label="X (Twitter)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>X</span>
          </a>

          <a
            href="https://twitch.tv/jogaliaoficial"
            target="_blank"
            rel="noopener"
            class="social-btn social-btn--twitch"
            aria-label="Twitch"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
            </svg>
            <span>Twitch</span>
          </a>

		<!-- <a
            href="https://youtube.com/"
            target="_blank"
            rel="noopener"
            class="social-btn social-btn--youtube"
            aria-label="YouTube"
          >
            <v-icon size="20">mdi-youtube</v-icon>
            <span>YouTube</span>
          </a> -->
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <span class="footer-copy">© 2026 Jogália · NexEra & LAGE² · Todos os direitos reservados</span>
      <div class="footer-bottom-links">
        <a href="#privacy" class="footer-bottom-link">Política de Privacidade</a>
        <span class="footer-dot">·</span>
        <a href="#terms" class="footer-bottom-link">Termos e Condições</a>
        <span class="footer-dot">·</span>
        <a href="#contact" class="footer-bottom-link">Contacto</a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// No props needed - all links are static
</script>

<style scoped>
.jogalia-footer {
  background: #0d0f1a;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #a0a8c0;
  font-family: inherit;
  margin-top: 4rem;
}

/* Neon glow accent bar at the very top of the footer */
.footer-glow-bar {
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #7c3aed 30%, #06b6d4 70%, transparent 100%);
  opacity: 0.8;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 2.5rem;
}

/* Brand */
.footer-logo {
  max-width: 80px;
  margin-bottom: 1rem;
}

.footer-tagline {
  font-size: 0.85rem;
  line-height: 1.7;
  color: #e2e8f0;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.footer-organizers {
  font-size: 0.78rem;
  color: #64748b;
}

.footer-organizers strong {
  color: #94a3b8;
  font-weight: 600;
}

/* Columns */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.footer-col-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7c3aed;
  margin-bottom: 0.4rem;
}

.footer-link {
  font-size: 0.875rem;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.15s ease;
  display: flex;
  align-items: center;
}

.footer-link:hover {
  color: #e2e8f0;
}

.footer-link--external {
  color: #64748b;
  font-size: 0.8rem;
}

.footer-link--external:hover {
  color: #06b6d4;
}

/* Social buttons */
.footer-socials {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.social-btn:hover {
  border-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.social-btn--discord:hover  { background: rgba(88, 101, 242, 0.18); color: #7289da; border-color: rgba(88,101,242,0.3); }
.social-btn--instagram:hover { background: rgba(228, 64, 95, 0.15); color: #e4405f; border-color: rgba(228,64,95,0.3); }
.social-btn--x:hover         { background: rgba(255, 255, 255, 0.08); color: #fff; }
.social-btn--twitch:hover    { background: rgba(145, 70, 255, 0.18); color: #9146ff; border-color: rgba(145,70,255,0.3); }
.social-btn--youtube:hover   { background: rgba(255, 0, 0, 0.15); color: #ff0000; border-color: rgba(255,0,0,0.3); }

/* Bottom bar */
.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-copy {
  font-size: 0.75rem;
  color: #475569;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-bottom-link {
  font-size: 0.75rem;
  color: #475569;
  text-decoration: none;
  transition: color 0.15s;
}

.footer-bottom-link:hover {
  color: #94a3b8;
}

.footer-dot {
  color: #334155;
  font-size: 0.75rem;
}

/* Responsive */
@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 540px) {
  .footer-inner {
    grid-template-columns: 1fr;
    padding: 2rem 1.25rem 1.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.25rem;
  }
}
</style>