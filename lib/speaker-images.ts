/**
 * Maps individual speaker names to their photo in `/public/speakers/`.
 *
 * Keys are matched against the `session.speaker` string from the DB. A session
 * may list several people (e.g. "Therese, Knut og Janne"), so
 * {@link getSpeakerAvatars} splits the string and resolves each person
 * independently. People without a photo fall back to the "mystery" placeholder.
 *
 * No Prisma/seed changes are needed — this is a pure lookup table.
 */

/** Person name (lowercased) → photo path under /public/speakers/. */
const SPEAKER_IMAGE_MAP: Record<string, string> = {
  "jan henrik gudelsby": "/speakers/janhenrik.jpg",
  "louis maurice dieffenthaler": "/speakers/louis.png",
  "sofie staal": "/speakers/sofie.png",
  "kjetil hårtveit": "/speakers/kjetil.jpeg",
  therese: "/speakers/therese.png",
  janne: "/speakers/janne.png",
  "jawad saleemi": "/speakers/jawad.jpeg",
  "triera gashi": "/speakers/triera.png",
  "ingrid fosså": "/speakers/ingrid.jpeg",
  "erik andreas klokk": "/speakers/erik.png",
  "simon kavanagh": "/speakers/simon.png",
  "harald eia": "/speakers/harald.png",
};

export interface SpeakerAvatar {
  /** Full display name of the person. */
  name: string;
  /** Photo path, or null when no image exists (→ mystery placeholder). */
  image: string | null;
}

/**
 * Splits a `session.speaker` string into individual people.
 * Handles comma- and "og"-separated lists, e.g. "Therese, Knut og Janne".
 */
function splitSpeakers(speaker: string): string[] {
  return speaker
    .split(/,|\bog\b|&/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/** Returns the photo path for a single person, or null if none is mapped. */
export function getSpeakerImage(name: string): string | null {
  return SPEAKER_IMAGE_MAP[name.trim().toLowerCase()] ?? null;
}

/**
 * Resolves every person in a `session.speaker` string to an avatar entry.
 * Returns an empty array when `speaker` is null/empty.
 */
export function getSpeakerAvatars(
  speaker: string | null | undefined,
): SpeakerAvatar[] {
  if (!speaker) return [];

  return splitSpeakers(speaker).map((name) => ({
    name,
    image: getSpeakerImage(name),
  }));
}
