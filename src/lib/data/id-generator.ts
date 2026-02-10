/**
 * Seeded pseudo-random ID generator for realistic mock data.
 * Produces Persona-style IDs like: inq_Wt77vKHwYVYFciFNNDQpvggYy6jD
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Mulberry32 seeded PRNG */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a realistic-looking ID with the given prefix.
 * @param prefix - e.g. "inq", "ver", "rep", "act"
 * @param index  - unique index for deterministic generation
 * @param length - character length after prefix_ (default 28)
 */
export function generateId(prefix: string, index: number, length = 28): string {
  const rng = mulberry32(index * 7919 + prefix.charCodeAt(0) * 131);
  let id = `${prefix}_`;
  for (let i = 0; i < length; i++) {
    id += ALPHABET[Math.floor(rng() * ALPHABET.length)];
  }
  return id;
}
