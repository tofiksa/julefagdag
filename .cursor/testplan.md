# Browser-basert Testplan

Testplanen er basert på de 5 hovedkravene fra scratchpad.md linje 7-11 og bruker browser-tools til å verifisere funksjonalitet.

## Forutsetninger
- Applikasjonen må være tilgjengelig på `http://localhost:3000` (lokal utvikling) eller produksjons-URL
- Database må være seedet med sesjoner
- Browser-tools må være tilgjengelig

## Test 1: Dynamisk agenda organisert etter gjeldende tid

**Mål**: Verifisere at agenda vises korrekt organisert i seksjoner basert på gjeldende tid

**Steg**:
1. Naviger til hovedside (`/`)
2. Ta snapshot av siden for å se strukturen
3. Verifiser at følgende seksjoner eksisterer:
   - "Nå pågår" (hvis det er foredrag som pågår nå)
   - "Kommende" (hvis det er fremtidige foredrag)
   - "Ferdig" (hvis det er ferdige foredrag)
4. Sjekk at SessionCard-komponenter vises i riktig seksjon
5. Verifiser at foredrag i "Nå pågår" har:
   - Blå bakgrunn (`border-blue-500 bg-blue-50`)
   - "Nå"-badge vises
6. Vent 1-2 minutter og ta ny snapshot for å verifisere at oppdateringen fungerer
7. Sjekk at foredrag flyttes mellom seksjoner når tiden endres

**Forventet resultat**:
- ✅ Agenda vises i tre seksjoner (Nå/Kommende/Ferdig)
- ✅ Foredrag er korrekt plassert basert på gjeldende tid
- ✅ Visuell indikator (blå bakgrunn + "Nå"-badge) vises for pågående foredrag
- ✅ Oppdatering skjer automatisk hvert minutt

**Verifiseringspunkter**:
- Finn tekst "Nå pågår", "Kommende", "Ferdig" på siden
- Sjekk at SessionCard har korrekt styling for "current" status
- Verifiser at tidsstempel vises korrekt på hver SessionCard

---

## Test 2: Merk foredrag som favoritter

**Mål**: Verifisere at brukere kan merke/avmerke foredrag som favoritter

**Steg**:
1. Naviger til hovedside (`/`)
2. Ta snapshot av siden
3. Identifiser favoritt-knappen (stjerne-ikon) på en SessionCard
4. Klikk på favoritt-knappen for å legge til favoritt
5. Verifiser at stjernen blir fylt (gul farge)
6. Ta ny snapshot og verifiser visuell endring
7. Klikk på favoritt-knappen igjen for å fjerne favoritt
8. Verifiser at stjernen blir tom (grå farge)
9. Naviger til `/favorites` siden
10. Verifiser at favorittforedraget vises på favoritt-siden
11. Gå tilbake til hovedside og sjekk at favoritt-status er bevart

**Forventet resultat**:
- ✅ Favoritt-knapp er synlig og klikkbar på hver SessionCard
- ✅ Visuell feedback ved klikk (stjerne fylles/tømmes)
- ✅ Favoritter lagres i localStorage og persisterer ved refresh
- ✅ Favoritt-siden viser kun merkede foredrag
- ✅ Favoritt-status synkroniseres mellom hovedside og favoritt-side

**Verifiseringspunkter**:
- Finn favoritt-knapp (stjerne-ikon) på SessionCard
- Sjekk at knappen har `aria-label` for tilgjengelighet
- Verifiser at localStorage oppdateres ved klikk
- Sjekk at `/favorites` siden viser korrekt innhold

---

## Test 3: Varsler 10 minutter før favorittforedrag starter

**Mål**: Verifisere at varsel-banner vises 10 minutter før favorittforedrag starter

**Steg**:
1. Naviger til hovedside (`/`)
2. Legg til et favorittforedrag som starter om 10-15 minutter (hvis mulig)
3. Ta snapshot av siden
4. Sjekk om NotificationBanner-komponenten vises
5. Verifiser at banneret viser:
   - Tittel på foredraget
   - Romnummer
   - Tid til start (minutter igjen)
6. Hvis ingen foredrag starter om 10 minutter:
   - Manuelt endre systemtid i browser (via DevTools) eller
   - Bruk et testforedrag med starttid 10 minutter frem i tid
7. Verifiser at banneret forsvinner når foredraget starter
8. Test at banneret ikke vises for ikke-favorittforedrag

**Forventet resultat**:
- ✅ NotificationBanner vises når favorittforedrag starter om 10 minutter
- ✅ Banneret viser korrekt informasjon (tittel, rom, tid)
- ✅ Banneret forsvinner når foredraget starter eller når det er mer enn 10 minutter igjen
- ✅ Banneret vises ikke for ikke-favorittforedrag

**Verifiseringspunkter**:
- Finn NotificationBanner-komponent på siden
- Sjekk at banneret har korrekt styling og posisjonering
- Verifiser at tidsberegningen er korrekt (10 minutter før start)
- Test at banneret oppdateres dynamisk

**Note**: For å teste dette effektivt kan man:
- Endre systemtid i browser DevTools (Application → Local Storage → endre `currentTime`)
- Eller opprette et testforedrag med starttid 10 minutter frem i tid

---

## Test 4: Samle inn tilbakemelding per foredrag

**Mål**: Verifisere at tilbakemeldingsskjema fungerer korrekt med tre spørsmål

**Steg**:
1. Naviger til hovedside (`/`)
2. Ta snapshot av siden
3. Identifiser en SessionCard for et ferdig eller pågående foredrag
4. Klikk på "Gi tilbakemelding"-knappen
5. Verifiser at FeedbackForm-modal åpnes
6. Ta snapshot av modal-skjemaet
7. Verifiser at følgende tre spørsmål vises:
   - "Var dette foredraget nyttig?" (thumbs up/down)
   - "Hva lærte du?" (tekstfelt)
   - "Hva vil du utforske videre?" (tekstfelt)
8. Fyll ut skjemaet:
   - Klikk thumbs up eller thumbs down for første spørsmål
   - Skriv inn tekst i "Hva lærte du?"-feltet
   - Skriv inn tekst i "Hva vil du utforske videre?"-feltet
9. Klikk på "Send tilbakemelding"-knappen
10. Verifiser at suksessmelding vises (med smilefjes)
11. Verifiser at modal lukkes automatisk
12. Ta snapshot av SessionCard og verifiser at "Tilbakemelding sendt"-indikator vises
13. Prøv å åpne tilbakemeldingsskjemaet igjen for samme foredrag
14. Verifiser at skjemaet ikke kan sendes på nytt (validering)

**Forventet resultat**:
- ✅ "Gi tilbakemelding"-knapp er synlig på ferdige/pågående foredrag
- ✅ FeedbackForm-modal åpnes ved klikk
- ✅ Alle tre spørsmål vises korrekt
- ✅ Emoji-input (thumbs up/down) fungerer
- ✅ Tekstfelt aksepterer input
- ✅ Skjema kan sendes og viser suksessmelding
- ✅ "Tilbakemelding sendt"-indikator vises etter sending
- ✅ Validering forhindrer dobbeltsending

**Verifiseringspunkter**:
- Finn "Gi tilbakemelding"-knapp på SessionCard
- Sjekk at FeedbackForm har korrekt layout og styling
- Verifiser at alle input-felter er tilgjengelige
- Sjekk at API-kall sendes til `/api/feedback` ved submit
- Verifiser at suksessmelding vises korrekt

---

## Test 5: Lagre tilbakemeldinger i database

**Mål**: Verifisere at tilbakemeldinger lagres korrekt i database via API

**Steg**:
1. Naviger til hovedside (`/`)
2. Åpne browser DevTools → Network tab
3. Fyll ut og send en tilbakemelding (se Test 4)
4. I Network tab, verifiser at POST-request sendes til `/api/feedback`
5. Sjekk request payload:
   - `sessionId` er korrekt
   - `useful` er true/false (basert på thumbs up/down)
   - `learned` inneholder tekst fra "Hva lærte du?"
   - `explore` inneholder tekst fra "Hva vil du utforske videre?"
6. Verifiser at response er 200 OK eller 201 Created
7. Sjekk response body for bekreftelse
8. (Valgfritt) Verifiser direkte i database at data er lagret:
   - Bruk Prisma Studio: `npx prisma studio`
   - Eller sjekk via API: `GET /api/feedback` (hvis implementert)
9. Test feilhåndtering:
   - Prøv å sende tilbakemelding uten å fylle ut alle felter
   - Verifiser at feilmelding vises
10. Test validering:
    - Prøv å sende tilbakemelding to ganger for samme foredrag
    - Verifiser at duplikat-validering fungerer

**Forventet resultat**:
- ✅ POST-request sendes til `/api/feedback` med korrekt data
- ✅ Request payload inneholder alle nødvendige felter
- ✅ Response er suksessfull (200/201)
- ✅ Data lagres i database (Feedback-tabellen)
- ✅ Feilhåndtering fungerer ved ugyldig input
- ✅ Validering forhindrer duplikat-tilbakemeldinger

**Verifiseringspunkter**:
- Sjekk Network tab for API-kall
- Verifiser request payload struktur
- Sjekk response status og body
- Verifiser database via Prisma Studio eller direkte query
- Test feilhåndtering og validering

---

## Test 6: Integrasjonstest - Full flyt

**Mål**: Teste hele brukerflyten fra start til slutt

**Steg**:
1. Naviger til hovedside (`/`)
2. Verifiser at agenda lastes og vises korrekt
3. Legg til 2-3 foredrag som favoritter
4. Naviger til `/favorites` og verifiser at favorittene vises
5. Gå tilbake til hovedside
6. Åpne tilbakemeldingsskjema for et ferdig foredrag
7. Fyll ut og send tilbakemelding
8. Verifiser at "Tilbakemelding sendt"-indikator vises
9. Sjekk at favoritt-status er bevart etter refresh
10. Test responsivt design:
    - Endre viewport til mobil-størrelse (375x667)
    - Verifiser at layout tilpasser seg
    - Test touch-interaksjoner

**Forventet resultat**:
- ✅ Alle funksjoner fungerer sammen uten konflikter
- ✅ State persisteres korrekt (favoritter, tilbakemeldinger)
- ✅ Responsivt design fungerer på mobil-størrelse
- ✅ Ingen konsoll-feil eller advarsler

---

## Testrapport Mal

Etter gjennomføring av testene, fyll ut følgende:

```
## Testrapport - [Dato]

### Test 1: Dynamisk agenda
- Status: ✅ Pass / ❌ Fail
- Notater: [beskriv eventuelle problemer]

### Test 2: Favoritt-funksjonalitet
- Status: ✅ Pass / ❌ Fail
- Notater: [beskriv eventuelle problemer]

### Test 3: Varsler
- Status: ✅ Pass / ❌ Fail
- Notater: [beskriv eventuelle problemer]

### Test 4: Tilbakemeldingsskjema
- Status: ✅ Pass / ❌ Fail
- Notater: [beskriv eventuelle problemer]

### Test 5: Database-lagring
- Status: ✅ Pass / ❌ Fail
- Notater: [beskriv eventuelle problemer]

### Test 6: Integrasjonstest
- Status: ✅ Pass / ❌ Fail
- Notater: [beskriv eventuelle problemer]

### Totalt: X/6 tester passert
```

---

## Kjente begrensninger

- **Test 3 (Varsler)**: Krever at det finnes et favorittforedrag som starter om 10 minutter. For testing kan man:
  - Endre systemtid i browser
  - Opprette testforedrag med spesifikk starttid
  - Eller vente til et foredrag faktisk starter om 10 minutter

- **Test 5 (Database)**: Krever tilgang til database for direkte verifisering. Alternativt kan man verifisere via API-respons og Network tab.

- **Mobile testing**: Browser-tools kan simulere mobil-viewport, men faktisk testing på iOS/Android-enheter krever fysisk tilgang til enheter.

