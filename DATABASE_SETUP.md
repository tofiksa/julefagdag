# Database Setup Guide - Julefagdag

## Steg-for-steg oppsett av Vercel Postgres

### Steg 1: Opprett Postgres Database i Vercel Dashboard

**Du må gjøre dette manuelt i Vercel Dashboard:**

1. Gå til: https://vercel.com/dashboard
2. Klikk på prosjektet **"julefagdag"**
3. Gå til **"Storage"** tab (i venstre meny)
4. Klikk på **"Create Database"** knappen
5. Velg **"Postgres"**
6. Velg region: **"Washington, D.C., USA (East) - iad1"** (anbefalt for Norge)
7. Gi databasen navn: **"julefagdag-db"**
8. Klikk **"Create"**

Vercel vil automatisk opprette `POSTGRES_URL` environment variable.

### Steg 2: Hent POSTGRES_URL

Etter at databasen er opprettet:

1. Gå til **"Storage"** tab i prosjektet
2. Klikk på databasen **"julefagdag-db"**
3. Gå til **"Settings"** tab i database-vinduet
4. Kopier **"Connection String"** eller **"POSTGRES_URL"** verdien

### Steg 3: Sett DATABASE_URL Environment Variable

1. Gå tilbake til prosjektet **"julefagdag"**
2. Gå til **"Settings"** → **"Environment Variables"**
3. Klikk **"Add New"**
4. Fyll inn:
   - **Name**: `DATABASE_URL`
   - **Value**: Lim inn verdien du kopierte fra POSTGRES_URL
   - **Environment**: Velg alle tre (Production, Preview, Development)
5. Klikk **"Save"**

### Steg 4: Kjør kommandoer lokalt

Etter at du har satt `DATABASE_URL`, kjør disse kommandoene:

```bash
# Hent environment variables fra Vercel
vercel env pull .env.local

# Kjør migrations mot produksjonsdatabasen
npx prisma migrate deploy

# Seed database med alle sesjoner
npm run db:seed
```

### Steg 5: Re-deploy applikasjonen

Etter at migrations og seed er kjørt:

```bash
vercel --prod
```

Eller gå til Vercel Dashboard → Deployments → [Latest] → Redeploy

## Verifisering

Etter re-deploy, test at alt fungerer:

1. Gå til: https://julefagdag-keupbejl8-tofiksas-projects.vercel.app
2. Sjekk at sesjoner vises korrekt
3. Test favoritt-funksjonalitet
4. Test feedback-funksjonalitet

## Troubleshooting

### Hvis migrations feiler

- Sjekk at `DATABASE_URL` er korrekt kopiert
- Verifiser at databasen er aktiv i Storage tab
- Prøv å kjøre `npx prisma db pull` for å teste connection

### Hvis seed feiler

- Sjekk at migrations er kjørt først
- Verifiser at `DATABASE_URL` er satt i `.env.local`
- Kjør `npx prisma studio` for å se databasen visuelt

