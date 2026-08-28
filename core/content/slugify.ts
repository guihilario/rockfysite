// Faixa Unicode das marcas de acentuação combinantes (U+0300–U+036F).
// Construída via code point em vez de escape \u literal no fonte para
// evitar ambiguidade de codificação no arquivo.
const COMBINING_MARKS = new RegExp(
  `[${String.fromCodePoint(0x0300)}-${String.fromCodePoint(0x036f)}]`,
  "g",
);

/** lowercase, sem acento, `-` como separador (SPEC §48). Reusado para
 * slugs de post/tag e para os ids de heading do sidebar automático (§42). */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
