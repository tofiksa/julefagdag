// Script to add a test session for feedback testing
// Run with: DATABASE_URL="your-db-url" tsx scripts/add-test-session.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test session that is completed (2 hours ago to 1 hour ago)
  const testSession = await prisma.session.create({
    data: {
      title: '🧪 Test Foredrag - Tilbakemelding',
      speaker: 'Test Speaker',
      room: 'Test Rom',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      description: 'Dette er et test-foredrag for å teste tilbakemeldingsfunksjonaliteten. Du kan gi tilbakemelding på dette foredraget.',
    },
  })

  console.log('Test session created:', testSession)
  console.log('Session ID:', testSession.id)
  console.log('\nDu kan nå teste tilbakemeldingsfunksjonaliteten på dette foredraget!')
}

main()
  .catch((e) => {
    console.error('Error creating test session:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

