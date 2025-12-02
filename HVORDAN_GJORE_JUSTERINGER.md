# Hvordan gjøre justeringer i programmet

Denne guiden forklarer hvor du finner ulike deler av applikasjonen og hvordan du gjør vanlige justeringer.

**Rask start**: Vil du endre tidspunkter, romnavn eller foredragsholdere? Se [seksjonen om å endre foredrag](#-endre-tidspunkter-romnavn-eller-foredragsholdere) nedenfor.

## 📁 Prosjektstruktur

```
Julefagdag/
├── app/                    # Next.js App Router sider og API routes
│   ├── page.tsx           # Hovedside (agenda-visning)
│   ├── favorites/         # Favoritter-side
│   └── api/               # Backend API endpoints
│       ├── sessions/      # Hent alle sesjoner
│       └── feedback/      # Lagre tilbakemeldinger
├── components/            # React-komponenter
│   ├── SessionCard.tsx    # Visning av et enkelt foredrag
│   ├── AgendaList.tsx     # Liste med alle foredrag (Nå/Kommende/Ferdig)
│   ├── FeedbackForm.tsx   # Skjema for tilbakemelding
│   └── NotificationBanner.tsx  # Varsel-banner
├── hooks/                 # Custom React hooks
│   ├── useFavorites.ts    # Håndter favoritter (localStorage)
│   ├── useFeedback.ts    # Spor sendte tilbakemeldinger
│   └── useNotifications.ts  # Notifikasjonslogikk
├── lib/                   # Hjelpefunksjoner
│   ├── utils.ts          # Tidsformatering, sortering, status
│   └── prisma.ts         # Database-tilkobling
└── prisma/                # Database schema og migrations
    ├── schema.prisma      # Database-modeller
    └── seed.ts           # Startdata (alle foredrag)
```

## 🎨 Vanlige justeringer

### 1. Endre visning/design (UI)

#### Endre farger og styling
- **Tailwind CSS** brukes for styling
- Endre klasser i komponentene direkte
- Eksempel: Endre bakgrunnsfarge på SessionCard i `components/SessionCard.tsx`:

```tsx
// Endre fra blå til grønn for aktive foredrag
className={cn(
  'rounded-lg border p-3',
  status === 'current'
    ? 'border-green-500 bg-green-50'  // Endret fra blue til green
    : ...
)}
```

#### Endre tekst eller overskrifter
- **Hovedside**: `app/page.tsx` linje 81 - endre tittel
- **SessionCard**: `components/SessionCard.tsx` - endre tekster i knapper og labels
- **FeedbackForm**: `components/FeedbackForm.tsx` - endre spørsmålstekster

#### Endre layout eller struktur
- **Hovedside layout**: `app/page.tsx` linje 75-154
- **AgendaList struktur**: `components/AgendaList.tsx`
- **SessionCard layout**: `components/SessionCard.tsx` linje 25-149

### 2. Endre logikk/funksjonalitet

#### Endre tidsbasert sortering eller status
- **Fil**: `lib/utils.ts`
- **Funksjoner**:
  - `getSessionStatus()` - Bestemmer om foredrag er "upcoming", "current" eller "completed"
  - `sortSessionsByTime()` - Sorterer foredrag etter tid
  - `groupSessionsByStatus()` - Grupperer foredrag i kategorier

**Eksempel**: Endre når et foredrag regnes som "current":
```typescript
// I lib/utils.ts, linje 11-22
export function getSessionStatus(session: Session, currentTime: Date = new Date()): SessionStatus {
  const start = new Date(session.startTime)
  const end = new Date(session.endTime)
  
  // Legg til 5 minutter buffer før "current"
  const buffer = 5 * 60 * 1000 // 5 minutter i millisekunder
  
  if (currentTime < start - buffer) {
    return 'upcoming'
  } else if (currentTime >= start - buffer && currentTime <= end) {
    return 'current'
  } else {
    return 'completed'
  }
}
```

#### Endre notifikasjonsvarsel (10 minutter før)
- **Fil**: `hooks/useNotifications.ts`
- **Søk etter**: `10` eller `minutesUntilStart`
- Endre tallet fra 10 til ønsket antall minutter

#### Endre favoritt-funksjonalitet
- **Fil**: `hooks/useFavorites.ts`
- Her kan du endre hvordan favoritter lagres (f.eks. fra localStorage til database)

### 3. Endre data/database

#### Legge til eller endre foredrag
- **Fil**: `prisma/seed.ts`
- Legg til nye sesjoner i `sessions` arrayet
- Kjør: `npm run db:seed` for å oppdatere databasen

**Eksempel**:
```typescript
{
  id: 'session-17',
  title: 'Nytt foredrag',
  speaker: 'Navn Navnesen',
  room: 'Sal 1',
  startTime: new Date('2025-12-20T10:00:00'),
  endTime: new Date('2025-12-20T11:00:00'),
  description: 'Beskrivelse av foredraget'
}
```

#### ✨ Endre tidspunkter, romnavn eller foredragsholdere

Dette er en av de vanligste justeringene! Alle foredrag er definert i `prisma/seed.ts`.

**Steg-for-steg guide**:

1. **Åpne filen**: `prisma/seed.ts`

2. **Finn foredraget du vil endre**:
   - Scroll ned til `sessions` arrayet (starter rundt linje 11)
   - Hver foredrag er et objekt med `title`, `speaker`, `room`, `startTime`, `endTime`, og `description`

3. **Endre tidspunkter**:
   ```typescript
   // Før
   startTime: new Date('2025-12-13T12:15:00'),
   endTime: new Date('2025-12-13T12:40:00'),
   
   // Etter (endret til 13:00-13:25)
   startTime: new Date('2025-12-13T13:00:00'),
   endTime: new Date('2025-12-13T13:25:00'),
   ```
   
   **Format**: `new Date('YYYY-MM-DDTHH:MM:SS')`
   - `YYYY-MM-DD` = dato (f.eks. `2025-12-13`)
   - `HH:MM:SS` = tid i 24-timers format (f.eks. `14:30:00` for 14:30)

4. **Endre romnavn**:
   ```typescript
   // Før
   room: 'Sal 1 (felles)',
   
   // Etter
   room: 'Sal 3 (nytt rom)',
   ```

5. **Endre foredragsholder**:
   ```typescript
   // Før
   speaker: 'Morten Hanshaugen',
   
   // Etter
   speaker: 'Nytt Navn',
   
   // Eller fjern foredragsholder (sett til null)
   speaker: null,
   ```

6. **Endre tittel eller beskrivelse**:
   ```typescript
   // Før
   title: 'Google Kvante computing',
   description: 'Foredrag om Google Quantum Computing',
   
   // Etter
   title: 'Kvantekomputing med Google',
   description: 'Oppdatert beskrivelse av foredraget',
   ```

7. **Oppdater databasen**:
   ```bash
   npm run db:seed
   ```
   
   Dette vil:
   - Slette alle eksisterende foredrag
   - Legge inn de oppdaterte foredragene fra `seed.ts`
   - Vise antall foredrag som ble lagt til

8. **Test endringene**:
   ```bash
   npm run dev
   ```
   - Åpne [http://localhost:3000](http://localhost:3000)
   - Sjekk at endringene vises korrekt

**⚠️ Viktig**: 
- Hvis du har sendt tilbakemeldinger i databasen, vil `npm run db:seed` **slette alle tilbakemeldinger** også (fordi den sletter alt først)
- For produksjon: Endre seed-filen og push til GitHub. Vercel vil ikke automatisk kjøre seed, så du må kjøre det manuelt via Vercel CLI eller Dashboard

**Eksempel - Endre hele et foredrag**:
```typescript
// I prisma/seed.ts, finn foredraget og endre:
{
  title: 'Google Kvante computing',
  speaker: 'Morten Hanshaugen',
  room: 'Sal 1 (felles)',
  startTime: new Date('2025-12-13T12:15:00'),
  endTime: new Date('2025-12-13T12:40:00'),
  description: 'Foredrag om Google Quantum Computing',
}

// Til:
{
  title: 'Kvantekomputing med Google',
  speaker: 'Morten Hanshaugen og Ny Kollega',  // Endret foredragsholder
  room: 'Sal 2 (breakout)',                     // Endret rom
  startTime: new Date('2025-12-13T13:00:00'),  // Endret starttid
  endTime: new Date('2025-12-13T13:30:00'),    // Endret sluttid
  description: 'Oppdatert beskrivelse av foredraget om kvantekomputing',
}
```

#### Endre database-schema
- **Fil**: `prisma/schema.prisma`
- Legg til nye felt i `Session` eller `Feedback` modellene
- Kjør: `npx prisma migrate dev --name add_new_field` for å opprette migration
- Oppdater TypeScript-typer: `npx prisma generate`

### 4. Endre API-endpoints

#### Endre hvordan sesjoner hentes
- **Fil**: `app/api/sessions/route.ts`
- Her kan du legge til filtrering, sortering, eller ekstra data

#### Endre feedback-lagring
- **Fil**: `app/api/feedback/route.ts`
- Her kan du endre validering eller legge til ekstra felt

## 🧪 Teste endringene

### Lokal utvikling

1. **Start utviklingsserver**:
```bash
npm run dev
```

2. **Åpne nettleseren**:
   - Gå til [http://localhost:3000](http://localhost:3000)
   - Endringene vises automatisk (hot reload)

3. **Test på mobil**:
   - Finn din lokale IP-adresse: `ipconfig` (Windows) eller `ifconfig` (Mac/Linux)
   - Åpne `http://[din-ip]:3000` på mobilen
   - Eller bruke Chrome DevTools Device Mode (F12 → Toggle device toolbar)

### Verifisere endringer

1. **Sjekk konsollen**:
   - Åpne Developer Tools (F12)
   - Se etter feilmeldinger i Console-fanen

2. **Test funksjonalitet**:
   - Legg til/fjern favoritter
   - Send tilbakemelding
   - Sjekk at notifikasjoner fungerer

3. **Test responsivt design**:
   - Resize nettleservinduet
   - Test på ulike skjermstørrelser

## 🔄 Utviklingsworkflow

### 1. Gjør endringer
- Rediger filene du trenger
- Lagre endringene

### 2. Test lokalt
```bash
npm run dev
```
- Sjekk at alt fungerer som forventet

### 3. Formater kode (valgfritt)
```bash
npm run format
```

### 4. Sjekk for feil (valgfritt)
```bash
npm run lint
```

### 5. Commit endringene
```bash
git add .
git commit -m "feat(component): beskriv hva du endret"
```

### 6. Push til GitHub (hvis du vil deploye)
```bash
git push origin main
```
- Vercel vil automatisk deploye endringene

## 📝 Eksempler på vanlige justeringer

### Eksempel 1: Endre tittel på hovedside

**Fil**: `app/page.tsx` linje 81

**Fra**:
```tsx
<h1 className="...">
  🌲 SPK Jule-Fagdag 2025
</h1>
```

**Til**:
```tsx
<h1 className="...">
  🎄 SPK Julefagdag 2025 - Agenda
</h1>
```

### Eksempel 2: Legge til nytt felt i SessionCard

**Fil**: `components/SessionCard.tsx`

1. Legg til nytt felt i `SessionCardProps` interface (hvis nødvendig)
2. Legg til visning av feltet i JSX:

```tsx
{session.speaker && (
  <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
    <span className="font-medium">Foredragsholder:</span> {session.speaker}
  </p>
)}
```

### Eksempel 3: Endre varsel-tid fra 10 til 15 minutter

**Fil**: `hooks/useNotifications.ts`

Søk etter linjen som sjekker `minutesUntilStart <= 10` og endre til `15`:

```typescript
// Før
if (minutesUntilStart <= 10 && minutesUntilStart > 0) {

// Etter
if (minutesUntilStart <= 15 && minutesUntilStart > 0) {
```

### Eksempel 4: Endre farge på favoritt-knapp

**Fil**: `components/SessionCard.tsx` linje 78-80

```tsx
// Før
isFavorite
  ? 'text-yellow-500'
  : 'text-gray-400 hover:text-yellow-500'

// Etter (rød i stedet for gul)
isFavorite
  ? 'text-red-500'
  : 'text-gray-400 hover:text-red-500'
```

### Eksempel 5: Endre tidspunkt og rom for et foredrag

**Fil**: `prisma/seed.ts`

Finn foredraget du vil endre (f.eks. "Google Kvante computing" rundt linje 38):

```typescript
// Før
{
  title: 'Google Kvante computing',
  speaker: 'Morten Hanshaugen',
  room: 'Sal 1 (felles)',
  startTime: new Date('2025-12-13T12:15:00'),
  endTime: new Date('2025-12-13T12:40:00'),
  description: 'Foredrag om Google Quantum Computing',
}

// Etter (endret tidspunkt og rom)
{
  title: 'Google Kvante computing',
  speaker: 'Morten Hanshaugen',
  room: 'Sal 2 (breakout)',              // Endret rom
  startTime: new Date('2025-12-13T13:00:00'),  // Endret starttid til 13:00
  endTime: new Date('2025-12-13T13:30:00'),    // Endret sluttid til 13:30
  description: 'Foredrag om Google Quantum Computing',
}
```

**Etter endringene, kjør**:
```bash
npm run db:seed
npm run dev
```

## 🆘 Hjelp og feilsøking

### Endringene vises ikke
- Sjekk at utviklingsserveren kjører (`npm run dev`)
- Hard refresh nettleseren (Ctrl+Shift+R eller Cmd+Shift+R)
- Sjekk konsollen for feilmeldinger

### TypeScript-feil
- Kjør `npx prisma generate` hvis du har endret database-schema
- Sjekk at alle imports er korrekte
- Se etter røde understrekinger i editoren

### Database-endringer
- Hvis du har endret `schema.prisma`, kjør:
  ```bash
  npx prisma migrate dev --name beskriv_endringen
  npx prisma generate
  ```

### Styling ser ikke riktig ut
- Sjekk at Tailwind CSS-klassene er korrekte
- Se [Tailwind CSS dokumentasjon](https://tailwindcss.com/docs) for riktig syntax
- Sjekk at klassen eksisterer i `tailwind.config.js` (hvis du har lagt til custom klasser)

## 📚 Ytterligere ressurser

- **Next.js dokumentasjon**: https://nextjs.org/docs
- **React dokumentasjon**: https://react.dev
- **Tailwind CSS dokumentasjon**: https://tailwindcss.com/docs
- **Prisma dokumentasjon**: https://www.prisma.io/docs

## 💡 Tips

1. **Bruk TypeScript**: Editoren vil hjelpe deg med autocomplete og feiloppdagelse
2. **Test ofte**: Test endringene mens du jobber, ikke bare til slutt
3. **Commit ofte**: Lag små commits med beskrivende meldinger
4. **Les koden**: Se på eksisterende kode først for å forstå mønstrene
5. **Bruk DevTools**: Browser Developer Tools er din venn for debugging

---

**Spørsmål?** Sjekk `.cursor/scratchpad.md` for prosjektstatus og planlegging.

