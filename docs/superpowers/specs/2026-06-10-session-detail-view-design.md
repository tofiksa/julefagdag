# Design: Detaljvisning for sesjonskort

**Dato:** 2026-06-10
**Status:** Godkjent design, klar for implementasjonsplan

## Mål

Hvert faglig sesjonskort i agendaen skal kunne åpnes til en fullskjerms detaljvisning med
utfyllende tekst, bilder, kart og handlingsknapper. Åpning skjer ved trykk eller horisontal
swipe på kortet. Lukking skjer ved swipe mot høyre, tilbakeknapp øverst til venstre, eller
nettleserens tilbakeknapp.

Pauser/lunsj og logistikk-kort (`isLogisticsSession`) skal IKKE være trykkbare.

## Beslutninger tatt under brainstorming

| Tema | Beslutning |
|---|---|
| Innholdskilde | Nye felter i Prisma-skjemaet (DB) |
| Navigasjonsmodell | Fullskjerms-overlay synkronisert med URL (`?session=<id>`) |
| Åpne-gesture | Både trykk og horisontal swipe på kortet |
| Lukke-gesture | Swipe mot høyre (plattformkonvensjon) + tilbakeknapp øverst til venstre |
| Innhold i detaljvisning | Lengre beskrivelse, bilder, kart, favoritt-/tilbakemeldingsknapper |
| Omfang | Kun faglige sesjoner |
| Implementasjon | Hand-rullet touch-håndtering + CSS-transitions, ingen nye avhengigheter |

## 1. Datamodell

`Session` i `prisma/schema.prisma` utvides med:

```prisma
longDescription String?
images          String[] @default([])
```

- `longDescription`: utfyllende tekst for detaljvisningen. Kortet viser fortsatt `description`.
- `images`: stier til bilder lagret i `public/sessions/`, f.eks. `/sessions/keynote-1.jpg`.

**Migrering:** `npx prisma migrate dev --name add_session_detail_fields`.

**Innholdsflyt:**

- `prisma/seed.ts` oppdateres med de nye feltene (for ferske miljøer).
- Nytt skript `scripts/update-session-details.ts` oppdaterer eksisterende sesjoner i
  produksjon basert på tittel-match, uten å slette feedback (seed er destruktiv og skal
  ikke kjøres i prod).

**API:** `GET /api/sessions` returnerer hele modellen allerede — ingen endringer nødvendig.

## 2. Komponentarkitektur

### Nye enheter

**`components/SessionDetail.tsx`** — fullskjerms-overlay (`'use client'`).

- `role="dialog"`, `aria-modal="true"`, fokus flyttes til tilbakeknappen ved åpning.
- Innhold ovenfra og ned:
  1. Header med tilbakeknapp øverst til venstre (chevron + «Tilbake»)
  2. Tittel
  3. Tid (`formatTimeRange`) + «Nå»-badge når `getSessionStatus` er `current`
  4. Rombadge (samme stil som kortet)
  5. Foredragsholder med `SpeakerAvatars`
  6. `longDescription` (fallback: `description`)
  7. Bildegalleri — vertikalt stablet, `loading="lazy"`; bilder som mangler rendres ikke
  8. Kart — gjenbruker `getSessionMap` fra `lib/session-maps`
  9. Favoritt- og tilbakemeldingsknapper (samme handlers/tilstand som kortet)
- Props: `session`, `currentTime`, `isFavorite`, `hasSubmittedFeedback`,
  `onFavoriteToggle`, `onFeedbackClick`, `onClose`, `animateIn` (false ved deep link).

**`hooks/useSwipeGesture.ts`** — gjenbrukbar touch-hook.

- Registrerer `touchstart`/`touchmove`/`touchend`.
- Låser gesten som horisontal først når |dx| > |dy| og |dx| > ~10px (slop), ellers
  overlates hendelsen til vertikal scrolling.
- Rapporterer levende offset under draget og om terskelen ble passert ved slipp
  (distanse eller hastighet).

**`hooks/useSessionDetailParam.ts`** — leser/skriver `?session=<id>`.

- Bygger på `useSearchParams` + `useRouter`.
- `open(id)`: `router.push('?session=<id>')` (ny history-entry).
- `close()`: `router.back()` når entryen ble pushet av oss i denne økten, ellers
  `router.replace` til siden uten parameter (deep link-tilfellet).
- Deles mellom forsiden og favorittsiden.

### Endringer i eksisterende kode

**`components/SessionCard.tsx`**

- Ny prop `onOpenDetail?: (sessionId: string) => void`.
- Hele kortet blir trykkbart og keyboard-tilgjengelig (Enter/Space).
- Horisontal swipe på kortet (≥ ~60px) åpner også detaljen (via `useSwipeGesture`).
- Favoritt- og tilbakemeldingsknappene stopper propagering så de ikke åpner detaljen.
- Break-/logistikk-varianter forblir uendret (ingen `onOpenDetail` sendes inn).

**`components/AgendaList.tsx`** — tråder `onOpenDetail` gjennom til kortene
(kun for `interactive`-sesjoner).

**`app/page.tsx` og `app/favorites/page.tsx`**

- Bruker `useSessionDetailParam` og rendrer `SessionDetail` når parameteren matcher en
  sesjon i lastet state.
- Begge sider har allerede sessions-data, favoritter og feedback-handlers som gjenbrukes.

## 3. Gestures og animasjon

- **Åpne:** trykk hvor som helst på kortet (unntatt indre knapper), eller horisontal
  swipe ≥ ~60px. Detaljen glir inn fra høyre med CSS-transition (~250ms ease-out).
- **Lukke:** swipe mot høyre på detaljpanelet. Panelet følger fingeren med direkte
  `transform: translateX()` (uten transition under draget). Ved slipp:
  - forbi ~35 % av skjermbredden ELLER høy hastighet → animeres ut og lukkes
  - ellers → fjærer tilbake til utgangsposisjon med transition
- Tilbakeknappen, Escape og nettleserens tilbakeknapp lukker også.
- `prefers-reduced-motion` respekteres — da hopper visningen inn/ut uten animasjon.
- Body-scroll låses mens detaljen er åpen.

## 4. URL og navigasjon

- Parameter: `?session=<id>` på både `/` og `/favorites`.
- Åpning pusher ny history-entry → nettleser-tilbake lukker naturlig.
- Deep link med gyldig `?session=`: overlayet vises uten inn-animasjon når data er lastet.
- Ugyldig/ukjent id: parameteren ignoreres stille (agendaen vises som normalt).
- Sessions polles hvert 30. sekund; detaljen leser fra samme state og holder seg fersk.
  Forsvinner sesjonen fra datasettet, lukkes detaljen.

## 5. Feilhåndtering og kanttilfeller

- Manglende `longDescription` → fallback til `description`; mangler begge vises bare
  metadata (tid, rom, foredragsholder).
- Tomt `images`-array → galleriseksjonen rendres ikke.
- Swipe vs. scroll: gesten låses først ved tydelig horisontal intensjon (se hook-design).
- Logistikk-sesjoner: `onOpenDetail` sendes aldri inn, og deep link til en
  logistikk-sesjon ignoreres.

## 6. Testing

Prosjektet har ikke testrammeverk. Manuell verifisering i dev-server med mobilemulering:

1. Trykk på kort åpner detalj; swipe på kort åpner detalj
2. Vertikal scrolling i listen trigger ikke åpning
3. Swipe mot høyre i detaljen følger fingeren og lukker forbi terskel; fjærer ellers tilbake
4. Tilbakeknapp, Escape og nettleser-tilbake lukker
5. Deep link (`/?session=<id>`) åpner direkte; ugyldig id ignoreres
6. Favoritt og tilbakemelding fungerer inne i detaljen og speiles i listen
7. Tastatur: Tab til kort, Enter åpner, fokus havner på tilbakeknappen
8. Pause-/logistikk-kort er ikke trykkbare
