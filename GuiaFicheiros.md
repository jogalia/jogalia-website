# Guia de Preenchimento - teams.xlsx e matches.xlsx

Cada jogo tem a sua própria pasta (ex: `cs2/`, `lol/`, `val/`, `rl/`, `fc/`) com dois ficheiros Excel dentro: `teams.xlsx` e `matches.xlsx`.

---

## teams.xlsx

Regista as equipas participantes. Cada linha é uma equipa.

| Coluna | Descrição |
|--------|-----------|
| `seed` | Número único da equipa (ex: 1, 2, 3...). Não pode repetir. |
| `name` | Nome da equipa (ex: "unaware", "Team Liquid"). |

### Exemplo

| seed | name |
|------|------|
| 1 | unaware |
| 2 | Team Alpha |
| 3 | Los Pollos |
| 4 | Noname FC |

> O logo da equipa deve ser colocado em `/logos/` com o nome em lowercase, espaços e caracteres especiais substituídos por `-`, e extensão `.png`.
> Exemplo: `"Team Alpha"` → `/logos/team-alpha.png`

---

## matches.xlsx

Regista todos os jogos do torneio. Cada linha é um jogo.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `match_id` | Número | ID único do jogo. Não pode repetir. |
| `round` | Número | Fase do torneio (ver tabela abaixo). |
| `group` | Letra | Grupo do jogo (`A`, `B`, `C`, `D`). **Deixar vazio nas semis e final.** |
| `team1_seed` | Número | Seed da equipa 1 (tem de existir no teams.xlsx). |
| `team2_seed` | Número | Seed da equipa 2 (tem de existir no teams.xlsx). |
| `score1` | Número | Pontuação da equipa 1. Deixar vazio se o jogo ainda não aconteceu. |
| `score2` | Número | Pontuação da equipa 2. Deixar vazio se o jogo ainda não aconteceu. |
| `status` | Texto | `pending` = por jogar · `done` = concluído. |
| `start_time` | Texto | Hora prevista do jogo (ex: `09 jul. 14:00`). Opcional. |
| `live` | Número | `0` = não está a decorrer · `1` = está LIVE agora. |

---

### Valores de `round` por jogo

#### CS2 · LoL · Rocket League _(16 equipas, 4 grupos de 4)_

| round | Fase |
|-------|------|
| `1` | Fase de grupos (preencher `group` com A, B, C ou D) |
| `2` | Meias-finais (BO3) |
| `3` | Final (BO3 / BO5 no RL) |

#### Valorant _(10 equipas, 2 grupos de 5)_

| round | Fase |
|-------|------|
| `1` | Fase de grupos (preencher `group` com A ou B) |
| `2` | Meias-finais (BO1) |
| `3` | 3.º lugar (BO3) |
| `4` | Final (BO3) |

#### EA FC _(liga todos contra todos)_

| round | Fase |
|-------|------|
| `1` | Todos os jogos da liga |

---

### Exemplo - Fase de grupos (CS2)

| match_id | round | group | team1_seed | team2_seed | score1 | score2 | status | start_time | live |
|----------|-------|-------|------------|------------|--------|--------|--------|------------|------|
| 1 | 1 | A | 1 | 2 | 16 | 4 | done | 09 jul. 14:00 | 0 |
| 2 | 1 | A | 1 | 3 | | | pending | 09 jul. 15:00 | 0 |
| 3 | 1 | A | 1 | 2 | 8 | 12 | done | 09 jul. 15:00 | 1 |

> Na linha 3, `live = 1` significa que o jogo aparece como **LIVE** na aplicação.

### Exemplo - Final (CS2)

| match_id | round | group | team1_seed | team2_seed | score1 | score2 | status | start_time | live |
|----------|-------|-------|------------|------------|--------|--------|--------|------------|------|
| 27 | 3 | | 1 | 13 | 2 | 0 | done | 09 jul. 22:30 | 0 |

> O campo `group` fica **vazio** nas semis e final.

---

## Notas importantes

- O ficheiro é atualizado automaticamente pela aplicação a cada **10 segundos** - basta guardar o Excel que os resultados aparecem no ecrã.
- Para marcar um jogo como **LIVE**, colocar `1` na coluna `live` e guardar. Para terminar, voltar a `0`.
- Só pode haver **um jogo LIVE de cada vez** por jogo (cs2, lol, etc.).
- Os scores só aparecem na aplicação quando `status = done` ou `live = 1`.
- O vencedor de cada grupo é calculado automaticamente pela aplicação com base nos resultados - não é preciso preencher nada extra.