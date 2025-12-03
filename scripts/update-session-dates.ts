import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Oppdater alle sesjoner fra 2025-12-13 til 2025-12-02
  const sessions = await prisma.session.findMany();
  
  for (const session of sessions) {
    const oldStart = new Date(session.startTime);
    const oldEnd = new Date(session.endTime);
    
    // Hvis sesjonen er på 2025-12-13, endre til 2025-12-02
    if (oldStart.getFullYear() === 2025 && oldStart.getMonth() === 11 && oldStart.getDate() === 13) {
      const newStart = new Date(2025, 11, 2, oldStart.getHours(), oldStart.getMinutes(), oldStart.getSeconds());
      const newEnd = new Date(2025, 11, 2, oldEnd.getHours(), oldEnd.getMinutes(), oldEnd.getSeconds());
      
      await prisma.session.update({
        where: { id: session.id },
        data: {
          startTime: newStart,
          endTime: newEnd,
        },
      });
      
      console.log(`Oppdatert ${session.title}: ${oldStart.toISOString()} -> ${newStart.toISOString()}`);
    }
  }
  
  console.log('Ferdig med oppdatering av datoer');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
