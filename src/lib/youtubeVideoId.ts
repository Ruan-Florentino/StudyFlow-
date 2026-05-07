/** Extrai o id de 11 caracteres de URLs comuns do YouTube. */
export function extractYoutubeVideoId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  const bare = s.match(/^([a-zA-Z0-9_-]{11})$/);
  if (bare) return bare[1];
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}
