/** Google Maps link + embed for sessions that need wayfinding. */
const SESSION_MAPS: Record<
  string,
  { embedUrl: string; mapsUrl: string; label: string }
> = {
  "oppmøte vulkanarena": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1999.7427757344!2d10.7485665!3d59.922435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e659fce50af%3A0x59b311fdbca588d5!2sVulkan%20Arena!5e0!3m2!1sno!2sno!4v1749475200000!5m2!1sno!2sno",
    mapsUrl: "https://maps.app.goo.gl/EnjUyj1EQRkicF886",
    label: "Vulkanarena",
  },
};

export function getSessionMap(title: string | null) {
  if (!title) return null;
  return SESSION_MAPS[title.toLowerCase().trim()] ?? null;
}
