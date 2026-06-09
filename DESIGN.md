# Design System: SPK Julefagdag 2026
**Project ID:** `Julefagdag` (Next.js 15 / App Router codebase — *ikke* et Stitch-prosjekt; det finnes ingen Stitch Project ID eller Stitch MCP-server for dette repoet. Designtokens er hentet direkte fra `app/globals.css` og komponentene under `components/`.)

> Kilde for tokens: `app/globals.css` (CSS-variabler + Tailwind v4 `@theme inline` + `@layer components`).
> Kilde for layout: `components/SessionCard.tsx`, `components/AgendaList.tsx`, `lib/utils.ts`, `app/page.tsx`.
> Fasit for foredragsholdere: `prisma/seed.ts` (feltet `session.speaker`).

---

## 1. Visual Theme & Atmosphere

SPK Julefagdag/Inspirasjonsdag 2026 har et **corporate-playful** visuelt språk: en mørk, profesjonell *Midnight Event Navy*-bakgrunn fungerer som scenografi/ramme, mens innholdet leveres på lyse, varme flater (krem og hvit) som veksler rad for rad — direkte speiling av programplakatens agenda-tabell. Stemningen er **festlig, energisk og tett** uten å miste SPKs profesjonelle identitet.

Tettheten er **kompakt og informasjonsrik**, ikke luftig galleri-stil: kortene pakker tid, tittel, foredragsholder, rom-merke og beskrivelse i et stramt vertikalt hierarki med romslig, men målbevisst padding (`p-3` på mobil → `p-4` på `sm`). Kontrasten er bevisst **høy**: hvit tekst mot dyp navy ute, mørk navy-tekst mot krem/hvit/gull inne. Fargene er ikke dekorasjon for dekorasjonens skyld — de koder **rom, status og spesielle hendelser** (House of Nerds, middag, pauser).

**Nøkkelkarakteristikker:**
- Mørk navy "scene" som omslutter lyse "program-rader" — sterk figur/grunn-kontrast.
- Vekslende krem/hvit kort som rytmisk speiler en trykt programtabell.
- Solide, mettede høydepunktsflater (gull/korall) — aldri halvgjennomsiktige overlays.
- Flat, plakat-inspirert dybde: nesten ingen skygge i hvile, kun en hårfin `shadow-sm` som løftes til `shadow-md` ved hover.
- Generøst avrundede hjørner (`rounded-xl`) gjennomgående — vennlig, moderne, aldri skarpt/teknisk.
- Mobil-først touch-ergonomi med 44×44 px minimumsmål på alt interaktivt.

---

## 2. Color Palette & Roles

Alle hex-koder er hentet **eksakt** fra `app/globals.css` (`:root` + `@theme inline`). Beskrivende navn brukes konsekvent gjennom dokumentet.

### Mørke flater (scene / ramme)
- **Midnight Event Navy** (`#001B3D`) — `--spk-navy`. Primær sidebakgrunn (`spk-page`), pause-/lunsj-felt, rom-pill for "Scenen", og "Nå"-statuschip. Selve grunnflaten alt annet hviler på.
- **Deep Poster Navy** (`#051635`) — `--spk-navy-deep`. Sticky header (`spk-header`, 95 % opacity + blur), seksjonsbarer (`spk-section-bar`), pause-kort-bakgrunn og dypeste rom-pill ("other").

### Lyse innholdsflater (program-rader)
- **Warm Agenda Cream** (`#FFF5E1`) — `--spk-cream`. Bakgrunn for **partalls**-kort (`isEven`), admin-stat-kort og hover-tilstand på skjemavalg. Gir varme og rad-rytme.
- **Clean Stage White** (`#FFFFFF`) — `--foreground` brukt som flate. Bakgrunn for **oddetalls**-kort, standardkort (`spk-card`), modaler og skjemaflater.

### Aksent og spesielle hendelser (solide flater)
- **Celebration Gold** (`#FFC107`) — `--spk-gold`. Primærknapp (`spk-btn-primary`), House of Nerds-høydepunktskort (`spk-card-highlight-gold`), "Nå"-ring rundt aktivt kort (`ring-spk-gold/50`), suksess-tilstand og favoritt-teller-badge. **Solid flate, ikke overlay.**
- **Starlight Yellow** (`#FFD700`) — `--spk-gold-bright`. Lysere gull til hover på primærknapp og hover-farge på favoritt-stjerne (`hover:text-spk-gold-bright`).
- **Coral Stage Accent** (`#F87171`) — `--spk-coral`. Middags-høydepunktskort (`spk-card-highlight-coral`), rom-pill for "Pokalen", og feiltekst på mørk bakgrunn. **Solid flate.**
- **Strike-through Red** (`#D32F2F`) — `--spk-red`. Feiltekst (`spk-form-error`, `spk-alert-error`) og kritiske aksenter.

### Tekst på lyse flater
- **Ink Navy Text** (`#001B3D`) — `--spk-text-on-light`. Titler og primærtekst på krem/hvit/gull/korall. Sikrer ≥ WCAG AA også på mettede høydepunktsflater.
- **Muted Ink Navy** (`#002952`) — `--spk-text-on-light-muted`. Sekundærtekst, hjelpetekst og metadata på lyse flater. **Bruk denne, ikke `navy/50` eller `navy/70`.**
- **Slate Star Empty** (`#4A6278`) — `--spk-star-empty`. Inaktive stjerner, placeholders og disabled tekst på hvit/krem (≥ 3:1 for UI-komponenter).

### Systemtilstander
- **Soft Error Rose** (`#FCE8E8`) — `--spk-error-bg`. Opaque feilmelding-bakgrunn (aldri gjennomsiktig rød over navy).
- **Pure White Text** (`#FFFFFF`) — `--foreground`. Tekst på alle mørke flater, header-navigasjon og pill-merker på navy.

---

## 3. Typography Rules

**Fontfamilie:** **Geist Sans** for all UI-tekst (`--font-sans` → `--font-geist-sans`), med **Geist Mono** (`--font-mono`) reservert for ev. monospace/teknisk bruk. Geist er en moderne, geometrisk-humanistisk sans-serif med ren, nøytral karakter — passer den profesjonelle, plakat-tunge tonen. Fallback-stack: `Arial, Helvetica, sans-serif`.

### Hierarki og vekter
- **Programtittel / event-header:** Tyngste vekt (`font-bold`→`font-black`), hvit på navy. Kan ha linjebryt og rød strikethrough (`#D32F2F`) på erstattet tekst.
- **Seksjonsbarer ("Nå pågår" / "Kommende" / "Ferdig"):** `font-bold`, hvit tekst på Deep Poster Navy, sentrert, `text-lg` → `sm:text-xl`.
- **Sesjonstitler (kort-`h3`):** `font-bold`, `text-base` → `sm:text-lg`, Ink Navy på lyse flater. `break-words` for lange titler.
- **Tid-stempel:** `font-bold`, `text-sm` → `sm:text-base`, Ink Navy. Står øverst i kortet før tittel.
- **Foredragsholder-linje:** `text-sm`; label "Foredragsholder:" i `font-semibold`, selve navnet i normal vekt. Muted Ink Navy på standardkort, `spk-text-on-light-muted` på høydepunktskort.
- **Metadata / rom-merker:** `text-xs`, `font-semibold`, vist som **pill-formede merker** (se §4).
- **Brødtekst / beskrivelse:** Normal vekt, `text-sm`, god lesbarhet. På gull/korall: **alltid** Ink Navy (`#001B3D`) — aldri halvgjennomsiktig tekst.
- **Knappetekst:** `font-medium`→`font-semibold`, `text-sm`.

### Prinsipper
- På mørke flater: ren hvit (`#FFFFFF`) eller `text-white/90` for sekundær header-tekst.
- På lyse flater: bruk de eksplisitte token-fargene for tekst (Ink/Muted Ink), **ikke** opacity-baserte navy-toner, av kontrasthensyn.
- Linjehøyde følger Tailwind-standard; tetthet styres av `gap`/`mb-2` mellom tekstblokker, ikke av løs linjeavstand.

---

## 4. Component Stylings

### Buttons
- **Primær (`spk-btn-primary`):** Avrundede hjørner (`rounded-lg`), **Celebration Gold** (`#FFC107`) bakgrunn med Ink Navy tekst, `font-semibold`, hover → **Starlight Yellow** (`#FFD700`). Disabled bruker **eksplisitte** farger (krem bakgrunn + Slate Star Empty tekst), **aldri** `opacity-50`.
- **Sekundær (`spk-btn-secondary`):** Transparent med hvit kant (`border-white/30`) på navy, hvit tekst, hover `bg-white/10`. Brukt i header/navigasjon.
- **Ikon-knapper (favoritt/tilbakemelding i kort):** Sirkulær favoritt-knapp (`rounded-full`, 44×44 px minimum), avrundet tilbakemeldings-knapp (`rounded-lg`). Hover gir lett navy-tint (`hover:bg-spk-navy/5`, eller `/10` på høydepunktskort).

### Cards / Containers
- **Hjørner:** Generøst avrundet — `rounded-xl` (≈12 px) gjennomgående. Dette er **kort-signaturen** og skal bevares.
- **Standardkort (`default`):** Veksler **Warm Agenda Cream** (partall) og **Clean Stage White** (oddetall), tynn kant `border-spk-navy/10`, padding `p-3` → `sm:p-4`.
- **Dybde:** Flat i hvile (ingen/`shadow-sm`), løftes til `hover:shadow-md`. Plakat-inspirert, ikke "material elevation".
- **Aktivt kort ("Nå"):** Gull ramme + `ring-2 ring-spk-gold/50`.
- **Fullført kort:** Dempet `opacity-70`.
- **Høydepunktskort:**
  - **House of Nerds** → `spk-card-highlight-gold`: **solid** Celebration Gold (`#FFC107`), `border-2 border-spk-navy/20`.
  - **Middag** → `spk-card-highlight-coral`: **solid** Coral Stage Accent (`#F87171`), `border-2 border-spk-navy/20`.
  - Begge bruker Ink Navy titler + Muted Ink sekundærtekst for WCAG AA. **Aldri** halvgjennomsiktige høydepunktsflater (f.eks. `gold/20`) over navy.
- **Pause/lunsj-kort (`break`):** Fullbredde **Deep Poster Navy**-felt med hvit sentrert tekst — som "Pause"/"Lunsj" i programmet. (Disse skal **ikke** ha foredragsholderbilde.)

### Rom-merker (Badges)
- Pill-formet (`rounded-full`), `px-2.5 py-0.5`, `text-xs font-semibold`.
- **Scenen** → navy (`#001B3D`) flate, hvit tekst.
- **Pokalen** → coral (`#F87171`) flate, hvit tekst.
- **Andre rom** → Deep Poster Navy flate, hvit tekst.
- På høydepunktskort: navy pill + hvit tekst for maks kontrast mot gull/korall.
- **"Nå"-chip:** `rounded-full`, navy flate, hvit `font-bold text-xs`.

### Inputs / Forms
- **Flate (`spk-form-surface`):** Opaque hvit, `rounded-xl`, kant `border-spk-navy/15`, `shadow-sm`.
- **Input (`spk-form-input`):** Hvit bakgrunn, `rounded-lg`, kant `border-spk-navy/25`, Ink Navy tekst, placeholder i Slate Star Empty. Focus: gull kant + `ring-2 ring-spk-gold/40`.
- **Label (`spk-form-label`):** `text-sm font-semibold`, Ink Navy.
- **Valg-kort (`spk-form-choice`):** `rounded-xl`, `border-2`, min 80×90 px touch-mål; valgt tilstand = navy kant + gull flate + ring.
- **Feil (`spk-form-error` / `spk-alert-error`):** Strike-through Red tekst på Soft Error Rose bakgrunn — aldri korall tekst på transparent rød over navy.
- **Suksess (`spk-form-success`):** Solid Celebration Gold flate, **ikke** `gold/20`.

---

## 5. Layout Principles

### Grid & struktur
- **Bakgrunn:** Hele appen hviler på Midnight Event Navy (`spk-page`).
- **Container:** Innhold sentreres i `max-w-4xl` (`spk-main`, `spk-header-inner`, `spk-footer`) med `px-3 py-6` → `sm:px-4 sm:py-8`. Selv om appen er mobil-først, gir 4xl-bredden komfortabel lesing på desktop.
- **Agenda:** Kort stablet vertikalt med `space-y-3` → `sm:space-y-4`; seksjoner skilt med `space-y-6` → `sm:space-y-8`.
- **Kort-intern layout (kritisk for §6):** Hvert sesjonskort er en flex-beholder:
  ```
  flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
  ├── Tekstkolonne:  min-w-0 flex-1   (tid, tittel, foredragsholder, rom-pill, beskrivelse)
  └── Handlingskolonne: flex flex-row gap-2 sm:flex-col sm:shrink-0 (favoritt + tilbakemelding)
  ```
  På mobil stables tekst over knapper; på `sm`+ ligger tekst til venstre og knapper i en høyre kolonne. `min-w-0 flex-1` på tekstkolonnen er bevisst, slik at lange ord/titler kan `break-words` uten å sprenge layouten.

### Whitespace
- Romslig, men kompakt padding i kort (`p-3`/`sm:p-4`), `mb-2` mellom interne tekstblokker, `gap-2`/`gap-4` i flex-radene.
- Mobil-først: alle størrelser starter små og skaleres opp ved `sm:` (640 px). Det finnes ingen `md/lg`-spesifikke regler i kortet — `sm` er hovedbruddpunktet.

### Header / footer / dekorasjon
- **Header:** Sticky, semi-transparent Deep Poster Navy + `backdrop-blur-sm`, `border-b border-white/10`. Nav-lenker er pill-formede (`rounded-full`) med 44×44 px minimum.
- **Footer:** SPK-logo/tekst sentrert i `max-w-4xl`.
- **Dekorasjon:** Sparsom emoji/illustrasjon (🎪 🚀 ⭐) i header — lekent, ikke overveldende.

### Tilgjengelighet & kontrast (gjelder hele systemet)
- **Aldri** semi-transparente høydepunktsbakgrunner (`gold/20`, `coral/20`) på mørk side — teksten blir uleselig.
- Gull/korall-kort: solid flate + Ink Navy titler (`#001B3D`) + Muted Ink sekundærtekst (`#002952`).
- Sekundærtekst bruker `#002952`, **ikke** `navy/50`/`navy/70`.
- Inaktive UI-elementer (stjerner) bruker `#4A6278` (≥ 3:1), ikke `navy/20`.
- Touch-mål: minimum 44×44 px på alt interaktivt (WCAG 2.5.5).
- Mål: **WCAG 2.1 AA** (4.5:1 normal tekst, 3:1 stor tekst/UI).

---

## 6. Foredragsholderbilder (Speaker Avatars) — Responsiv spesifikasjon

> **Mål:** Legge til foredragsholderbilder i sesjonskortene uten å bryte eksisterende layout, med uniform visning uavhengig av kildebildets dimensjoner, og korrekt responsiv skalering etter brukerens skjerm. Bildene er **et visuelt supplement** til den eksisterende "Foredragsholder:"-teksten — aldri eneste informasjonsbærer.

### 6.1 Visuell form og plassering i kortet
- **Form:** Sirkulær avatar — `rounded-full` med `overflow-hidden`. Sirkelen er rolig, gjenkjennelig som "person", og skjuler elegant at kildene har ulikt sideforhold.
- **Ramme:** Hårfin ring som matcher kort-kantene: `border border-spk-navy/10` (eller `ring-1 ring-spk-navy/10`). På **høydepunktskort** (gull/korall) brukes `border-spk-navy/20` for å holde avataren tydelig adskilt fra den mettede flaten.
- **Plassering — anbefalt:** **I toppen av tekstkolonnen**, på samme rad som tid-stempelet, som et lite ledende element *inne i* `min-w-0 flex-1`-kolonnen. Dette holder avataren langt unna den høyre handlingskolonnen (favoritt + tilbakemelding) og kolliderer ikke med 44×44-knappene.
  - Konkret mønster (uten å endre den ytre `sm:flex-row sm:justify-between`-strukturen): wrap tid + avatar i en liten flex-rad øverst, eller legg avataren som første barn i tekstkolonnen med `float`/flex ved siden av tittelblokken.
  - **Viktig:** Avataren skal **ikke** plasseres i den høyre `flex-row gap-2 sm:flex-col sm:shrink-0`-kolonnen — den er reservert for favoritt/tilbakemelding og må beholde sine touch-mål.
- **Ikke-kollisjon med `min-w-0 flex-1`:** Avataren får alltid `shrink-0` (fast størrelse) slik at den ikke presser eller kollapser teksten, mens tittel/beskrivelse beholder `min-w-0` + `break-words`.

### 6.2 Eksakte responsive størrelser (mobil-først + `sm:`)
Avataren skal være **kompakt** for å matche kortets tetthet og aldri dominere. Anbefalte verdier:

| Kontekst | Mobil (default) | `sm:` (≥640 px) | Tailwind-klasser |
|---|---|---|---|
| **Standard sesjonskort** | 48×48 px | 64×64 px | `h-12 w-12 sm:h-16 sm:w-16` |
| **Flere personer (stack)** | 40×40 px pr. avatar | 48×48 px pr. avatar | `h-10 w-10 sm:h-12 sm:w-12` |

- Felles klasser på avatar-wrapperen: `relative shrink-0 overflow-hidden rounded-full border border-spk-navy/10`.
- 48 px mobilstørrelse er bevisst mindre enn 44×44-touchmålet for *interaktive* elementer fordi avataren er **dekorativ/ikke-klikkbar** — den trenger ikke å være et touch-mål.
- Skaleringen styres utelukkende av Tailwind-bruddpunktet `sm:` (samme bruddpunkt som resten av kortet), så avataren vokser i takt med at kortet går fra mobil til bredere layout.

### 6.3 Uniform håndtering av varierende kildedimensjoner
Bildene varierer kraftig (Ingrid.jpeg ~7 KB til Harald.png ~2 MB; portrett, kvadrat, ulike oppløsninger). For **helt uniform** visning:
- **Kvadratisk visningsflate:** wrapperen er kvadratisk via like `h-*`/`w-*` (se tabell) → garantert 1:1 sirkel uansett kilde.
- **`object-cover`** på selve bildet: fyller sirkelen og beskjærer overflødig kant i stedet for å strekke. Kombinert med `object-center` (eller fokus-justert posisjon ved behov) for å holde ansiktet sentrert.
- **`overflow-hidden` + `rounded-full`** på wrapperen klipper bildet til sirkel.
- **Aldri** sett bredde/høyde uavhengig på `<img>` uten `object-cover` — det gir forvrengning. Forholdstall låses av containeren, ikke av kilden.

### 6.4 Anbefalt: Next.js `<Image>` (ikke `<img>`)
Bruk **`next/image`** for automatisk responsiv optimalisering — kritisk fordi store kilder (Harald.png ~2 MB, Janne.png ~800 KB, Sofie.png ~780 KB) **ikke** skal lastes i full oppløsning på en mobilskjerm.

- **Mønster — `fill` + sized container (anbefalt for sirkel-avatar):**
  ```tsx
  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-spk-navy/10 sm:h-16 sm:w-16">
    <Image
      src="/speakers/harald.png"
      alt="Harald Eia"
      fill
      sizes="(min-width: 640px) 64px, 48px"
      className="object-cover object-center"
    />
  </div>
  ```
- **Alternativ — eksplisitt `width`/`height`:** `width={64} height={64}` + `className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover"`. `fill`-varianten foretrekkes fordi den lar containeren styre den responsive størrelsen rent.
- **`sizes`-attributt:** Oppgi de faktiske rendrede pikselstørrelsene slik at Next velger riktig kildebredde: `sizes="(min-width: 640px) 64px, 48px"`. Dette hindrer overlevering av piksler på mobil.
- **`quality`:** standard (75) holder for små avatarer; sett ev. `quality={70}` for å trimme ytterligere.
- **Lazy-loading:** `next/image` er lazy som standard — passer fint siden de fleste kortene er under fold.

### 6.5 Bildeplassering og format for implementering
- **Plassering:** Kopier bildene til **`/public/speakers/`** (f.eks. `/public/speakers/harald.png`). Lokale filer under `public/` serveres statisk og refereres med rot-relativ sti (`/speakers/...`).
- **`next.config.ts`:** **Ingen** `images.remotePatterns` trengs — bildene er lokale, ikke fjern-URLer. Konfigurasjonen kan stå urørt.
- **Filnavn-konvensjon (anbefalt):** små bokstaver, ingen mellomrom, konsistent: `janhenrik.jpg`, `louis.png`, `sofie.png`, `kjetil.jpeg`, `jawad.jpeg`, `triera.png`, `ingrid.jpeg`, `erik.png`, `simon.png`, `harald.png`, `therese.png`, `janne.png`. (Selve kopieringen/omdøpingen gjøres i implementeringssteget — *ikke* nå.)
- **Mapping `session.speaker` → fil (fra `prisma/seed.ts`):**

  | `session.speaker` | Bildefil | Merknad |
  |---|---|---|
  | Jan Henrik Gudelsby | `/speakers/janhenrik.jpg` | |
  | Louis Maurice Dieffenthaler | `/speakers/louis.png` | |
  | Sofie Staal | `/speakers/sofie.png` | |
  | Kjetil Hårtveit | `/speakers/kjetil.jpeg` | |
  | Therese, Knut og Janne | `/speakers/therese.png` + `/speakers/janne.png` | Knut mangler bilde → se §6.7 |
  | Jawad Saleemi | `/speakers/jawad.jpeg` | |
  | Triera Gashi | `/speakers/triera.png` | |
  | Ingrid Fosså | `/speakers/ingrid.jpeg` | |
  | Erik Andreas Klokk | `/speakers/erik.png` | |
  | Simon Kavanagh | `/speakers/simon.png` | |
  | Harald Eia | `/speakers/harald.png` | Stor kilde (~2 MB) → `next/image` obligatorisk |
  | Solveig | — | Ingen bilde → fallback (§6.7) |

  Ubrukt: `Halvor.png` finnes, men ingen "Halvor" i seed. Sesjoner uten `speaker` (oppmøte, pauser, House of Nerds, middag) får **ingen** avatar.

### 6.6 Anbefalt mapping-mekanisme (lettvekts, ingen DB-endring)
Bygg en ren oppslagstabell `speaker → bildesti` i en liten hjelpefil (f.eks. `lib/speaker-images.ts`), nøklet på den eksakte `session.speaker`-strengen. Dette unngår skjemaendring i Prisma og holder seed-data uberørt. Returner `null`/`undefined` når navnet ikke finnes → trigger fallback.

### 6.7 Fallback når bilde mangler — **anbefalt strategi**
**Anbefaling: initial-basert plassholder i SPK-farger** (ikke "skjul helt"), slik at kort beholder en konsistent venstrekant-rytme og foredragsholdere uten bilde ikke ser "ødelagte" ut.

- **Plassholder-design:** samme sirkulære wrapper og størrelser som et ekte bilde, men med solid flate og initialer:
  ```tsx
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                  border border-spk-navy/10 bg-spk-navy text-sm font-bold text-white
                  sm:h-16 sm:w-16 sm:text-base"
       aria-hidden="true">
    SK            {/* initialer fra navnet, f.eks. "Solveig" → "S" */}
  </div>
  ```
  - Bruk **Midnight Event Navy** (`#001B3D`) flate + hvit tekst på standardkort. På gull/korall-høydepunktskort fungerer navy-flaten fortsatt (god kontrast).
- **Spesialtilfeller:**
  - **Solveig** (Velkommen/Avslutning): initial-plassholder "S".
  - **Knut** i "Therese, Knut og Janne": har ikke eget bilde — vis Therese + Janne som ekte avatarer i stacken, og *enten* dropp Knut *eller* legg en initial-plassholder "K" som tredje element i stacken. **Anbefalt: dropp Knut-plassholderen** og vis kun de to faktiske bildene for å holde stacken ren (navnene står uansett i "Foredragsholder:"-teksten).
  - **Sesjoner helt uten `speaker`** (pauser, oppmøte, House of Nerds, middag): **ingen** avatar i det hele tatt — `break`-kort har sin egen fullbredde-stil og skal ikke endres.

### 6.8 Flere personer i én sesjon ("Therese, Knut og Janne")
**Anbefaling: overlappende avatar-stack, maks 2–3 synlige, holdt enkelt.**
- Render en liten flex-rad der hver avatar etter den første trekkes inn med negativ margin og får en hvit/krem ring som skiller dem:
  ```tsx
  <div className="flex shrink-0 -space-x-3">
    {/* Therese */} <Avatar ... className="... ring-2 ring-white" />
    {/* Janne   */} <Avatar ... className="... ring-2 ring-white" />
  </div>
  ```
- Bruk den **mindre** avatar-størrelsen for stacken (`h-10 w-10 sm:h-12 sm:w-12`) så raden ikke blir for tung.
- Knut (uten bilde) utelates fra stacken (jf. §6.7). Den fulle deltakerlisten leses uansett i tekstlinjen "Foredragsholder: Therese, Knut og Janne".
- Hold det enkelt: **ikke** bygg "+N"-bobler eller tooltips for dette enkeltstående tilfellet.

### 6.9 Tilgjengelighet (WCAG)
- **`alt`-tekst:** Sett meningsfull `alt` = foredragsholderens navn (f.eks. `alt="Harald Eia"`). For stacker: én `alt` pr. avatar med vedkommendes navn.
- **Supplement, ikke erstatning:** Avataren er et visuelt tillegg til den eksisterende "Foredragsholder:"-teksten i `SessionCard.tsx`. Teksten beholdes som primær informasjonsbærer (skjermlesere og lav-bilde-tilstand fungerer uansett).
- **Dekorativ plassholder:** Initial-plassholderen markeres `aria-hidden="true"` (navnet finnes i teksten), så skjermlesere ikke leser opp løsrevne initialer.
- **Kontrast:** Ringen/kanten (`border-spk-navy/10`–`/20`) er kun strukturell dekor og trenger ikke møte tekstkontrast, men plassholderens hvite tekst på navy oppfyller AA.

### 6.10 Do / Don't

**Do**
- ✅ Behold `rounded-xl` på selve kortet og `rounded-full` på avataren.
- ✅ Bruk `object-cover` + kvadratisk container for uniform 1:1-visning uansett kilde.
- ✅ Bruk `next/image` med `fill` + `sizes="(min-width: 640px) 64px, 48px"` for responsiv nedlasting.
- ✅ Hold avataren `shrink-0` og *inne i* tekstkolonnen, adskilt fra favoritt/tilbakemeldings-knappene.
- ✅ Behold "Foredragsholder:"-teksten som primær informasjon.
- ✅ Bruk navy-plassholder med initialer når bilde mangler.

**Don't**
- ❌ Ikke strekk bilder (aldri sett `width`/`height` uten `object-cover`).
- ❌ Ikke la avataren dominere kortet — hold deg til 48/64 px (mobil/sm), ikke større.
- ❌ Ikke legg avataren i den høyre handlingskolonnen — den kolliderer da med 44×44-knappene.
- ❌ Ikke gi `break`-kort (Pause/Lunsj) eller sesjoner uten `speaker` en avatar.
- ❌ Ikke last full-oppløsnings-PNG (Harald ~2 MB) med rå `<img>` på mobil.
- ❌ Ikke bryt kontrasten på gull/korall-kort — bruk navy ring/plassholder, ikke lyse semi-transparente flater.
- ❌ Ikke bryt `min-w-0 flex-1` på tekstkolonnen (det vil ødelegge `break-words` på lange titler).
