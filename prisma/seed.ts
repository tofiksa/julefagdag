import { PrismaClient } from "@prisma/client";
import { SESSION_DETAILS } from "./session-details";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.feedback.deleteMany();
  await prisma.session.deleteMany();

  // Create sessions based on Julefagdag 2025 agenda
  const sessions = [
    {
      title: "Oppmøte Vulkanarena",
      speaker: null,
      room: "Scenen 2.etg",
      startTime: new Date("2026-06-11T08:30:00"),
      endTime: new Date("2026-06-11T09:00:00"),
      description: "Kaffe og snacks før vi starter",
    },
    {
      title: "Velkommen",
      speaker: "Solveig",
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T09:00:00"),
      endTime: new Date("2026-06-11T09:15:00"),
      description: "Velkommen til inspirasjonsdagen",
    },
    {
      title: "Fra ChatGPT til personlig agent",
      speaker: "Jan Henrik Gudelsby",
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T09:15:00"),
      endTime: new Date("2026-06-11T09:45:00"),
      description:
        "Hvordan jeg bygget min Hermes, og hva det gjør med måten jeg jobber på.",
    },
    {
      title: "Nav - dataplattform",
      speaker: "Louis Maurice Dieffenthaler",
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T09:50:00"),
      endTime: new Date("2026-06-11T10:20:00"),
      description: "Foredrag om NAV sin dataplattform",
    },
    {
      title: "Pause",
      speaker: null,
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T10:20:00"),
      endTime: new Date("2026-06-11T10:40:00"),
      description: "Ta noe å spise og snakk med kolleger",
    },
    {
      title: "Faen ta metodikken din",
      speaker: "Sofie Staal",
      room: "Pokalen 1.etg (breakout)",
      startTime: new Date("2026-06-11T10:45:00"),
      endTime: new Date("2026-06-11T11:15:00"),
      description:
        "Er det ikke litt rart at alle produkter og tjenester vi lager ikke er jævlig bra? Når kan metodikk være nyttig og hva er det metodikk IKKE løser? Kritisk tenkning & faglig dømmekraft har aldri vært viktigere.",
    },
    {
      title: "Koding og brukeropplevelse i AI-eraen",
      speaker: "Kjetil Hårtveit",
      room: "Scenen 2.etg (breakout)",
      startTime: new Date("2026-06-11T10:45:00"),
      endTime: new Date("2026-06-11T11:15:00"),
      description:
        "AI revolusjonerer måten vi skriver kode og bygger løsninger på!",
      longDescription:
        "AI revolusjonerer måten vi skriver kode og bygger løsninger på – vi får mer gjort, raskere enn noen gang. Men AI er i bunn og grunn en avansert auto-complete som gjetter seg til neste ord; den bruker ikke applikasjonen din som et menneske. Den kjenner ikke hvordan det føles å klikke seg gjennom et skjema, navigere en meny eller tolke en fargepalett. Noen hevder frontend er det første AI kan erstatte, men jeg mener det motsatte: nettopp fordi brukeropplevelse handler om menneskelig opplevelse, er det noe av det siste vi bør overlate helt til maskiner. Alt som er relatert til mennesker bør involvere mennesker.<br><br>I dette innlegget deler jeg erfaringer fra egen hverdag der mesteparten av koden nå genereres av AI, og diskuterer balansen mellom produktivitet og kvalitet. «With great power comes great responsibility» – vi står fortsatt ansvarlige for det vi lager, enten koden er håndskrevet eller generert. Jeg ser på hva AI er fantastisk til (idémyldring, kodegenerering, sparring), og hvor mennesket fortsatt er uunnværlig: å sikre at løsningene er behagelige, tilgjengelige og fungerer for ekte brukere med ulik bakgrunn, kontekst og behov. Bruk AI for alt det er verdt, men ikke glem å faktisk teste hvordan løsningen oppleves – de grunnleggende prinsippene for god brukeropplevelse gjelder fortsatt.",
      images: ["/sessions/koding-og-brukeropplevelse-i-ai-eraen.jpg"],
    },
    {
      title: "Når team tar ansvar for verdi - ikke bare leveranser",
      speaker: "Therese, Knut og Janne",
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T11:20:00"),
      endTime: new Date("2026-06-11T12:00:00"),
      description:
        "Mange team utvikler løsninger, færre får rom til å skape reell verdi. Knut, Therese og Janne deler erfaring fra SPK om hvordan tverrfaglige produktteam, riktige styringsrammer og gode designprosesser kan gi mer samfunnsnytte.",
    },
    {
      title: "Luuuuuunsj",
      speaker: null,
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T12:00:00"),
      endTime: new Date("2026-06-11T13:00:00"),
      description: "Lunsjen serveres i 2.etg på sceneområdet",
    },
    {
      title: "Verdidrevet AI utvikling",
      speaker: "Jawad Saleemi",
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T13:00:00"),
      endTime: new Date("2026-06-11T13:30:00"),
      description:
        "Jawad sitter som direktør for AI & Cloud hos Telenor Group. Hans arbeid er rundt hvordan AI kan transformere brukeropplevelse, forbedre nettverkintelligense og drive med smart produktutvikling.",
    },
    {
      title: "Funksjonell programmering",
      speaker: "Triera Gashi",
      room: "Scenen 2.etg (breakout)",
      startTime: new Date("2026-06-11T13:40:00"),
      endTime: new Date("2026-06-11T14:10:00"),
      description: "En reise inn i funksjonell programmering",
    },
    {
      title: "px vs em",
      speaker: "Ingrid Fosså",
      room: "Pokalen 1.etg (breakout)",
      startTime: new Date("2026-06-11T13:40:00"),
      endTime: new Date("2026-06-11T14:10:00"),
      description: "Hva er lureste, px eller em? Og hva er forskjellen?",
    },
    {
      title: "Pause",
      speaker: null,
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T14:10:00"),
      endTime: new Date("2026-06-11T14:20:00"),
      description: "Ta deg en do pause og snakk med kolleger",
    },
    {
      title: "Om svelte",
      speaker: "Erik Andreas Klokk",
      room: "Scenen 2.etg (breakout)",
      startTime: new Date("2026-06-11T14:20:00"),
      endTime: new Date("2026-06-11T14:50:00"),
      description: "Hva er greia med Svelte og hvorfor bør vi bruke det?",
    },
    {
      title: "Bruke AI for å bry oss om brukeropplevelse?",
      speaker: "Simon Kavanagh",
      room: "Pokalen 1.etg (breakout)",
      startTime: new Date("2026-06-11T14:20:00"),
      endTime: new Date("2026-06-11T14:50:00"),
      description:
        "We are going hardcore with using AI to get developers to care about UX",
    },
    {
      title: "Pause",
      speaker: null,
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T14:50:00"),
      endTime: new Date("2026-06-11T15:10:00"),
      description: "Ta deg en bolle og slikk litt sol",
    },
    {
      title: "Det store vi",
      speaker: "Harald Eia",
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T15:10:00"),
      endTime: new Date("2026-06-11T16:10:00"),
      description:
        "Alle ønsker mer samhold , mer fellesskapsfølelse, mer team ; men hvordan skapes den gode følelsen av å høre til?",
    },
    {
      title: "Avslutning",
      speaker: "Solveig",
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T16:10:00"),
      endTime: new Date("2026-06-11T16:30:00"),
      description: "Vi runder av dagen",
    },
    {
      title: "House of nerds",
      speaker: null,
      room: "House of nerds",
      startTime: new Date("2026-06-11T16:30:00"),
      endTime: new Date("2026-06-11T18:00:00"),
      description: "Vi gamer på House of nerds",
    },
    {
      title: "Middag",
      speaker: null,
      room: "Scenen 2.etg (felles)",
      startTime: new Date("2026-06-11T18:30:00"),
      endTime: new Date("2026-06-11T21:00:00"),
      description:
        "Vi møter opp tilbake på Vulkanarena og spiser middag på scenen 2.etg",
    },
  ];

  for (const session of sessions) {
    const details = SESSION_DETAILS[session.title];

    await prisma.session.create({
      data: {
        ...session,
        longDescription: details?.longDescription ?? null,
        images: details?.images ?? [],
      },
    });
  }

  console.log(`Seeded ${sessions.length} sessions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
