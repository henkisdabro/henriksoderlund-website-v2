// eslint-disable-next-line no-misleading-character-class
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}]/gu;

// Scandinavian vowels transliterate to digraphs rather than losing their diacritic,
// so "Malmö" becomes "Malmoe" and not "Malmo". Applied before the generic
// diacritic strip below, which would otherwise reach them first.
const DIGRAPHS: Array<[RegExp, string]> = [
  [/ö/g, 'oe'], [/Ö/g, 'Oe'],
  [/ä/g, 'ae'], [/Ä/g, 'Ae'],
  [/å/g, 'aa'], [/Å/g, 'Aa'],
  [/ü/g, 'ue'], [/Ü/g, 'Ue'],
  [/ß/g, 'ss'],
  [/æ/g, 'ae'], [/Æ/g, 'Ae'],
  [/ø/g, 'oe'], [/Ø/g, 'Oe'],
];

const PUNCTUATION: Array<[RegExp, string]> = [
  [/\s*—\s*/g, ' - '],     // em dash becomes a spaced hyphen
  [/[‐-–―−]/g, '-'],  // hyphens, en dash, horizontal bar, minus
  [/[‘’‚‛]/g, "'"],
  [/[“”„‟]/g, '"'],
  [/…/g, '...'],
  [/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' '],  // exotic spaces
];

/**
 * Normalise generated plain-text output to ASCII.
 *
 * The `.md` endpoints, `/llms.txt` and `/llms-full.txt` are plain-text contracts,
 * so they must not carry the typographic characters the HTML pages use. Rendered
 * pages keep Henrik's original punctuation; only generated text is folded.
 */
export function removeEmojis(text: string): string {
  let out = text.replace(EMOJI_REGEX, '');

  for (const [pattern, replacement] of DIGRAPHS) {
    out = out.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of PUNCTUATION) {
    out = out.replace(pattern, replacement);
  }

  // Strip any remaining combining marks (é -> e), then drop whatever is still
  // outside printable ASCII so the endpoint can never emit a surprise byte.
  out = out.normalize('NFD').replace(/\p{M}+/gu, '').normalize('NFC');
  out = out.replace(/[^\t\n\r\x20-\x7E]/g, '');

  return out.trim();
}
