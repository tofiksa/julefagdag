# Deployment Guide - Vercel

Denne guiden beskriver hvordan du deployer Julefagdag-applikasjonen til Vercel.

## Forutsetninger

- Vercel-konto (gratis tier fungerer)
- GitHub-repository koblet til Vercel

## Steg-for-steg oppsett

### 1. Opprett Vercel Postgres Database

1. Logg inn på [Vercel Dashboard](https://vercel.com/dashboard)
2. Velg ditt prosjekt (eller opprett nytt fra GitHub-repo)
3. Gå til **Storage** tab i prosjektet
4. Klikk **Create Database**
5. Velg **Postgres**
6. Velg region (anbefalt: `iad1` for beste ytelse i Norge)
7. Gi databasen et navn (f.eks. `julefagdag-db`)
8. Klikk **Create**

Vercel vil automatisk opprette `POSTGRES_URL` environment variable.

### 2. Konfigurer Environment Variables

Vercel Postgres bruker `POSTGRES_URL`, men Prisma forventer `DATABASE_URL`. Du har to alternativer:

#### Alternativ A: Bruk POSTGRES_URL direkte (anbefalt)

1. I Vercel Dashboard, gå til **Settings** → **Environment Variables**
2. Legg til:
   - **Name**: `DATABASE_URL`
   - **Value**: Kopier verdien fra `POSTGRES_URL`
   - **Environment**: Production, Preview, Development (velg alle)

#### Alternativ B: Oppdater Prisma config

Hvis du vil bruke `POSTGRES_URL` direkte, må du oppdatere `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}
```

### 3. Deploy til Vercel

#### Via GitHub (anbefalt)

1. Push koden til GitHub:
```bash
git push origin main
```

2. Vercel vil automatisk detektere endringer og starte ny deployment

3. Vent til deployment er ferdig

#### Via Vercel CLI

1. Installer Vercel CLI:
```bash
npm i -g vercel
```

2. Logg inn:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

### 4. Kjør Database Migrations

Etter første deployment, må du kjøre Prisma migrations:

#### Via Vercel CLI (anbefalt)

1. Hent environment variables:
```bash
vercel env pull .env.local
```

2. Kjør migrations:
```bash
npx prisma migrate deploy
```

#### Via Vercel Dashboard

1. Gå til **Settings** → **Environment Variables**
2. Sjekk at `DATABASE_URL` er satt
3. Gå til **Deployments** tab
4. Åpne den siste deployment
5. I **Functions** tab, kan du kjøre kommandoer (krever Vercel Pro)

### 5. Seed Database

Kjør seed-scriptet for å fylle databasen med sesjoner:

```bash
# Lokalt med environment variables fra Vercel
vercel env pull .env.local
npm run db:seed
```

Eller via Vercel CLI:
```bash
vercel env pull .env.local
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2) npm run db:seed
```

### 6. Verifiser Deployment

1. Gå til deployment URL (f.eks. `julefagdag.vercel.app`)
2. Sjekk at applikasjonen laster
3. Test at sesjoner vises korrekt
4. Test feedback-funksjonalitet

## Troubleshooting

### Prisma Client ikke generert

Hvis du får feil om manglende Prisma Client:

1. Sjekk at `postinstall` script er i `package.json`:
```json
"postinstall": "prisma generate"
```

2. Sjekk at `build` script inkluderer Prisma generate:
```json
"build": "prisma generate && next build"
```

### Database connection feil

1. Sjekk at `DATABASE_URL` er satt i Vercel Dashboard
2. Verifiser at connection string er korrekt
3. Sjekk at database er opprettet og aktiv

### Migrations feiler

1. Sjekk at du har kjørt `prisma migrate dev` lokalt først
2. Sjekk at migration-filer er commitet til Git
3. Kjør `prisma migrate deploy` i produksjon

## Production Checklist

- [ ] Vercel Postgres database opprettet
- [ ] `DATABASE_URL` environment variable satt
- [ ] Kode pushet til GitHub
- [ ] Deployment fullført
- [ ] Migrations kjørt (`prisma migrate deploy`)
- [ ] Database seedet (`npm run db:seed`)
- [ ] Applikasjonen fungerer på production URL
- [ ] Feedback-funksjonalitet testet

## Oppdateringer

For å oppdatere applikasjonen:

1. Gjør endringer lokalt
2. Test lokalt
3. Commit og push til GitHub:
```bash
git add .
git commit -m "feat: description"
git push origin main
```

4. Vercel vil automatisk deploye endringene

## Database Backups

Vercel Postgres har automatiske backups. For å restore:

1. Gå til **Storage** → **Postgres** → **Backups**
2. Velg backup du vil restore
3. Klikk **Restore**

## Support

Hvis du støter på problemer:
1. Sjekk Vercel deployment logs
2. Sjekk Prisma logs
3. Verifiser environment variables

