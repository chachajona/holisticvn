import { paragraphs } from "@/lib/treatment-display";

export type TextPart = { text: string; emphasis?: boolean };

// A full stop after one of these is not the end of a sentence.
const ABBREVIATIONS = new Set(["TP", "TS", "BS", "PGS", "ThS", "Dr"]);
const MIN_STATEMENT = 40;
const MAX_STATEMENT = 220;

// Index just after the first sentence's full stop, or -1 when there is no reliable end.
function firstSentenceEnd(text: string) {
  for (const match of text.matchAll(/\.\s+(?=\p{Lu})/gu)) {
    // Only the part after the last "." or "(" counts, so "(TP." and "PGS.TS." are abbreviations too.
    const word = /(\S+)$/.exec(text.slice(0, match.index))?.[1] ?? "";
    if (ABBREVIATIONS.has(word.split(/[.(]/).pop()!)) continue;
    return match.index + 1;
  }
  return text.endsWith(".") ? text.length : -1;
}

// Emphasis is colour only (DESIGN.md): the first occurrence of the title, NFC and case-insensitive.
export function emphasize(text: string, title: string): TextPart[] {
  const source = text.normalize("NFC");
  const needle = title.normalize("NFC").trim().toLowerCase();
  const at = needle ? source.toLowerCase().indexOf(needle) : -1;
  if (at === -1) return [{ text: source }];
  return [
    { text: source.slice(0, at) },
    { text: source.slice(at, at + needle.length), emphasis: true },
    { text: source.slice(at + needle.length) },
  ].filter((part) => part.text);
}

// "Giới thiệu" (spec 4.4): the first sentence leads, the rest of the text sits in the right column.
export function introParts(
  description: string,
  title: string,
): { statement?: TextPart[]; rest: string[] } {
  const items = paragraphs(description);
  if (!items.length) return { rest: [] };
  const [first, ...others] = items;
  const end = firstSentenceEnd(first);
  const sentence = end > 0 ? first.slice(0, end).trim() : "";
  if (sentence.length < MIN_STATEMENT || sentence.length > MAX_STATEMENT) return { rest: items };
  const remainder = first.slice(end).trim();
  return {
    statement: emphasize(sentence, title),
    rest: [...(remainder ? [remainder] : []), ...others],
  };
}
