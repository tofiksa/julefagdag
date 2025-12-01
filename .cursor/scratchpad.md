# Julefagdag Agenda Web Applikasjon - Planlegging

## Background and Motivation

Statens Pensjonskasse (SPK) arrangerer en julefagdag med flere foredrag fordelt på to saler gjennom dagen. Deltakere trenger en mobilvennlig applikasjon som:

1. Viser agenda dynamisk organisert etter gjeldende tid
2. Lar brukere merke foredrag som interessante
3. Sender varsler 10 minutter før favorittforedrag starter
4. Samler inn tilbakemelding per foredrag med tre spørsmål
5. Lagrer tilbakemeldinger i en database

Applikasjonen skal være enkel å bruke på både iOS og Android-enheter og hostes på Vercel med Prisma som database-ORM.

## Key Challenges and Analysis

### Tekniske utfordringer:
1. **Tidsbasert organisering**: Dynamisk sortering av foredrag basert på gjeldende tid
2. **Push-notifikasjoner på mobil**: Web Push API eller PWA notifications
3. **Tverrplattform kompatibilitet**: Fungere på både iOS og Android
4. **Database design**: Struktur for å lagre tilbakemeldinger
5. **State management**: Håndtere favoritter og varsler lokalt eller i database

### Teknologi-valg:
- **Next.js 15+** (App Router): Optimal for Vercel, server-side rendering, API routes, React 19 support
- **TypeScript**: Type safety og bedre utvikleropplevelse
- **Prisma**: Database ORM som støttes godt på Vercel
- **PostgreSQL** (via Vercel Postgres): Relasjonell database for tilbakemeldinger
- **Tailwind CSS**: Mobile-first CSS framework
- **PWA**: Service Worker for offline-funksjonalitet og notifikasjoner
- **React Context/State**: For favoritter og lokal state

### Database schema (foreløpig):
- `Session`: Foredrag/sesjoner (id, title, speaker, room, startTime, endTime, description)
- `Feedback`: Tilbakemeldinger (id, sessionId, useful, learned, explore, createdAt)

## High-level Task Breakdown

### Fase 1: Prosjekt-oppsett og grunnstruktur
- [ ] 1.1: Initialiser Next.js 15 prosjekt med TypeScript
- [ ] 1.2: Konfigurer Tailwind CSS for mobile-first design
- [ ] 1.3: Sett opp Prisma med PostgreSQL (Vercel Postgres)
- [ ] 1.4: Konfigurer GitHub repository og Vercel deployment
- [ ] 1.5: Opprett grunnleggende prosjektstruktur (komponenter, utils, types)

### Fase 2: Data-modell og database
- [ ] 2.1: Design Prisma schema for Session og Feedback
- [ ] 2.2: Opprett seed-data med alle foredrag fra agendaen
- [ ] 2.3: Sett opp Prisma migrations
- [ ] 2.4: Opprett API routes for å hente sesjoner og lagre tilbakemeldinger

### Fase 3: Agenda-visning og dynamisk organisering
- [ ] 3.1: Opprett SessionCard komponent for å vise foredrag
- [ ] 3.2: Implementer tidsbasert sortering (nåværende og kommende)
- [ ] 3.3: Opprett AgendaList komponent med seksjoner (Nå, Kommende, Ferdig)
- [ ] 3.4: Implementer real-time oppdatering av tidsstatus
- [ ] 3.5: Legg til visuell indikator for gjeldende foredrag

### Fase 4: Favoritt-funksjonalitet
- [ ] 4.1: Implementer favoritt-state (localStorage eller database)
- [ ] 4.2: Legg til favoritt-knapp på hver SessionCard
- [ ] 4.3: Opprett "Mine favoritter" visning
- [ ] 4.4: Implementer varsel-logikk (10 minutter før start)

### Fase 5: Notifikasjonssystem
- [ ] 5.1: Sett opp PWA manifest og Service Worker
- [ ] 5.2: Implementer Web Push API eller PWA notifications
- [ ] 5.3: Opprett varsel-komponent som viser rom, tittel og minutter igjen
- [ ] 5.4: Test notifikasjoner på iOS og Android

### Fase 6: Tilbakemeldingssystem
- [ ] 6.1: Opprett FeedbackForm komponent med tre spørsmål
- [ ] 6.2: Implementer emoji-basert input (thumbs up/down)
- [ ] 6.3: Opprett API endpoint for å lagre tilbakemeldinger
- [ ] 6.4: Legg til visuell feedback når tilbakemelding er sendt
- [ ] 6.5: Implementer validering og feilhåndtering

### Fase 7: Mobile-optimalisering og PWA
- [ ] 7.1: Optimaliser layout for små skjermer (< 640px)
- [ ] 7.2: Implementer touch-friendly interaksjoner
- [ ] 7.3: Legg til offline-støtte via Service Worker
- [ ] 7.4: Test på faktiske iOS og Android-enheter
- [ ] 7.5: Optimaliser ytelse og lastetider

### Fase 8: Testing og deploy
- [ ] 8.1: Test alle funksjoner end-to-end
- [ ] 8.2: Verifiser database-operasjoner
- [ ] 8.3: Test notifikasjoner på begge plattformer
- [ ] 8.4: Deploy til Vercel production
- [ ] 8.5: Verifiser at alt fungerer i produksjon

## Project Status Board

| Task ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| 1.1 | Next.js prosjekt setup | pending | - |
| 1.2 | Tailwind CSS konfigurasjon | pending | - |
| 1.3 | Prisma + PostgreSQL setup | pending | - |
| 1.4 | GitHub + Vercel config | pending | - |
| 1.5 | Prosjektstruktur | pending | - |

## Executor's Feedback or Assistance Requests

_Ingen blokkeringer ennå - venter på start av implementering_

## Commit Strategy (Semantic Versioning)

Alle commits skal følge [Conventional Commits](https://www.conventionalcommits.org/) standarden:

### Commit Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Commit Types:
- `feat`: Ny funksjonalitet (tilsvarer MINOR i semver)
- `fix`: Bugfix (tilsvarer PATCH i semver)
- `docs`: Dokumentasjon-endringer
- `style`: Kodeformatering (ingen funksjonell endring)
- `refactor`: Kode-refaktorering (ingen funksjonell endring)
- `test`: Legge til eller endre tester
- `chore`: Byggeverktyg eller dependencies (ingen funksjonell endring)
- `perf`: Ytelsesforbedringer
- `ci`: CI/CD endringer

### Eksempler:
- `feat(agenda): add dynamic time-based session sorting`
- `feat(favorites): implement localStorage-based favorite functionality`
- `fix(notifications): correct 10-minute notification timing`
- `feat(feedback): add emoji-based feedback form component`
- `chore(deps): add Prisma and PostgreSQL dependencies`
- `docs(readme): add setup instructions`

### Versjonering:
- Start med `v0.1.0` (initial setup)
- `feat` commits øker MINOR versjon (0.1.0 → 0.2.0)
- `fix` commits øker PATCH versjon (0.1.0 → 0.1.1)
- Breaking changes øker MAJOR versjon (0.1.0 → 1.0.0)

## Lessons

- Bruk Next.js 15 App Router for beste Vercel-integrasjon og React 19 support
- Next.js 15 har forbedret caching og performance-optimaliseringer
- PWA-notifikasjoner kan være utfordrende på iOS - test tidlig
- LocalStorage for favoritter gir raskere UX enn database-spørsmål
- Vercel Postgres er enkel å sette opp og integrere med Prisma
- Commit hver todo som egen commit med semantic commit message

