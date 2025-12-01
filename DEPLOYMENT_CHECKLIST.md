# Deployment Checklist - Julefagdag

## ✅ Pre-Deployment (Fullført)

- [x] Kode er pushet til GitHub
- [x] Build fungerer lokalt (`npm run build`)
- [x] Alle TypeScript-feil er fikset
- [x] PWA-ikoner er opprettet
- [x] Service Worker er konfigurert
- [x] Prisma schema er oppdatert
- [x] API routes er implementert

## 📋 Deployment Steps

### 1. Opprett Vercel Postgres Database

1. Gå til [Vercel Dashboard](https://vercel.com/dashboard)
2. Velg prosjektet "julefagdag" (eller opprett nytt fra GitHub-repo)
3. Gå til **Storage** tab
4. Klikk **Create Database**
5. Velg **Postgres**
6. Velg region: **iad1** (anbefalt for Norge)
7. Gi navn: `julefagdag-db`
8. Klikk **Create**

Vercel vil automatisk opprette `POSTGRES_URL` environment variable.

### 2. Konfigurer Environment Variables

1. Gå til **Settings** → **Environment Variables** i Vercel Dashboard
2. Legg til:
   - **Name**: `DATABASE_URL`
   - **Value**: Kopier verdien fra `POSTGRES_URL` (fra Storage tab)
   - **Environment**: ✅ Production, ✅ Preview, ✅ Development
3. Klikk **Save**

### 3. Deploy via GitHub (Automatisk)

Koden er allerede pushet til GitHub. Hvis prosjektet er koblet til Vercel:

1. Vercel vil automatisk detektere endringer og starte deployment
2. Vent til deployment er ferdig (sjekk **Deployments** tab)

### 4. Deploy via Vercel CLI (Alternativ)

Hvis du ikke har koblet GitHub-repoet ennå:

```bash
# Installer Vercel CLI (hvis ikke allerede installert)
npm i -g vercel

# Logg inn
vercel login

# Deploy (første gang - følg instruksjonene)
vercel

# For produksjon
vercel --prod
```

### 5. Kjør Database Migrations

Etter første deployment:

```bash
# Hent environment variables fra Vercel
vercel env pull .env.local

# Kjør migrations mot produksjonsdatabasen
npx prisma migrate deploy
```

### 6. Seed Database

```bash
# Sørg for at du har .env.local med DATABASE_URL fra Vercel
npm run db:seed
```

### 7. Verifiser Deployment

1. Gå til deployment URL (f.eks. `julefagdag.vercel.app`)
2. Test at applikasjonen laster
3. Test at sesjoner vises korrekt
4. Test favoritt-funksjonalitet
5. Test feedback-funksjonalitet
6. Test notifikasjoner (krever faktisk enhet)

## 🔍 Troubleshooting

### Build feiler

- Sjekk at `DATABASE_URL` er satt i Vercel Dashboard
- Sjekk build logs i Vercel Dashboard → Deployments → [deployment] → Build Logs

### Database connection feil

- Verifiser at `DATABASE_URL` er korrekt kopiert fra `POSTGRES_URL`
- Sjekk at databasen er aktiv i Storage tab
- Test connection lokalt med `vercel env pull .env.local` og `npx prisma db pull`

### Migrations feiler

- Sjekk at migration-filer er commitet til Git
- Kjør `npx prisma migrate deploy` lokalt med produksjons-DATABASE_URL

## 📱 Post-Deployment Testing

- [ ] Applikasjonen laster på mobil
- [ ] Agenda vises korrekt
- [ ] Favoritt-funksjonalitet fungerer
- [ ] Feedback kan sendes
- [ ] Notifikasjoner fungerer (iOS/Android)
- [ ] PWA kan installeres
- [ ] Offline-støtte fungerer

## 🎉 Neste Steg

Etter vellykket deployment:
1. Test på faktiske iOS og Android-enheter
2. Optimaliser ytelse hvis nødvendig
3. Monitorer brukerfeedback

