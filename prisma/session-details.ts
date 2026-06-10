/**
 * Utvidet innhold for detaljvisningen av sesjoner, nøklet på eksakt tittel
 * (samme tittel som i seed/databasen).
 *
 * - `longDescription`: utfyllende tekst som kun vises i detaljvisningen
 *   (kortet viser fortsatt `description`).
 * - `images`: stier til bilder i `public/sessions/`, f.eks. "/sessions/keynote-1.jpg".
 *
 * Brukes både av `prisma/seed.ts` (ferske miljøer) og
 * `scripts/update-session-details.ts` (oppdatering av eksisterende database
 * uten å slette innsamlet feedback).
 */
export interface SessionDetails {
  longDescription?: string;
  images?: string[];
}

export const SESSION_DETAILS: Record<string, SessionDetails> = {
  // Eksempel:
  // "Det store vi": {
  //   longDescription:
  //     "Harald Eia tar oss med på en reise i hva som skaper fellesskap...",
  //   images: ["/sessions/det-store-vi-1.jpg"],
  // },
  "Oppmøte Vulkanarena": {
    longDescription:
    "Kaffe og snacks før vi starter",
    images: ["/venue/scenen.jpg"],
  },
  "Velkommen": {
    longDescription:
    "Velkommen til inspirasjonsdagen",
    images: ["/venue/scenen.jpg"],
  },
  "Fra ChatGPT til personlig agent": {
    longDescription:
    "Hvordan jeg bygget min Hermes, og hva det gjør med måten jeg jobber på.",
    images: ["/venue/scenen.jpg"],
  },
  "Nav - dataplattform": {
    longDescription:
    "Foredrag om NAV sin dataplattform",
    images: ["/venue/scenen.jpg"],
  },
  "Verdidrevet AI utvikling": {
    longDescription:
    "Jawad sitter som direktør for AI & Cloud hos Telenor Group. Hans arbeid er rundt hvordan AI kan transformere brukeropplevelse, forbedre nettverkintelligense og drive med smart produktutvikling.",
    images: ["/venue/scenen.jpg"],
  },
  "Funksjonell programmering": {
    longDescription:
    "Hva er funksjonell programmering, og hva vil det si at man faktisk programmerer funksjonelt og hvordan kan en gjøre noen ting i backend mer funksjonelt for å f.eks. teste på en enklere måte...",
    images: ["/venue/scenen.jpg"],
  },
  "px vs em": {
    longDescription:
    "Hva er lureste, px eller em? Og hva er forskjellen?",
    images: ["/venue/pokalen.jpg"],
  },
  "Om svelte": {
    longDescription:
    "Hva er greia med Svelte og hvorfor bør vi bruke det?",
    images: ["/venue/scenen.jpg"],
  },
  "Bruke AI for å bry oss om brukeropplevelse?": {
    longDescription:
    "We are going hardcore with using AI to get developers to care about UX",
    images: ["/venue/pokalen.jpg"],
  },
  "Koding og brukeropplevelse i AI-eraen": {
    longDescription:
        "AI revolusjonerer måten vi skriver kode og bygger løsninger på – vi får mer gjort, raskere enn noen gang. Men AI er i bunn og grunn en avansert auto-complete som gjetter seg til neste ord; den bruker ikke applikasjonen din som et menneske. Den kjenner ikke hvordan det føles å klikke seg gjennom et skjema, navigere en meny eller tolke en fargepalett. Noen hevder frontend er det første AI kan erstatte, men jeg mener det motsatte: nettopp fordi brukeropplevelse handler om menneskelig opplevelse, er det noe av det siste vi bør overlate helt til maskiner. Alt som er relatert til mennesker bør involvere mennesker.<br><br>I dette innlegget deler jeg erfaringer fra egen hverdag der mesteparten av koden nå genereres av AI, og diskuterer balansen mellom produktivitet og kvalitet. «With great power comes great responsibility» – vi står fortsatt ansvarlige for det vi lager, enten koden er håndskrevet eller generert. Jeg ser på hva AI er fantastisk til (idémyldring, kodegenerering, sparring), og hvor mennesket fortsatt er uunnværlig: å sikre at løsningene er behagelige, tilgjengelige og fungerer for ekte brukere med ulik bakgrunn, kontekst og behov. Bruk AI for alt det er verdt, men ikke glem å faktisk teste hvordan løsningen oppleves – de grunnleggende prinsippene for god brukeropplevelse gjelder fortsatt.",
    images: ["/venue/scenen.jpg"],
  },
  "Faen ta metodikken din": {
    longDescription:
    "Er det ikke litt rart at alle produkter og tjenester vi lager ikke er jævlig bra? Når vi har pitcha Triple Diamond til prosjekteier, kjørt Google Design Sprint 5 ganger, høytidelig avholder seremonier som sprintplanning, retros, backlog grooming og kjører daglige standups før halve teamet engang har våknet, har teamcoach, teamlead, scrummaster, smidig-coach, produktledere, produkteiere, anvendte Jobs to be Done, lagde ti value proposition canvases med key stakeholders som aldri har sett en postit-lapp i andre farger enn gult, mens vi følger selskapets 12 kjerneverdier, er modig, smidig, spretten og fiffig, og følgelig implementerer alle nye metodikker vi kommer over. Når kan metodikk være nyttig, og hva er det metodikk IKKE løser? Kritisk tenkning & faglig dømmekraft har aldri vært viktigere",
    images: ["/venue/pokalen.jpg"],
  },
  "Når team tar ansvar for verdi - ikke bare leveranser": {
    longDescription:
    "Mange team utvikler løsninger, færre får rom til å skape reell verdi. Knut, Therese og Janne deler erfaring fra SPK om hvordan tverrfaglige produktteam, riktige styringsrammer og gode designprosesser kan gi mer samfunnsnytte.",
    images: ["/venue/scenen.jpg"],
  },
  "Luuuuuunsj": {
    longDescription:
    "Lunsjen serveres i 2.etg på sceneområdet",
    images: ["/venue/scenen.jpg"],
  },
  "Pause": {
    longDescription:
    "Ta deg en bolle og slikk litt sol",
    images: ["/venue/scenen.jpg"],
  },
  "Det store vi": {
    longDescription:
    "Alle ønsker mer samhold , mer fellesskapsfølelse, mer team ; men hvordan skapes den gode følelsen av å høre til?",
    images: ["/venue/scenen.jpg"],
  },
  "Avslutning": {
    longDescription:
    "Vi runder av dagen",
    images: ["/venue/scenen.jpg"],
  },
  "House of nerds": {
    longDescription:
    "Vi gamer på House of nerds",
    images: ["/venue/house-of-nerds.jpg"],
  },
  "Middag": {
    longDescription:
    "Vi møter opp tilbake på Vulkanarena og spiser middag på scenen 2.etg",
    images: ["/venue/scenen.jpg"],
  },
};
