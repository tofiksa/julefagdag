import Image from "next/image";
import { getSpeakerAvatars } from "@/lib/speaker-images";
import { cn } from "@/lib/utils";

interface SpeakerAvatarsProps {
  /** Raw `session.speaker` string (may list several people). */
  speaker: string | null | undefined;
  /** Use the stronger border on saturated highlight (gold/coral) cards. */
  onHighlight?: boolean;
}

/** Hairline ring matching the card edges; stronger on highlight surfaces. */
function ringClass(onHighlight: boolean): string {
  return onHighlight ? "border-spk-navy/20" : "border-spk-navy/10";
}

/**
 * "Mystery" placeholder for speakers without a photo. A neutral person
 * silhouette on a solid SPK-navy circle — decorative, so aria-hidden.
 */
function MysteryAvatar({
  onHighlight,
  className,
}: {
  onHighlight: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-spk-navy text-white",
        ringClass(onHighlight),
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="h-1/2 w-1/2 text-spk-gold"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z" />
      </svg>
    </div>
  );
}

/** A single real photo avatar, cropped uniformly to a circle. */
function PhotoAvatar({
  src,
  name,
  onHighlight,
  className,
}: {
  src: string;
  name: string;
  onHighlight: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border bg-spk-cream",
        ringClass(onHighlight),
        className,
      )}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes="(min-width: 640px) 64px, 48px"
        className="object-cover object-center"
      />
    </div>
  );
}

/**
 * Renders the speaker photo(s) for a session card.
 *
 * - Single speaker → one 48/64 px circular avatar.
 * - Multiple speakers → overlapping stack of slightly smaller avatars.
 * - Speakers without a photo → "mystery" placeholder.
 * - No speaker → renders nothing.
 *
 * Always decorative/supplemental to the visible "Foredragsholder:" text.
 */
export function SpeakerAvatars({
  speaker,
  onHighlight = false,
}: SpeakerAvatarsProps) {
  const avatars = getSpeakerAvatars(speaker);

  if (avatars.length === 0) return null;

  // Single person: standard 48 → 64 px avatar.
  if (avatars.length === 1) {
    const { name, image } = avatars[0];
    const size = "h-12 w-12 sm:h-16 sm:w-16";

    return image ? (
      <PhotoAvatar
        src={image}
        name={name}
        onHighlight={onHighlight}
        className={size}
      />
    ) : (
      <MysteryAvatar onHighlight={onHighlight} className={size} />
    );
  }

  // Multiple people: compact overlapping stack with a separating ring.
  const size = "h-10 w-10 sm:h-12 sm:w-12";

  return (
    <div className="flex shrink-0 -space-x-3">
      {avatars.map((avatar) =>
        avatar.image ? (
          <PhotoAvatar
            key={avatar.name}
            src={avatar.image}
            name={avatar.name}
            onHighlight={onHighlight}
            className={cn(size, "ring-2 ring-white")}
          />
        ) : (
          <MysteryAvatar
            key={avatar.name}
            onHighlight={onHighlight}
            className={cn(size, "ring-2 ring-white")}
          />
        ),
      )}
    </div>
  );
}
