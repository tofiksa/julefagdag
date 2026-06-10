import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sessionFeedback = await prisma.feedback.deleteMany();
  const eventFeedback = await prisma.eventFeedback.deleteMany();

  console.log(`Slettet ${sessionFeedback.count} sesjons-tilbakemeldinger`);
  console.log(`Slettet ${eventFeedback.count} event-tilbakemeldinger`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
