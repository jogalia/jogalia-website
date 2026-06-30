<template>
  <div class="teams-page">

    <!-- Edition badge -->
    <div class="edition-badge">JOGÁLIA 2026</div>

    <!-- Game selector -->
    <div class="game-selector">
      <button
        v-for="game in games"
        :key="game.id"
        class="game-card"
        :class="{ active: selectedGame === game.id }"
        :style="{ '--game-color': game.color }"
        @click="selectedGame = game.id"
      >
        <img :src="game.icon" :alt="game.label" class="game-icon" />
        <span class="game-label">{{ game.label }}</span>
      </button>
    </div>

    <!-- Sub-header -->
    <div class="teams-header">
      <div class="header-eyebrow">
        {{ currentGame.label }} · {{ currentTeams.length }} {{ currentGame.id === 'fc' ? 'Atletas' : 'Equipas' }}
      </div>
    </div>

    <!-- EA FC: lista vertical -->
    <div v-if="selectedGame === 'fc'" class="fc-list">
      <div class="fc-header">
        <span class="fc-col-num">#</span>
        <span class="fc-col-nick">Nick</span>
        <span class="fc-col-name">Nome</span>
        <span class="fc-col-coach">Coach</span>
      </div>
      <div
        v-for="(team, i) in currentTeams"
        :key="team.name"
        class="fc-row"
        :class="{ 'fc-row--tbd': !team.roster[0]?.nick }"
      >
        <span class="fc-col-num">{{ i + 1 }}</span>
        <span class="fc-col-nick">{{ team.roster[0]?.nick || 'A confirmar' }}</span>
        <span class="fc-col-name">{{ team.roster[0]?.fullName || '' }}</span>
        <span class="fc-col-coach">
          <template v-if="team.roster[1]?.nick">
            <span class="fc-coach-nick">{{ team.roster[1].nick }}</span>
            <span v-if="team.roster[1].fullName" class="fc-coach-name"> · {{ team.roster[1].fullName }}</span>
          </template>
        </span>
      </div>
    </div>

    <!-- Outros jogos: grid de cards -->
    <div v-else class="teams-grid">
      <div
        v-for="team in currentTeams"
        :key="team.name"
        class="team-card"
      >
        <!-- Front: logo + name -->
        <div class="card-front">
          <div class="team-logo-wrap">
            <img
              v-if="team.logo && !brokenLogos.has(team.name)"
              :src="team.logo"
              :alt="team.name"
              class="team-logo"
              :style="team.logoScale ? { transform: `scale(${team.logoScale})` } : undefined"
              @error="brokenLogos.add(team.name)"
            />
            <div v-else class="team-logo-placeholder">
              <v-icon color="rgba(255,255,255,0.18)" size="38">mdi-shield-outline</v-icon>
            </div>
          </div>
          <div class="team-name">{{ team.name }}</div>
        </div>

        <!-- Overlay: roster (hover) -->
        <div class="card-overlay">
          <div class="overlay-team-name">{{ team.name }}</div>
          <div class="roster-list">
            <template v-for="(slot, i) in team.roster" :key="i">
              <div
                class="roster-row"
                :class="{ 'is-coach': slot.role === 'Coach', 'is-tbd': !slot.nick }"
              >
                <span class="slot-badge">{{ slot.role === 'Coach' ? 'Coach' : 'P' + (i + 1) }}</span>
                <div class="slot-info">
                  <span class="slot-nick">{{ slot.nick || 'A confirmar' }}</span>
                  <span v-if="slot.fullName" class="slot-fullname">{{ slot.fullName }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// ── Types ─────────────────────────────────────────────────────────────────────
interface RosterSlot {
  role:      'Jogador' | 'Coach'
  nick:      string
  fullName?: string
}

interface Team {
  name:       string
  logo?:      string
  logoScale?: number
  roster:     RosterSlot[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const p = (nick: string, fullName?: string): RosterSlot => ({ role: 'Jogador', nick, fullName })
const c = (nick: string, fullName?: string): RosterSlot => ({ role: 'Coach',   nick, fullName })
const tbd = (): RosterSlot => ({ role: 'Jogador', nick: '' })

function makeTbd(name: string, players: number): Team {
  return { name, roster: Array.from({ length: players }, tbd) }
}

// ── CS2 ───────────────────────────────────────────────────────────────────────
const cs2Teams: Team[] = [
  { name: 'Kinetic', logo: 'https://drive.google.com/thumbnail?id=1nPFI5Jq_yJLf4VDXZ6dKtzfWfCQx4kwH&sz=w400', roster: [
    p('GR', 'Guilherme Matos'), p('RX', 'Luis Sá'), p('N0N4m33', 'Duarte Parente'),
    p('BasFerreira', 'Bruno Ferreira'), p('Joka', 'João Bento'), c('Hard3vil', 'Filipe Antunes'),
  ]},
  { name: 'Luso Dragons', logo: 'https://drive.google.com/thumbnail?id=19hYPLDCeoL-ttJYBPT0b4z-9z_-EQJyZ&sz=w400', roster: [
    p('Mané', 'André Silva'), p('tw1sty', 'Jung Su'), p('Fanzyyyy', 'Dinis Vicente'),
    p('Truti', 'Afonso Rodrigues'), p('TiTi', 'Tiago Vaz'), c('F3M0S', 'Francisco Marques'),
  ]},
  { name: 'NãoTroca', logo: 'https://drive.google.com/thumbnail?id=1VaLxANmJ8zAogC8-n8_yfevpSXTCEtOi&sz=w400', roster: [
    p('Bruh', 'Salvador Pedroso'), p('TOTA', 'Tomás Miranda'), p('Flicker', 'Fábio Lourenço'),
    p('Mix', 'Miguel Lopes'), p('Striker', 'Tiago Raquel'),
  ]},
  { name: 'Sussy Squad', logo: 'https://drive.google.com/thumbnail?id=1dPqLBdh37hCUeOIi-DsJ8-o46YIF_Nq9&sz=w400', roster: [
    p('smel', 'Samuel Bravo'), p('rey', 'Francisco Lourinho'), p('Phunil', 'Rafael Lopes'),
    p('LeonardoSDS', 'Leonardo Santos'), p('bolly', 'David Baçao'), c('Avestruz', 'Danilo Paula'),
  ]},
  { name: 'LeoesdaLan', logo: 'https://static.wikia.nocookie.net/cswikia/images/5/59/Csgo_icon_scrimcomp2v2.png/revision/latest?cb=20220207010312', roster: [
    p('androxe', 'André Bolrinhas'), p('draco', 'Vasco Conceição'), p('P1m3nt4', 'Tiago Pimenta'),
    p('Hp', 'Gustavo Graça'), p('ohni', 'Miguel Bento'),
  ]},
  { name: 'Agua de Cevada', logo: 'https://drive.google.com/thumbnail?id=1G-WSb7BRhKnTrJU-hlztnFGWddICdM1N&sz=w400', roster: [
    p('SlyG', 'Gonçalo Silva'), p('Shello-IWNL', 'Marcelo Pinto'), p('Fr0sTQA', 'Tomás Oliveira'),
    p('Kasmy', 'Miguel Brites'), p('Rodrster', 'Rodrigo Oliveira'),
  ]},
  { name: 'ABT', logo: 'https://drive.google.com/thumbnail?id=1l_agQfMqMO9RdawaEWvTzquTetIvr4fm&sz=w400', roster: [
    p('BeiranZz', 'Pedro Santos'), p('thozor', 'António Ramos'), p('ruy2k', 'Rui Araújo'),
    p('blaze', 'Alexandre Alves'), p('hk', 'Diogo Mancilha'),
  ]},
  { name: 'Unaware', logo: 'https://drive.google.com/thumbnail?id=10W06XE4Dj2sVYFtSGP-XsZVV-FoF4vjE&sz=w400', roster: [
    p('V1rT', 'Vitor Belo'), p('zbf', 'Guilherme Coelho'), p('Rocket', 'Tomás Sales'),
    p('mxuga', 'Jose Pronto'), p('silent', 'Nuno Rodrigues'),
  ]},
  { name: 'Reformados Pro', logo: 'https://static.wikia.nocookie.net/cswikia/images/5/59/Csgo_icon_scrimcomp2v2.png/revision/latest?cb=20220207010312', roster: [
    p('MaybeNot', 'Gustavo Kooijman'), p('Martinho2g', 'Joao Martinho'), p('C0dfish', 'Paulo Rosa'),
    p('Fluzz', 'Diogo Formosinho'), p('MikhailXGod', 'Micael Pinto'),
  ]},
  { name: 'Task Bar Heros', logo: 'https://static.wikia.nocookie.net/cswikia/images/5/59/Csgo_icon_scrimcomp2v2.png/revision/latest?cb=20220207010312', roster: [
    p('drn', 'Daniel Cruz'), p('X.13', 'Gonçalo Franco'), p('douradinho5', 'Rodrigo Silva'),
    p('gvpew', 'Gonçalo Padua'), p('Rocaa', 'Rodrigo Martins'),
  ]},
  { name: 'Los Domis', logo: 'https://drive.google.com/thumbnail?id=16N1p6W3rY2KaJv0mJMTEIQxVLbLyvPWV&sz=w400', roster: [
    p('pereirex', 'Pereira'), p('vpx', 'Mota'), p('whose', 'Jorge'),
    p('d4rk tuga', 'Luis'), p('nival', 'Duarte'),
  ]},
  { name: 'Los Mixzados', logo: 'https://drive.google.com/thumbnail?id=1Rohuh8r3qHNtABOl4ThBjoKvxfUGyIDs&sz=w400', roster: [
    p('sykXD', 'Diogo Falcão'), p('B0rdasss', 'Pedro Azevedo'), p('shadow999', 'Diogo Gabriel'),
    p('Ftu', 'Guilherme Duarte'), p('goncoff', 'Gonçalo Fernandes'),
  ]},
  { name: 'Bot M1kael', logo: 'https://static.wikia.nocookie.net/cswikia/images/5/59/Csgo_icon_scrimcomp2v2.png/revision/latest?cb=20220207010312', roster: [
    p('Bllitzx', 'Matheus'), p('santux', 'Fortes'), p('nowhiis', 'Pedro'),
    p('Gancho', 'Gancho'), p('Prime_DevEats', 'Horta'), c('Bot M1kael', 'Nicollas'),
  ]},
  { name: 'NXS', logo: 'https://drive.google.com/thumbnail?id=1btc2bdpovs3UfnHeCk9hAHg1yQ3TO4q0&sz=w400', roster: [
    p('Nexus', 'Rafael Almeida Pires'), p('amnessiia', 'Anton'), p('V4 erbus', 'Francisco Cardoso'),
    p('peoplepapiu', 'Leonardo'), p('IamSombra', 'Caliel'),
  ]},
  { name: 'BeeHOF eSports', logo: 'https://drive.google.com/thumbnail?id=1MCy5Gjc5wc3kodG2CJxl0_u7FI9wC30S&sz=w400', roster: [
    p('Smilejay', 'Rafael Pereira'), p('Genius', 'Miguel Correia'), p('F1fty', 'Diogo Pereira'),
    p('Gaperj', 'Gabriel Pereira'), p('Sml', 'Samuel Monteiro'),
  ]},
  { name: 'MidNight', logo: 'https://drive.google.com/thumbnail?id=1QPNwcEPB4BtCTvQwzT0OGAi8gzOnuY_X&sz=w400', roster: [
    p('Stalkera', 'Carlos Pereira'), p('Yuki', 'Micaela'), p('Locals Only', 'João Carvalhão'),
    p('draken', 'Edgar Nunes'), p('-m4nu', 'Manuel Antunes'),
  ]},
]

// ── LoL ───────────────────────────────────────────────────────────────────────
const lolTeams: Team[] = [
  { name: 'Unstoppable Lions', logo: '/logos/lol/unstoppable-lions.jpg', roster: [
    p('MetroArcher', 'Filipe Dragovic'), p('Wuis', 'Luís Pereira'), p('Semide', 'Tiago Semide'),
    p('RealR', 'Rafael Vilas Boas'), p('D4rtaine', 'David Pires'),
  ]},
  { name: 'Los Patones', logo: 'https://drive.google.com/thumbnail?id=1ZNqgly9r_xGTq4S52c2Js1tmjlMbH6Xc&sz=w400', roster: [
    p('Dezo', 'Afonso Saldanha'), p('O Gajo', 'André Carita'), p('Kingsley', 'Dinis Gonçalves'),
    p('arutnevjr', 'João Leitão'), p('Chaos', 'Álvaro Dória'),
  ]},
  { name: 'Tuern23', logo: '/logos/lol/tuern23.png', roster: [
    p('LouLou', 'Tomás Lourenço'), p('LivroDaFloresta', 'João Basílio'), p('NGapethOfLeague', 'Guilherme Mendes'),
    p('MiguelRamos4', 'Miguel Ramos'), p('Taps', 'Manuel Ferreira'),
  ]},
  { name: 'Vengeance Experts', logo: 'https://drive.google.com/thumbnail?id=1JMY8aaiVVXdv_A2rBOcRNdUA-axTVbi8&sz=w400', roster: [
    p('Maestro', 'Pedro Queirós'), p('WalkOnTheShadows', 'Miguel Alexandre Relvas'), p('agat', 'Lucas Bilotti Nunes'),
    p('Mitocnorte', 'Carlos Emanuel dos Santos'), p('nyxhaze', 'Tiago Bilotti Nunes'), c('GUINDEIRA', 'Artur Guindeira'),
  ]},
  { name: 'FF15', logo: '/logos/lol/ff15.png', roster: [
    p('Henra', 'Henrique'), p('Silence', 'João'), p('tututuru luis', 'Luís'),
    p('kenterr', 'Miguel'), p('Dudinha', 'Duarte'),
  ]},
  { name: 'Amigos do Carros', logo: '/logos/lol/amigos-do-carros.webp', roster: [
    p('Carros', 'Rodrigo Pinto'), p('TiaguuZ', 'Tiago Marques Gonçalves'), p('raisu', 'Ruben Pereira'),
    p('Kiko', 'Rodrigo'), p('NOMA', 'Paulo Rebocho'), c('Ayumi Shinozaki', 'Ana Monteiro'),
  ]},
  { name: 'Low Cortisol Gaming', logo: 'https://images.icon-icons.com/3053/PNG/512/league_of_legends_alt_macos_bigsur_icon_190029.png', roster: [
    p('Luck', 'Afonso Morais'), p('Zeradyn', 'José Oliveira'), p('ALPX', 'Pedro Almeida'),
    p('Moreiraooo', 'Thiago Moreirão'), p('JuniorMafia', 'David'),
  ]},
  { name: 'Wg Furiosos', logo: 'https://drive.google.com/thumbnail?id=1kSjfDb3WsXabwGzk-A-azgUxJWly6obI&sz=w400', roster: [
    p('FIK', 'Tiago Santos'), p('Tobias', 'Tobias Lopes'), p('Ghost', 'Guilherme Mendes'),
    p('Rato', 'Paulo'), p('Albino', 'Andreia Martins'),
  ]},
  { name: 'Os Fazendeiros', logo: '/logos/lol/os-fazendeiros.png', roster: [
    p('Elbozito', 'Guilherme Oliveira'), p('Slayer', 'Guilherme Pedro'), p('Frenzy', 'Ricardo Galvão'),
    p('Shrek', 'João Infante'), p('Babyd4rk', 'David Dias'),
  ]},
  { name: 'KIPU Frost', logo: '/logos/lol/kipu-frost.png', roster: [
    p('aNdy', 'André Silva'), p('Dannix', 'Daniel Jesus'), p('Dans', 'Daniel Lopes'),
    p('Light', 'Tiago Ventura'), p('Ramos', 'Diogo Pereira'),
  ]},
  { name: 'Fila do Microondas', logo: '/logos/lol/fila-do-microondas.jpg', roster: [
    p('Palhau', 'João Palhau'), p('Dayllen', 'Diogo'), p('Chinês', 'Rodrigo Francisco'),
    p('Gui', 'Guilherme'), p('snatso', 'Gonçalo'),
  ]},
  { name: 'Tás na Disney', logo: 'https://drive.google.com/thumbnail?id=1QJeb1QStvgUbSijvVhTL9aN_ngP88lP5&sz=w400', logoScale: 1.1, roster: [
    p('Chimyi', 'Vasco Duarte'), p('Tital', 'Luis Valencia'), p('Djelemental', 'Guilherme Campos'),
    p('DingDIng', 'Filipe Guedes'), p('Shadow', 'Vasco Cecílio'),
  ]},
  { name: 'Demacia Fried Chicken', logo: '/logos/lol/DMC.png', logoScale: 2.3, roster: [
    p('Pew', 'Calinas'), p('Pax', 'Joaquim'), p('Bubazz', 'Diogo'),
    p('Dvn', 'Danilo'), p('SkyZENNN', 'Lucas'),
  ]},
  makeTbd('Equipa 14', 5),
  makeTbd('Equipa 15', 5),
  makeTbd('Equipa 16', 5),
]

// ── Valorant ──────────────────────────────────────────────────────────────────
const valTeams: Team[] = [
  { name: 'DoubleSatchel', logo: 'https://drive.google.com/thumbnail?id=1H9EC_J5JjoMdpdD4NdK7xXrnpcoTfY5x&sz=w400', roster: [
    p('ShadowJ', 'Hugo Santos'), p('gwk', 'Simão Gonçalves'), p('AVZ', 'João Vitor'),
    p('DNS', 'Dinis Biscaia'), p('Mozzy', 'Filipe Aguiar'),
  ]},
  { name: 'ZMAC', logo: 'https://drive.google.com/thumbnail?id=1yH_0oPR2xJn6Y6Wym3sCNxsC237j8MX6&sz=w400', roster: [
    p('kermit', 'Tiago Bandeira'), p('zedly', 'Pedro Galego'), p('ikiru', 'Luca Cerruti'),
    p('neg', 'Miguel Simões'), p('Ensaboado', 'Hugo Adrião'),
  ]},
  { name: 'Fãs do Xini', logo: 'https://drive.google.com/thumbnail?id=1POuWc2qnZNbEKDn4Us6sypFDuxqsid2L&sz=w400', roster: [
    p('Xini', 'Dinis Mestre'), p('H4tee', 'Rodrigo Ribeiro'), p('Silent', 'Martim Oliveira'),
    p('Skypzz', 'Afonso Leitão'), p('Akira', 'Rui Barbosa'),
  ]},
  { name: 'Unaware', logo: 'https://drive.google.com/thumbnail?id=10W06XE4Dj2sVYFtSGP-XsZVV-FoF4vjE&sz=w400', roster: [
    p('V1rT', 'Vitor Belo'), p('zbf', 'Guilherme Coelho'), p('Rocket', 'Tomás Sales'),
    p('mxuga', 'Jose Pronto'), p('silent', 'Nuno Rodrigues'),
  ]},
  { name: 'Onyx Ravens', logo: 'https://drive.google.com/thumbnail?id=1_rgPx3FKu69ZVboiIuAH23nU6gtMIVyq&sz=w400', roster: [
    p('EgoDestroyer67', 'Rodrigo Barbosa'), p('D1go', 'Diogo Luz'), p('Afonso', 'Afonso Almeida'),
    p('UzulMarti', 'André Delgado'), p('Rafa', 'Rafael Batista'),
  ]},
  { name: 'MIMIMI3', logo: 'https://drive.google.com/thumbnail?id=1VwiGKWbWy2n6nRiKO3s4R0FPDmarhMwf&sz=w400', roster: [
    p('kira', 'Samuel Maria'), p('l1ma', 'Miguel Lima'), p('riku', 'Ricardo Cerva'),
    p('aqu3l', 'Bruno Mendes'), p('restart51', 'David Fernandes'),
  ]},
  { name: 'Peaky Again', logo: 'https://drive.google.com/thumbnail?id=1Oa_Qkzno6l0XmJdF2QhSo3vkLxtrHSdv&sz=w400', logoScale: 1.4, roster: [
    p('pigyrr', 'Gonçalo Barbadaes'), p('Bizty', 'Gonçalo Calçadas'), p('bern', 'Bernado Dias'),
    p('Grouqueiro', 'Guilherme Rouqueiro'), p('mike', 'Miguel Silva'),
  ]},
  { name: 'Os GABIRUS', logo: 'https://drive.google.com/thumbnail?id=11Nf04PBZLU4ZGfnko_vREyC1zRuPf3QT&sz=w400', roster: [
    p('Happy', 'Frederico Ribeiro'), p('Natsu', 'Guilherme Pinto'), p('Gerras15', 'Filipe Serras'),
    p('Apollo', 'Miguel Monteiro'), p('GTO', 'Gabriel Monteiro'),
  ]},
  { name: 'The Range', logo: 'https://drive.google.com/thumbnail?id=13VizKJL6OHrBGK3kpHdtKzRvPvNoXuOv&sz=w400', roster: [
    p('Moon', 'Dário Leal'), p('Txger', 'Simão Campanião'), p('Mistery', 'Lucas Rodrigues'),
    p('bisnaga', 'Gabriel Silva'), p('Gui', 'Guilherme Almeida'),
  ]},
  { name: 'RCDM Squad', logo: 'https://drive.google.com/thumbnail?id=1d_GPkvIFWcGxHlh5umqmKK9WZiGiDinF&sz=w400', roster: [
    p('Benfialho', 'Bernardo Fialho'), p('Destroir999', 'Duarte Simões'), p('Kuwana', 'Daniel Ribeiro'),
    p('pucazz', 'Lucas'), p('Bezha', 'Rodrigo Beja'),
  ]},
]

// ── Rocket League ─────────────────────────────────────────────────────────────
const rlTeams: Team[] = [
  { name: 'Seis Sete', logo: 'https://drive.google.com/thumbnail?id=17YTA6LX9Gd-2kmzmJogUV0nFLrv7hxev&sz=w400', roster: [
    p('Visse'), p('Zyra', 'Tomás Silva'), p('Acir'),
  ]},
  { name: 'Wavers', logo: 'https://drive.google.com/thumbnail?id=1lL4-Sb_l2l45j4IE1zIuXMuEkmHxSgAe&sz=w400', roster: [
    p('Drakxy66', 'Duarte Costa'), p('ShadoW_Verd3s', 'Guilherme Alho'), p('ShadoW_Amar3lo', 'Francisco Silva'),
  ]},
  { name: 'Team7', logo: 'https://drive.google.com/thumbnail?id=1aguUY-2GlMVURogKTMMUanz6MVKo1NGR&sz=w400', roster: [
    p('Cena', 'Guilherme Sá'), p('geraldezz', 'Martim Geraldes'), p('Mshow', 'Martim Carvalho'),
    c('jxkez', 'Tomás'),
  ]},
  { name: 'FTW Esports', logo: 'https://drive.google.com/thumbnail?id=19mxAs7oJHy-tmsbZG4-rvz0_mF5FZfyM&sz=w400', roster: [
    p('foahxi', 'João'), p('Talisca', 'Rodrigo'), p('Carrilhow', 'Francisco'),
  ]},
  { name: 'TI IGR', logo: 'https://drive.google.com/thumbnail?id=1U0eGELsu2FiaWtP9xD0LGLCgGN-zI_IU&sz=w400', roster: [
    p('TeuDarling017', 'Luis'), p('FoxComander8927', 'Gabriel'), p('Carlosplay018', 'Carlinhos'),
  ]},
  { name: 'Vengeance Experts', logo: 'https://drive.google.com/thumbnail?id=13SnflBsJ62iKj9S76bUpK4dhZeQgTsUI&sz=w400', roster: [
    p('J0ta', 'João Silva'), p('Kamau', 'Kamau'), p('Sleeptoken', 'Pedro Borges'),
  ]},
  { name: 'R.B.K.', logo: 'https://drive.google.com/thumbnail?id=1J4suAo8ufNrXOqoVUcMFcYHV1Looimh9&sz=w400', roster: [
    p('Goncavultos2', 'Gonçalo'), p('Silence', 'João'), p('Dimichter', 'Duarte'),
    c('L1VRAGH1', 'Francisco'),
  ]},
  { name: 'AAA', logo: 'https://drive.google.com/thumbnail?id=1j6Loowy07PstZJIireGSKbcAZBd6l9CL&sz=w400', roster: [
    p('pipas', 'Filipe'), p('n1sa', 'Guilherme Nisa'), p('impaii', 'Luís Moreira'),
  ]},
  makeTbd('Equipa 9', 3),
  makeTbd('Equipa 10', 3),
]

// ── EA FC ─────────────────────────────────────────────────────────────────────
const fcTeams: Team[] = [
  { name: 'afonsooo',     roster: [p('afonsooo',     'Afonso Pousinho')] },
  { name: 'camuflamanau', roster: [p('camuflamanau', 'Bruno Paulino')] },
  { name: 'GongasFF77',   roster: [p('GongasFF77',   'Gonçalo Fernandes'), c('MrtiagoPt19', 'Tiago Santos')] },
  { name: 'euettip',      roster: [p('euettip',      'Etienne Pitra')] },
  { name: 'martim0099',   roster: [p('martim0099',   'Martim Coelho')] },
  { name: 'bifanas99',    roster: [p('bifanas99',    'Ivo Santos')] },
  { name: 'Zuka12-',      roster: [p('Zuka12-',      'Jeriel Lima')] },
  { name: 'airesbaby18',  roster: [p('airesbaby18',  'Márcio Aires')] },
  makeTbd('Atleta 9',  1),
  makeTbd('Atleta 10', 1),
  makeTbd('Atleta 11', 1),
  makeTbd('Atleta 12', 1),
  makeTbd('Atleta 13', 1),
  makeTbd('Atleta 14', 1),
  makeTbd('Atleta 15', 1),
  makeTbd('Atleta 16', 1),
]

// ── Games ─────────────────────────────────────────────────────────────────────
const games = [
  { id: 'cs2', label: 'CS2',          color: '#F4A723', icon: '/icons/cs2.png' },
  { id: 'lol', label: 'LoL',          color: '#C89B3C', icon: '/icons/lol.png' },
  { id: 'val', label: 'Valorant',     color: '#FF4655', icon: '/icons/val.png' },
  { id: 'rl',  label: 'Rocket Lg.',   color: '#0286F7', icon: '/icons/rl.png'  },
  { id: 'fc',  label: 'EA FC Sports', color: '#00ACED', icon: '/icons/fc.png'  },
]

const teamData: Record<string, Team[]> = { cs2: cs2Teams, lol: lolTeams, val: valTeams, rl: rlTeams, fc: fcTeams }

// ── State ─────────────────────────────────────────────────────────────────────
const selectedGame = ref('lol')
const brokenLogos  = ref(new Set<string>())

const currentGame  = computed(() => games.find(g => g.id === selectedGame.value) ?? games[0])
const currentTeams = computed(() => teamData[selectedGame.value] ?? [])
</script>

<style scoped>
/* ── Page ──────────────────────────────────────────────────────────────────── */
.teams-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  color: #e8eaf0;
  padding-bottom: 80px;
}

/* ── Edition badge ─────────────────────────────────────────────────────────── */
.edition-badge {
  text-align: center;
  padding: 32px 24px 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
}

/* ── Game selector ─────────────────────────────────────────────────────────── */
.game-selector {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px 24px 0;
  flex-wrap: wrap;
}

.game-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 120px;
  height: 88px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.game-card:hover {
  border-color: var(--game-color, rgba(255, 255, 255, 0.3));
  background: rgba(255, 255, 255, 0.07);
}

.game-card.active {
  border-color: var(--game-color);
  background: color-mix(in srgb, var(--game-color) 14%, transparent);
}

.game-icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.game-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  line-height: 1.2;
}

.game-card.active .game-label {
  color: #fff;
}

/* ── Sub-header ────────────────────────────────────────────────────────────── */
.teams-header {
  text-align: center;
  padding: 24px 24px 4px;
}

.header-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
}

/* ── Teams grid ────────────────────────────────────────────────────────────── */
.teams-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 28px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── Team card ─────────────────────────────────────────────────────────────── */
.team-card {
  position: relative;
  width: 190px;
  height: 250px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.team-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.45);
}

/* ── Card front ────────────────────────────────────────────────────────────── */
.card-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px 14px 18px;
  gap: 14px;
  transition: opacity 0.22s, transform 0.22s;
}

.team-card:hover .card-front {
  opacity: 0;
  transform: scale(0.94);
}

.team-logo-wrap {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
}

.team-logo-placeholder {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-name {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.02em;
  line-height: 1.3;
}

/* ── Card overlay ──────────────────────────────────────────────────────────── */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 4, 30, 0.97);
  display: flex;
  flex-direction: column;
  padding: 12px 12px 10px;
  transform: translateY(100%);
  transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}

.team-card:hover .card-overlay {
  transform: translateY(0);
}

.overlay-team-name {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  margin-bottom: 8px;
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Roster ────────────────────────────────────────────────────────────────── */
.roster-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  justify-content: center;
}

.roster-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.roster-row.is-coach {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.slot-badge {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.22);
  padding-top: 2px;
  min-width: 28px;
  flex-shrink: 0;
}

.is-coach .slot-badge {
  color: rgb(var(--v-theme-secondary));
  min-width: 36px;
}

.slot-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.slot-nick {
  font-size: 12px;
  font-weight: 700;
  color: #e8eaf0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.35;
}

.is-tbd .slot-nick {
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
}

.slot-fullname {
  font-size: 9.5px;
  color: rgba(255, 255, 255, 0.38);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

/* ── EA FC list ────────────────────────────────────────────────────────────── */
.fc-list {
  max-width: 860px;
  margin: 28px auto 0;
  padding: 0 24px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  overflow: hidden;
}

.fc-header,
.fc-row {
  display: grid;
  grid-template-columns: 36px 1fr 1fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 52px;
}

.fc-header {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  height: 40px;
}

.fc-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
}

.fc-row:last-child {
  border-bottom: none;
}

.fc-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.fc-col-num {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.2);
  text-align: center;
}

.fc-col-nick {
  font-size: 13px;
  font-weight: 700;
  color: #e8eaf0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-col-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-col-coach {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-coach-nick {
  font-weight: 700;
  color: rgb(var(--v-theme-secondary));
}

.fc-coach-name {
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
}

.fc-row--tbd .fc-col-nick {
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
  font-weight: 400;
}
</style>
