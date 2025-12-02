# Feil funnet under testing

Dette dokumentet inneholder alle feil og problemer funnet under browser-basert testing av applikasjonen.

**Testdato**: 2025-01-02  
**Testmiljø**: http://localhost:3000  
**Testmetode**: Browser-tools (automatisert testing)

## Teststatus

### Fullførte tester:
- ✅ Test 1: Dynamisk agenda organisert etter gjeldende tid (delvis - kun "Kommende" seksjon synlig)
- ✅ Test 2: Merk foredrag som favoritter (delvis - favoritter-siden fungerer, men klikk-test feilet)

### Ikke fullførte tester (pga. API-feil):
- ❌ Test 3: Varsler 10 minutter før favorittforedrag starter
- ❌ Test 4: Samle inn tilbakemelding per foredrag
- ❌ Test 5: Lagre tilbakemeldinger i database
- ❌ Test 6: Integrasjonstest - Full flyt

**Årsak**: HTTP 500-feil på hovedside hindrer full testing av funksjonalitet som krever sesjonsdata.

---

## Test 1: Dynamisk agenda organisert etter gjeldende tid

### Console-feil:
- ⚠️ **Warning**: "Notification permission denied or not supported" (useNotifications.ts:95)
  - Dette er forventet hvis brukeren ikke har gitt notifikasjonstillatelse
  - Status: Ikke kritisk, men bør håndteres bedre i produksjon

- ℹ️ **Info**: "Service Worker registered: http://localhost:3000/" (sw-register.tsx:21)
  - Status: OK - Service Worker fungerer

- ⚠️ **Warning**: React DevTools suggestion (ikke kritisk)

### Visuelle problemer:
- Ingen problemer observert

### Funksjonelle problemer:
- ✅ "Kommende" seksjon vises korrekt
- ⚠️ "Nå pågår" og "Ferdig" seksjoner vises ikke (sannsynligvis fordi alle foredrag er i fremtiden basert på gjeldende tid)
  - Dette er forventet hvis ingen foredrag pågår nå eller er ferdige
  - Status: Fungerer som forventet

### Network-feil:
- ❌ **KRITISK**: HTTP 500-feil på hovedside (`http://localhost:3000/`)
  - Dette tyder på at API-kallet til `/api/sessions` feiler
  - Status: KRITISK - må fikses før applikasjonen kan fungere korrekt
  - Mulige årsaker: Database ikke tilkoblet, migrations ikke kjørt, eller API-feil

---

## Test 2: Merk foredrag som favoritter

### Console-feil:
- ❌ **Error**: "Uncaught Error: Element not found" ved klikk på favoritt-knapp
  - Dette skjedde når browser-tool prøvde å klikke på favoritt-knappen
  - Status: Kan være et problem med browser-tool eller element-referanse
  - Merk: Favoritter-siden (`/favorites`) lastet korrekt uten feil

### Visuelle problemer:
- Ingen problemer observert

### Funksjonelle problemer:
- ✅ Favoritter-siden (`/favorites`) lastes korrekt
- ✅ "Tilbake til agenda"-lenke fungerer
- ⚠️ Klikk på favoritt-knapp kunne ikke testes automatisk pga. element-referanse feil

---

## Test 3: Varsler 10 minutter før favorittforedrag starter

### Console-feil:
- [Venter på testing]

### Visuelle problemer:
- [Venter på testing]

### Funksjonelle problemer:
- [Venter på testing]

---

## Test 4: Samle inn tilbakemelding per foredrag

### Console-feil:
- [Venter på testing]

### Visuelle problemer:
- [Venter på testing]

### Funksjonelle problemer:
- [Venter på testing]

---

## Test 5: Lagre tilbakemeldinger i database

### Console-feil:
- [Venter på testing]

### Visuelle problemer:
- [Venter på testing]

### Funksjonelle problemer:
- [Venter på testing]

---

## Test 6: Integrasjonstest - Full flyt

### Console-feil:
- [Venter på testing]

### Visuelle problemer:
- [Venter på testing]

### Funksjonelle problemer:
- [Venter på testing]

---

## Generelle problemer

### Console-feil:
- ⚠️ **Warning**: "Notification permission denied or not supported" (useNotifications.ts:95)
  - Dette er forventet hvis brukeren ikke har gitt notifikasjonstillatelse
  - Status: Ikke kritisk, men bør håndteres bedre i produksjon
  - Anbefaling: Legg til bedre feilhåndtering og informasjon til brukeren

- ⚠️ **Warning**: React DevTools suggestion (ikke kritisk)

- ℹ️ **Info**: "Service Worker registered: http://localhost:3000/" (sw-register.tsx:21)
  - Status: OK - Service Worker fungerer som forventet

### Network-feil:
- ❌ **KRITISK**: HTTP 500-feil på hovedside (`http://localhost:3000/`)
  - Dette tyder på at API-kallet til `/api/sessions` feiler
  - Status: KRITISK - må fikses før applikasjonen kan fungere korrekt
  - Mulige årsaker: 
    - Database ikke tilkoblet eller ikke konfigurert
    - Migrations ikke kjørt
    - Database ikke seedet med data
    - Prisma Client ikke generert
  - Anbefaling: Sjekk at DATABASE_URL er satt, kjør `npx prisma migrate dev` og `npm run db:seed`

### Ytelsesproblemer:
- Ingen ytelsesproblemer observert under testing

---

## Oppsummering

### Totalt antall feil funnet: 2 kritiske, 1 advarsel

**Kritiske feil:**
1. HTTP 500-feil på hovedside - API-kall til `/api/sessions` feiler
2. Element not found error ved klikk på favoritt-knapp (kan være browser-tool relatert)

**Advarsler:**
1. Notification permission denied - forventet, men bør håndteres bedre

**Positive funn:**
- Service Worker registreres korrekt
- Favoritter-siden (`/favorites`) lastes uten feil
- "Kommende" seksjon vises korrekt
- Ingen JavaScript runtime-feil

### Anbefalinger:
1. **Høy prioritet**: Fiks database-tilkobling og API-feil (HTTP 500)
2. **Middels prioritet**: Forbedre feilhåndtering for notifikasjoner
3. **Lav prioritet**: Test favoritt-funksjonalitet manuelt siden automatisk testing feilet

