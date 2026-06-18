/**
 * Local, deterministic derivation of a `{ title, slug }` for a promoted thread.
 *
 * Replaces an earlier metered `claude -p` round-trip. The title is taken from
 * the `## Notes` body the agent wrote: the first markdown heading if there is
 * one, otherwise the first non-empty line. No network call, no LLM.
 */

const MAX_TITLE_WORDS = 8;
const MAX_SLUG_LENGTH = 50;

/** First ATX heading (`#`..`######`) anywhere in the body; closing `#`s stripped. */
const HEADING_RE = /^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/;
/** A leading list bullet (`-`, `*`, `+`), ordered marker (`1.`/`1)`), or blockquote `>`. */
const LEADING_MARKER_RE = /^\s*(?:[-*+]|\d+[.)]|>)\s+/;

export function deriveTitle(notes: string): string | null {
  const lines = notes.split("\n");

  let raw: string | null = null;
  for (const line of lines) {
    const heading = line.match(HEADING_RE);
    if (heading) {
      raw = heading[1];
      break;
    }
  }

  if (raw === null) {
    for (const line of lines) {
      const candidate = line.replace(LEADING_MARKER_RE, "").trim();
      if (candidate.length > 0) {
        raw = candidate;
        break;
      }
    }
  }

  if (raw === null) return null;

  const cleaned = raw
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // unwrap [text](url) -> text
    .replace(/[`*_~]/g, "") // drop inline emphasis / code markers
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, MAX_TITLE_WORDS)
    .join(" ")
    .replace(/[.,;:!?]+$/, "")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/, "");
}

export function deriveTitleSlug(notes: string): { title: string; slug: string } | null {
  const title = deriveTitle(notes);
  if (title === null) return null;
  const slug = slugify(title);
  if (slug.length === 0) return null;
  return { title, slug };
}
