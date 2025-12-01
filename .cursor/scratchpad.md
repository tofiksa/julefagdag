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
- [x] 5.1: Sett opp PWA manifest og Service Worker
- [x] 5.2: Implementer Web Push API eller PWA notifications
- [x] 5.3: Opprett varsel-komponent som viser rom, tittel og minutter igjen
- [ ] 5.4: Test notifikasjoner på iOS og Android

### Fase 6: Tilbakemeldingssystem
- [x] 6.1: Opprett FeedbackForm komponent med tre spørsmål
- [x] 6.2: Implementer emoji-basert input (thumbs up/down)
- [x] 6.3: Opprett API endpoint for å lagre tilbakemeldinger
- [x] 6.4: Legg til visuell feedback når tilbakemelding er sendt
- [x] 6.5: Implementer validering og feilhåndtering

### Fase 7: Mobile-optimalisering og PWA
- [x] 7.1: Optimaliser layout for små skjermer (< 640px)
- [x] 7.2: Implementer touch-friendly interaksjoner
- [x] 7.3: Legg til offline-støtte via Service Worker
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
| 1.1 | Next.js prosjekt setup | completed | Next.js 15.5.6 installert |
| 1.2 | Tailwind CSS konfigurasjon | completed | Konfigurert med create-next-app |
| 1.3 | Prisma + PostgreSQL setup | completed | Schema opprettet, klar for Vercel Postgres |
| 1.4 | GitHub + Vercel config | completed | Vercel.json opprettet, deployment guide laget |
| 1.5 | Prosjektstruktur | completed | Komponenter, hooks, lib opprettet |
| 2.1 | Prisma schema design | completed | Session og Feedback modeller |
| 2.2 | Seed-data | completed | Alle 16 sesjoner fra agenda |
| 2.3 | Prisma migrations | completed | Initial migration opprettet, klar for database |
| 2.4 | API routes | completed | GET /api/sessions og POST /api/feedback |
| 3.1 | SessionCard komponent | completed | Med favoritt og feedback-knapper |
| 3.2 | Tidsbasert sortering | completed | Utils funksjoner implementert |
| 3.3 | AgendaList komponent | completed | Nå/Kommende/Ferdig seksjoner |
| 3.4 | Real-time oppdatering | completed | Oppdaterer hvert minutt |
| 4.1 | Favoritt-state | completed | localStorage-basert |
| 4.2 | Favoritt-knapp | completed | Integrert i SessionCard |
| 6.1 | FeedbackForm komponent | completed | Tre spørsmål med emoji-inputs |
| 6.2 | Emoji-basert input | completed | Thumbs up/down |
| 6.3 | API endpoint feedback | completed | POST /api/feedback |
| 7.1 | Mobile-optimalisering | completed | Alle komponenter optimalisert for <640px skjermer |
| 7.2 | Touch-friendly | completed | Min 44x44px knapper |
| 5.1 | PWA manifest | completed | manifest.json opprettet med ikoner og metadata |
| 5.2 | Service Worker | completed | Service Worker for offline og notifikasjoner |
| 5.3 | Notifikasjonslogikk | completed | useNotifications hook med 10-min varsel |
| 5.4 | Varsel-komponent | completed | NotificationBanner viser kommende favoritter |
| 4.3 | Favoritter-visning | completed | "Mine favoritter" side implementert |
| 4.4 | Varsel-logikk | completed | 10-minutter varsel implementert |
| 6.4 | Visuell feedback | completed | Suksessmelding med smilefjes |
| 6.5 | Validering | completed | Én tilbakemelding per sesjon |

## Executor's Feedback or Assistance Requests

- **Database**: Vercel Postgres må opprettes manuelt i Vercel Dashboard. Se DEPLOYMENT.md for detaljerte instruksjoner. Lokal database er konfigurert og testet ✅
- **PWA og notifikasjoner**: Gjenstående funksjonalitet som trenger testing på faktiske enheter
- **Favoritter-visning**: "Mine favoritter" side implementert ✅
- **Deployment**: Alt er klart for deployment. Følg DEPLOYMENT.md for steg-for-steg guide

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

