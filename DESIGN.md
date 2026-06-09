# Design System: SPK Inspirasjonsdag
**Project ID:** julefagdag-app (basert på offisielle plakater og program)

## 1. Visual Theme & Atmosphere

Et **corporate-playful** visuelt språk: mørk, profesjonell navy-bakgrunn som ramme, kombinert med lyse, varme innholdsflater og lekne 3D-inspirerte ikoner (sirkustelt, rakett, stjerner, popcorn). Layouten er luftig og mobil-først, med tydelig hierarki som speiler programplakaten — store, tunge overskrifter på mørk bakgrunn, og en strukturert agenda-tabell som kortbasert innhold i appen.

Stemningen er festlig og energisk uten å miste SPKs profesjonelle identitet. Kontrast er høy: hvit tekst mot dyp navy, mørk tekst mot krem/hvit. Avvik fra standard «grå SaaS»-estetikk; farger brukes bevisst for rom, status og spesielle hendelser.

## 2. Color Palette & Roles

| Beskrivelse | Hex | Rolle |
|---|---|---|
| **Midnight Event Navy** | `#001B3D` | Primær sidebakgrunn og pause-/seksjonsfelt |
| **Deep Poster Navy** | `#051635` | Header, mørke skillelinjer og dypere lag |
| **Warm Agenda Cream** | `#FFF5E1` | Vekslande rad/kort-bakgrunn (partall) |
| **Clean Stage White** | `#FFFFFF` | Vekslande rad/kort-bakgrunn (oddetall), kort og modaler |
| **Celebration Gold** | `#FFC107` | House of Nerds-rader, «Nå»-status og høydepunkter (solid flate) |
| **Starlight Yellow** | `#FFD700` | Favoritt-ikon, dekorative accenter |
| **Coral Stage Accent** | `#F87171` | Middags-rader og Pokalen-rom (solid flate) |
| **Strike-through Red** | `#D32F2F` | Strikethrough, viktige accenter, feilmeldinger |
| **Ink Navy Text** | `#001B3D` | Titler og brødtekst på lyse/gull/korall flater (min. WCAG AA) |
| **Muted Ink Navy** | `#002952` | Sekundærtekst, hjelpetekst og metadata på lyse flater |
| **Slate Star Empty** | `#4A6278` | Inaktive stjerner, placeholders og disabled tekst på hvit/krem |
| **Soft Error Rose** | `#FCE8E8` | Feilmelding-bakgrunn (opaque, ikke gjennomsiktig rød) |
| **Pure White Text** | `#FFFFFF` | Tekst på mørk bakgrunn, header og pill-knapper |

## 3. Typography Rules

- **Fontfamilie:** Geometrisk sans-serif (Geist Sans / Helvetica-lignende), tung vekt for overskrifter.
- **Overskrifter:** `font-bold` til `font-black`, hvit på navy. Programtittel kan ha linjebryt og rød strikethrough på erstattet tekst.
- **Sesjonstitler:** Fet, mørk navy på lyse kort — speiler programtabellens «Foredragsholder»-linjer.
- **Metadata (tid, rom):** Medium vekt for etiketter, normal for verdier; rom vises som **pill-formede merker**.
- **Brødtekst:** Normal vekt, god lesbarhet på krem/hvit bakgrunn. På gull/korall-flater: alltid mørk navy (`#001B3D`), aldri halvgjennomsiktig tekst.

## 4. Component Stylings

* **Buttons (primær):** Pill-formet eller avrundede hjørner (`rounded-lg`/`rounded-full`), Celebration Gold bakgrunn med mørk tekst, hover lysere gull.
* **Buttons (sekundær):** Transparent/hvit kant på navy, hvit tekst — brukt i header-navigasjon.
* **Cards/Containers:** Generøst avrundede hjørner (`rounded-xl`), krem/hvit veksling, tynn mørk kant (`border-spk-navy/10`). Ingen tunge skygger — flat, plakat-inspirert look med lett `shadow-sm` på hover.
* **Highlight-kort (House of Nerds / Middag):** **Solide** gull- (`#FFC107`) eller korall-bakgrunner (`#F87171`) — ikke gjennomsiktige overlays. Speiler programplakatens mettede rader. Mørk navy-tekst for WCAG AA (min. 4.5:1).
* **Rom-pills:** Pill-formet (`rounded-full`), navy for Scenen, Coral for Pokalen. På highlight-kort: navy pill med hvit tekst for maks kontrast.
* **Pause/skjema-rader:** Fullbredde navy-felt med hvit sentrert tekst — som «Pause» og «Lunsjpause» i programmet.
* **Seksjonsoverskrifter:** Navy bar med hvit fet tekst, avrundede ender.
* **Inputs/Forms:** Hvit bakgrunn, navy kant (`border-spk-navy/25`), gold focus-ring. Placeholders i Slate Star Empty. Feil: Soft Error Rose bakgrunn + Strike-through Red tekst.

## 5. Layout Principles

- **Bakgrunn:** Hele appen hviler på Midnight Event Navy; innhold i `max-w-4xl` sentrert kolonne.
- **Agenda:** Kort stablet vertikalt med vekslende krem/hvit — speiler programtabellens rader.
- **Whitespace:** Romslig padding i kort (`p-4`), tydelig `gap` mellom seksjoner.
- **Header:** Sticky, semi-transparent Deep Poster Navy med blur; SPK-logo/tekst i footer på hovedsiden.
- **Dekorasjon:** Sparsomme emoji/illustrasjoner (🎪 🚀 ⭐) i header — lekent, ikke overveldende.
- **Status:** Gull ramme/bakgrunn for «Nå», dempet opacity for «Ferdig».

## 6. Accessibility & Contrast

- **Aldri semi-transparente highlight-bakgrunner** (f.eks. `gold/20`) på mørk sidebakgrunn — teksten blir uleselig.
- **Gull/korall-kort:** solid flate + `#001B3D` titler, `#002952` sekundærtekst.
- **Skjemaer:** Alltid opaque hvit/krem/gull flate. Suksessmeldinger bruker solid `#FFC107`, ikke `gold/20`.
- **Stjerner (inaktive):** `#4A6278` på hvit — min. 3:1 for UI-komponenter. Aldri `navy/20`.
- **Sekundærtekst:** bruk `#002952`, ikke `navy/50` eller `navy/70`.
- **Feilmeldinger:** `#D32F2F` tekst på `#FCE8E8` bakgrunn — aldri korall tekst på transparent rød over navy.
- **Minimum:** WCAG 2.1 AA (4.5:1 normal tekst, 3:1 stor tekst/UI).
- **Unngå:** `opacity-50` på primærknapper — bruk explicit disabled-farger i stedet.
