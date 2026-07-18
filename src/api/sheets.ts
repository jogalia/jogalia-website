import Papa from 'papaparse'

const sheetID = '1v66KW-zfdVSDAcrVAbxg7aCRwpmIGlSRxDNw_J-hs58' // GOOGLE SHEETS ID
const sheetsURL = (tab: string) => `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`

const TEAMS_SHEETS_URL = sheetsURL('Equipas')
const TEAM_MEMBERS_SHEETS_URL = sheetsURL('Membros Equipas')

export enum Game {
  CS2 = 'CS2',
  Valorant = 'Valorant',
  RocketLeague = 'RocketLeague',
  LoL = 'LoL',
  FCSports = 'FCSports',
}

export enum TeamRole {
  Jogador = 'Jogador',
  Coach = 'Coach',
}

export interface RosterSlot {
  role: TeamRole
  nick: string
  fullName?: string
}

export type Team = {
  name: string
  roster: RosterSlot[]
  logo?: string
  finalPlace?: number
}

export enum MatchStatus {
  Done = 'Done',
  Happening = 'Happening',
  Waiting = 'Waiting',
}

export type Match = {
  round: string
  group?: string
  team1: string
  team2: string
  score1: number
  score2: number
  status: MatchStatus
  startTime: string
}

interface RawRow {
  [key: string]: any
}

async function fetchSheet (sheet: string) {
  const response = await fetch(sheet, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const text = await response.text()
  return Papa.parse<RawRow>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
}

export async function getTeams () {
  const results = await fetchSheet(TEAMS_SHEETS_URL)

  const teams: Partial<Record<Game, Team[]>> = {}

  for (const t of results.data) {
    const gameKey = t['Jogo'] as Game
    if (!gameKey) {
      continue
    }

    if (!teams[gameKey]) {
      teams[gameKey] = []
    }

    teams[gameKey]!.push({
      name: t['Equipa'],
      roster: [],
      logo: t['LogoURL'],
      finalPlace: t['Lugar Final'],
    })
  }

  return teams
}

export async function getTeamMembers () {
  const teamsRecord = await getTeams()
  const membersResult = await fetchSheet(TEAM_MEMBERS_SHEETS_URL)

  for (const member of membersResult.data) {
    const teamName = member['Equipa']
    if (!teamName) {
      continue
    }

    const gameKey = Object.keys(teamsRecord).find(key =>
      teamsRecord[key as Game]?.some(team => team.name === teamName),
    ) as Game | undefined

    if (gameKey && teamsRecord[gameKey]) {
      const targetTeam = teamsRecord[gameKey]!.find(team => team.name === teamName)

      if (targetTeam) {
        const roleValue = member['Cargo'] === 'Coach' ? TeamRole.Coach : TeamRole.Jogador

        targetTeam.roster.push({
          role: roleValue,
          nick: member['Nickname'] || '???',
          fullName: member['Nome'] || '???',
        })
      }
    }
  }

  return teamsRecord
}

export async function getMatches () {
  const matches: Partial<Record<Game, Match[]>> = {}

  for (const game of Object.values(Game)) {
    const gameMatches = await fetchSheet(sheetsURL(`Jogos | ${game}`))
    if (!matches[game]) {
      matches[game] = []
    }

    for (const m of gameMatches.data) {
      matches[game].push({
        round: m['Ronda'],
        group: m['Grupo'] ?? undefined,
        team1: m['Equipa 1'],
        team2: m['Equipa 2'],
        score1: m['Score Equipa 1'],
        score2: m['Score Equipa 2'],
        status: m['Estado'],
        startTime: m['Horario'],
      })
    }
  }

  return matches
}
