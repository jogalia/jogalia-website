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
                        <svg width="22" height="22" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
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