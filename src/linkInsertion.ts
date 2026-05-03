export function buildLinkText(selectedText: string, scratchFilename: string): string {
  return `[${selectedText}](./${scratchFilename})`;
}

export interface LinkLocation {
  start: number;
  end: number;
  linkText: string;
}

/**
 * Locate a markdown link whose target is `./<scratchFilename>` by anchoring
 * on the literal `](./<scratchFilename>)` substring and walking back through
 * the text to find the matching `[`. Tracks `[`/`]` nesting so balanced
 * brackets inside the link text don't confuse the match.
 *
 * Returns null when no link with that exact target is present.
 */
export function findLinkByTarget(
  documentText: string,
  scratchFilename: string
): LinkLocation | null {
  const target = `](./${scratchFilename})`;
  const targetIdx = documentText.indexOf(target);
  if (targetIdx === -1) return null;

  let depth = 0;
  for (let i = targetIdx - 1; i >= 0; i--) {
    const c = documentText[i];
    if (c === "]") {
      depth++;
    } else if (c === "[") {
      if (depth === 0) {
        const start = i;
        const end = targetIdx + target.length;
        const linkText = documentText.slice(start + 1, targetIdx);
        return { start, end, linkText };
      }
      depth--;
    }
  }
  return null;
}

/**
 * Every span of the literal `](./<scratchFilename>)` substring. Used by the
 * promote command to retarget without parsing the link text.
 */
export function findLinkTargetSpans(
  documentText: string,
  scratchFilename: string
): Array<{ start: number; end: number }> {
  const target = `](./${scratchFilename})`;
  const spans: Array<{ start: number; end: number }> = [];
  let i = 0;
  for (;;) {
    const idx = documentText.indexOf(target, i);
    if (idx === -1) break;
    spans.push({ start: idx, end: idx + target.length });
    i = idx + target.length;
  }
  return spans;
}
