import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.feedback.deleteMany()
  await prisma.session.deleteMany()

  // Create sessions based on Julefagdag 2025 agenda
  const sessions = [
    // Test session for feedback functionality - completed session
    {
      title: '🧪 Test Foredrag - Tilbakemelding',
      speaker: 'Test Speaker',
      room: 'Test Rom',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      description: 'Dette er et test-foredrag for å teste tilbakemeldingsfunksjonaliteten. Du kan gi tilbakemelding på dette foredraget.',
    },
    {
      title: 'Lunsj',
      speaker: null,
      room: 'Sal 1 & Sal 2',
      startTime: new Date('2025-12-13T11:00:00'),
      endTime: new Date('2025-12-13T12:00:00'),
      description: 'Lunsj',
    },
    {
      title: 'Velkommen',
      speaker: 'Solveig',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T12:00:00'),
      endTime: new Date('2025-12-13T12:15:00'),
      description: 'Velkommen til Julefagdag',
    },
    {
      title: 'Google Kvante computing',
      speaker: 'Morten Hanshaugen',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T12:15:00'),
      endTime: new Date('2025-12-13T12:40:00'),
      description: 'Foredrag om Google Quantum Computing',
    },
    {
      title: 'Fremtidens arbeidsplass',
      speaker: 'Stine & Emilie',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T12:45:00'),
      endTime: new Date('2025-12-13T13:10:00'),
      description: 'Foredrag om fremtidens arbeidsplass',
    },
    {
      title: 'Pods on Mars',
      speaker: 'Vegard Hagen',
      room: 'Sal 2 (breakout)',
      startTime: new Date('2025-12-13T12:45:00'),
      endTime: new Date('2025-12-13T13:10:00'),
      description: 'Foredrag om Pods on Mars',
    },
    {
      title: 'Mnemonic',
      speaker: 'Anne Beruldsen & Nora Bodin',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T13:25:00'),
      endTime: new Date('2025-12-13T13:50:00'),
      description: 'Foredrag om Mnemonic',
    },
    {
      title: 'Android app',
      speaker: 'Olav Hermansen',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T13:55:00'),
      endTime: new Date('2025-12-13T14:20:00'),
      description: 'Foredrag om Android app utvikling',
    },
    {
      title: 'Teambuilding',
      speaker: 'Halil & Mats',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T14:25:00'),
      endTime: new Date('2025-12-13T14:45:00'),
      description: 'Foredrag om teambuilding',
    },
    {
      title: 'Hvordan lage et programmeringsspråk som kjører på JVM-en',
      speaker: null,
      room: 'Sal 2 (breakout)',
      startTime: new Date('2025-12-13T14:25:00'),
      endTime: new Date('2025-12-13T14:45:00'),
      description: 'Foredrag om å lage programmeringsspråk for JVM',
    },
    {
      title: 'Team-skjerm og kjørende OKR-er',
      speaker: 'Leiv-Erik',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T14:45:00'),
      endTime: new Date('2025-12-13T15:00:00'),
      description: 'Foredrag om team-skjerm og OKR-er',
    },
    {
      title: 'Vibe-code med stil #cursor',
      speaker: 'Tofik',
      room: 'Sal 2 (breakout)',
      startTime: new Date('2025-12-13T14:45:00'),
      endTime: new Date('2025-12-13T15:00:00'),
      description: 'Foredrag om vibe-code med Cursor',
    },
    {
      title: 'AI "It\'s here!"',
      speaker: 'Bjørn Erik',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T15:10:00'),
      endTime: new Date('2025-12-13T15:30:00'),
      description: 'Foredrag om AI',
    },
    {
      title: '"Ka om ej kunne..." om verktøybygging',
      speaker: 'Tarjei',
      room: 'Sal 2 (breakout)',
      startTime: new Date('2025-12-13T15:10:00'),
      endTime: new Date('2025-12-13T15:30:00'),
      description: 'Foredrag om verktøybygging',
    },
    {
      title: 'Vision Pro 2',
      speaker: 'Magnus Tviberg',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T15:35:00'),
      endTime: new Date('2025-12-13T16:00:00'),
      description: 'Foredrag om Vision Pro 2',
    },
    {
      title: '',
      speaker: 'Yousef Haddaoui',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T16:05:00'),
      endTime: new Date('2025-12-13T16:45:00'),
      description: 'Foredrag av Yousef Haddaoui',
    },
    {
      title: 'Avslutning på dagsprogrammet',
      speaker: null,
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-13T16:45:00'),
      endTime: new Date('2025-12-13T17:00:00'),
      description: 'Avslutning på dagsprogrammet',
    },
  ]

  for (const session of sessions) {
    await prisma.session.create({
      data: session,
    })
  }

  console.log(`Seeded ${sessions.length} sessions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

