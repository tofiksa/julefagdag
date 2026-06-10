/**
 * Oppdaterer longDescription/images på eksisterende sesjoner basert på
 * tittel-match, uten å slette noe. Trygt å kjøre i produksjon
 * (i motsetning til seed, som sletter all feedback).
 *
 * Kjør: tsx --env-file=.env.local scripts/update-session-details.ts
 */
import { PrismaClient } from "@prisma/client";
import { SESSION_DETAILS } from "../prisma/session-details";

const prisma = new PrismaClient();

async function main() {
  for (const [title, details] of Object.entries(SESSION_DETAILS)) {
    const result = await prisma.session.updateMany({
      where: { title },
      data: {
        longDescription: details.longDescription ?? null,
        images: details.images ?? [],
      },
    });

    if (result.count === 0) {
      console.warn(`Fant ingen sesjon med tittel "${title}" — hoppet over`);
    } else {
      console.log(`Oppdaterte "${title}" (${result.count} rad(er))`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
