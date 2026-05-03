---
type: reference
domain: clear
audience: practitioner
stability: structural
authority:
  provenance: institutional
  verifiability: testable
  evidence: strong
  currency: dated
epistemic-layer: framework
---

# Scratch File Format

Each thread is materialized as a single markdown file written next to its source document. The filename and content layout are produced by [`packages/vscode/src/scratchFile.ts`](../../packages/vscode/src/scratchFile.ts) and [`spawnFromSelection.ts`](../../packages/vscode/src/commands/spawnFromSelection.ts).

## Filename

```
scratch-<ISO-timestamp>.md
```

Where `<ISO-timestamp>` is `new Date().toISOString().replace(/[:.]/g, "-")`. Example: `scratch-2026-05-03T14-23-45-678Z.md`.

The replacement of `:` and `.` keeps the filename portable across filesystems. Sub-millisecond resolution makes collisions effectively impossible in interactive use.

## Location

Same directory as the source markdown. If the source is `docs/example-text-1.md`, the scratch file is `docs/scratch-<timestamp>.md`.

This co-location is what makes the relative link `[text](./scratch-<ts>.md)` work without computing a longer relative path.

## Content layout

```markdown
# Inquiry

<the user's inquiry text, verbatim>

## Source

[SOURCE-PATH-FROM-WORKSPACE-ROOT:START-LINE[-END-LINE]](RELATIVE-PATH-FROM-SCRATCH-BACK-TO-SOURCE)

## Selected excerpt

> <selected text, blockquoted line by line>

## Notes
```

### Field-by-field

| Field                  | Origin                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `<inquiry>`            | The text the user typed into the input box at spawn time.                             |
| `<source-path>`        | Path of the source markdown, relative to the workspace folder root.                   |
| `<startLine>`          | 1-based line number of `selection.start`. Always present.                             |
| `<endLine>`            | 1-based line number of `selection.end`, included only when different from start.      |
| `<relative-path-back>` | `./<basename>` because the scratch file lives in the same directory as its source.    |
| `<selected text>`      | Verbatim text of the user's selection at spawn time, prefixed with `> ` on each line. |

### Trailing structure

The file ends with a `## Notes` heading and one blank line. The expectation is that Claude (or the user) will append analysis below this heading. The extension never writes back to the file after creation.

## Example

For a selection of the word `Pragmatism` on line 22 of `docs/example-text-1.md`, with the inquiry `Why does the author equate Pragmatism with utility?`, the resulting `docs/scratch-2026-05-03T14-23-45-678Z.md` is:

```markdown
# Inquiry

Why does the author equate Pragmatism with utility?

## Source

[docs/example-text-1.md:22](./example-text-1.md)

## Selected excerpt

> Pragmatism

## Notes
```

## Lifecycle

- **Created** by `threads.spawnFromSelection`.
- **Modified** freely by the user, by Claude, or by anyone else with the file open.
- **Deleted** by `threads.discardThread`. The deletion is best-effort — if the file has been moved or already removed, discard surfaces a warning but completes.

## Stability

The headings (`# Inquiry`, `## Source`, `## Selected excerpt`, `## Notes`) and their order are part of the contract: tooling and prompts assume them. Changing them requires updating [`scratchFile.ts`](../../packages/vscode/src/scratchFile.ts) and any prompts that reference them.

The filename pattern (`scratch-<ts>.md`) is also load-bearing: discard substring-matches on `./<scratchFilename>` inside the source doc to find the link to remove.
