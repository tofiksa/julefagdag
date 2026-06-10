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
};
