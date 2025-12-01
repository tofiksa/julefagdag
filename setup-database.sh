#!/bin/bash

echo "🔍 Sjekker Vercel environment variables..."
vercel env ls

echo ""
echo "📥 Henter environment variables fra Vercel..."
vercel env pull .env.local

echo ""
echo "🔍 Verifiserer DATABASE_URL..."
if grep -q "DATABASE_URL=" .env.local; then
    echo "✅ DATABASE_URL funnet i .env.local"
    echo ""
    echo "🚀 Kjører database migrations..."
    npx prisma migrate deploy
    
    echo ""
    echo "🌱 Seeder database med sesjoner..."
    npm run db:seed
    
    echo ""
    echo "✅ Database setup fullført!"
    echo ""
    echo "📋 Neste steg:"
    echo "1. Re-deploy applikasjonen: vercel --prod"
    echo "2. Test applikasjonen på: https://julefagdag-keupbejl8-tofiksas-projects.vercel.app"
else
    echo "❌ DATABASE_URL ikke funnet!"
    echo ""
    echo "📋 Følg disse stegene først:"
    echo "1. Opprett Postgres database i Vercel Dashboard"
    echo "2. Sett DATABASE_URL environment variable"
    echo "3. Kjør dette scriptet på nytt"
fi
