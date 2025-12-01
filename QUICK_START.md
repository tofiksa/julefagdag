# 🚀 Quick Start - Database Setup

## Steg 1: Opprett Database i Vercel Dashboard

**Gå til:** https://vercel.com/dashboard → **julefagdag** → **Storage** → **Create Database**

1. Velg **Postgres**
2. Region: **iad1** (Washington, D.C.)
3. Navn: **julefagdag-db**
4. Klikk **Create**

## Steg 2: Sett Environment Variable

### Alternativ A: Via Dashboard (Anbefalt)

1. Gå til **Storage** → **julefagdag-db** → **Settings**
2. Kopier **Connection String** (POSTGRES_URL)
3. Gå til **Settings** → **Environment Variables**
4. Legg til:
   - Name: `DATABASE_URL`
   - Value: Lim inn connection string
   - Environments: ✅ Production ✅ Preview ✅ Development
5. Klikk **Save**

### Alternativ B: Via CLI

Etter at du har kopiert connection string fra Dashboard:

```bash
# Sett DATABASE_URL for alle miljøer
vercel env add DATABASE_URL production
# Lim inn connection string når du blir bedt om det

vercel env add DATABASE_URL preview
# Samme connection string

vercel env add DATABASE_URL development
# Samme connection string
```

## Steg 3: Kjør Setup Script

```bash
./setup-database.sh
```

Dette scriptet vil:
- ✅ Hente environment variables fra Vercel
- ✅ Kjøre database migrations
- ✅ Seed database med alle sesjoner

## Steg 4: Re-deploy

```bash
vercel --prod
```

## ✅ Ferdig!

Test applikasjonen på: https://julefagdag-keupbejl8-tofiksas-projects.vercel.app

