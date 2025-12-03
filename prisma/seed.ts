import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.feedback.deleteMany()
  await prisma.session.deleteMany()

  // Create sessions based on Julefagdag 2025 agenda
  const sessions = [
    {
      title: 'Lunsj',
      speaker: null,
      room: 'Sal 1 & Sal 2',
      startTime: new Date('2025-12-02T11:00:00'),
      endTime: new Date('2025-12-02T12:00:00'),
      description: 'Lunsj',
    },
    {
      title: 'Velkommen',
      speaker: 'Solveig',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-02T12:00:00'),
      endTime: new Date('2025-12-02T12:15:00'),
      description: 'Velkommen til Julefagdag',
    },
    {
      title: 'Google Kvante computing',
      speaker: 'Morten Hanshaugen',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-02T12:15:00'),
      endTime: new Date('2025-12-02T12:40:00'),
      description: 'Foredrag om Google Quantum Computing',
    },
    {
      title: 'Fremtidens arbeidsplass',
      speaker: 'Stine & Emilie',
      room: 'Sal 1 (breakout)',
      startTime: new Date('2025-12-02T12:45:00'),
      endTime: new Date('2025-12-02T13:10:00'),
      description: 'Foredrag om fremtidens arbeidsplass',
    },
    {
      title: 'Pods on Mars',
      speaker: 'Vegard Hagen',
      room: 'Sal 2 (breakout)',
      startTime: new Date('2025-12-02T12:45:00'),
      endTime: new Date('2025-12-02T13:10:00'),
      description: 'Foredrag om Pods on Mars',
    },
    {
      title: 'Mnemonic',
      speaker: 'Anne Beruldsen & Nora Bodin',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-02T13:55:00'),
      endTime: new Date('2025-12-02T14:20:00'),
      description: 'Foredrag om Mnemonic',
    },
    {
      title: 'En guidet fisketur til en (u)fortjent førsteplass',
      speaker: 'Olav Hermansen',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-02T13:25:00'),
      endTime: new Date('2025-12-02T13:50:00'),
      description: 'Foredrag',
    },
    {
      title: 'Teambuilding',
      speaker: 'Halil & Mats',
      room: 'Sal 1 (breakout)',
      startTime: new Date('2025-12-02T14:35:00'),
      endTime: new Date('2025-12-02T14:55:00'),
      description: 'Foredrag om teambuilding',
    },
    {
      title: 'Team-skjerm og kjørende OKR-er',
      speaker: 'Leiv-Erik',
      room: 'Sal 2 (breakout)',
      startTime: new Date('2025-12-02T14:25:00'),
      endTime: new Date('2025-12-02T15:00:00'),
      description: 'Foredrag om team-skjerm og OKR-er',
    },
    {
      title: 'Vibe-code med stil #cursor',
      speaker: 'Tofik',
      room: 'Sal 1 (breakout)',
      startTime: new Date('2025-12-02T14:55:00'),
      endTime: new Date('2025-12-02T15:10:00'),
      description: 'Foredrag om vibe-code med Cursor',
    },
    {
      title: 'AI "It\'s here!"',
      speaker: 'Bjørn Erik',
      room: 'Sal 1 (breakout)',
      startTime: new Date('2025-12-02T15:10:00'),
      endTime: new Date('2025-12-02T15:30:00'),
      description: 'Foredrag om AI',
    },
    {
      title: '"Ka om ej kunne..." om verktøybygging',
      speaker: 'Tarjei',
      room: 'Sal 2 (breakout)',
      startTime: new Date('2025-12-02T15:10:00'),
      endTime: new Date('2025-12-02T15:30:00'),
      description: 'Foredrag om verktøybygging',
    },
    {
      title: 'Vision Pro 2',
      speaker: 'Magnus Tviberg',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-02T15:35:00'),
      endTime: new Date('2025-12-02T16:00:00'),
      description: 'Foredrag om Vision Pro 2',
    },
    {
      title: 'Yousef Haddaoui',
      speaker: 'Yousef Haddaoui',
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-02T16:05:00'),
      endTime: new Date('2025-12-02T16:45:00'),
      description: 'Foredrag av Yousef Haddaoui',
    },
    {
      title: 'Avslutning på dagsprogrammet',
      speaker: null,
      room: 'Sal 1 (felles)',
      startTime: new Date('2025-12-02T16:45:00'),
      endTime: new Date('2025-12-02T17:00:00'),
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

