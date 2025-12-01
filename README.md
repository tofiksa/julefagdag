# SPK Julefagdag 2025 - Agenda Applikasjon

En mobilvennlig webapplikasjon for å vise agenda for Statens Pensjonskasse Julefagdag 2025.

## Funksjoner

- 📅 Dynamisk agenda organisert etter gjeldende tid (Nå/Kommende/Ferdig)
- ⭐ Merk foredrag som favoritter
- 🔔 Notifikasjoner 10 minutter før favorittforedrag starter
- 💬 Gi tilbakemelding per foredrag med tre spørsmål
- 📱 Optimalisert for mobil (iOS og Android)

## Teknologi

- **Next.js 15** med App Router
- **TypeScript**
- **Prisma** med PostgreSQL
- **Tailwind CSS**
- **Vercel** for hosting

## Lokal utvikling

### Forutsetninger

- Node.js 18+ 
- npm eller yarn
- PostgreSQL database (eller Vercel Postgres)

### Installasjon

1. Klon repositoriet:
```bash
git clone https://github.com/tofiksa/julefagdag.git
cd julefagdag
```

2. Installer avhengigheter:
```bash
npm install
```

3. Opprett `.env` fil med database URL:
```bash
# Kopier eksempel-filen
cp .env.example .env
# Rediger .env og legg til din DATABASE_URL
```

For lokal utvikling kan du bruke:
- Lokal PostgreSQL: `DATABASE_URL="postgresql://user:password@localhost:5432/julefagdag"`
- Eller opprett en Vercel Postgres database (se `DEPLOYMENT.md` for detaljer)

4. Kjør Prisma migrations:
```bash
npx prisma migrate dev
```

5. Seed database med sesjoner:
```bash
npm run db:seed
```

6. Start utviklingsserveren:
```bash
npm run dev
```

Applikasjonen vil være tilgjengelig på [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

### Steg 1: Opprett Vercel Postgres Database

1. Gå til [Vercel Dashboard](https://vercel.com/dashboard)
2. Velg ditt prosjekt eller opprett et nytt
3. Gå til "Storage" tab
4. Klikk "Create Database" og velg "Postgres"
5. Velg region (anbefalt: `iad1` for beste ytelse)
6. Vercel vil automatisk opprette `POSTGRES_URL` environment variable

### Steg 2: Konfigurer Environment Variables

I Vercel Dashboard, gå til Settings → Environment Variables og legg til:

```
DATABASE_URL=<din-postgres-url-fra-vercel>
```

Vercel Postgres bruker `POSTGRES_URL` som standard, men Prisma forventer `DATABASE_URL`. Du kan enten:
- Bruke `POSTGRES_URL` direkte (må oppdatere Prisma config)
- Eller kopiere `POSTGRES_URL` til `DATABASE_URL`

### Steg 3: Deploy til Vercel

1. Push koden til GitHub:
```bash
git push origin main
```

2. Vercel vil automatisk detektere Next.js-prosjektet og starte deployment

3. Etter første deployment, kjør migrations:
```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Eller via Vercel Dashboard → Functions → Run migrations
```

4. Seed database (kun første gang):
```bash
npm run db:seed
```

### Steg 4: Konfigurer Build Settings

Vercel vil automatisk:
- Kjøre `npm install` (som kjører `postinstall` script som genererer Prisma Client)
- Kjøre `npm run build` (som genererer Prisma Client og bygger Next.js)

## Database Schema

### Session
- `id`: Unique identifier
- `title`: Tittel på foredraget
- `speaker`: Foredragsholder (optional)
- `room`: Rom hvor foredraget holdes
- `startTime`: Starttidspunkt
- `endTime`: Sluttidspunkt
- `description`: Beskrivelse (optional)

### Feedback
- `id`: Unique identifier
- `sessionId`: Referanse til Session
- `useful`: Var dette nyttig? (boolean)
- `learned`: Lærte du noe nytt? (boolean)
- `explore`: Kunne du tenke deg å utforske dette temaet selv? (boolean)
- `createdAt`: Når tilbakemeldingen ble gitt

## Scripts

- `npm run dev` - Start utviklingsserver
- `npm run build` - Bygg for produksjon
- `npm run start` - Start produksjonsserver
- `npm run lint` - Kjør linter
- `npm run format` - Formater kode
- `npm run db:seed` - Seed database med sesjoner

## Lisens

Privat prosjekt for Statens Pensjonskasse
