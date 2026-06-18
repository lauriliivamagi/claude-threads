---
type: how-to-guide
domain: clear
audience: practitioner
stability: tactical
authority:
  provenance: institutional
  verifiability: testable
  evidence: moderate
  currency: dated
epistemic-layer: method
---

# Promote a Thread to a Permanent Note

Promotion turns a scratch file into a permanent, content-named note. It is a one-way operation — after it completes, the thread is no longer revertable through the extension.

## When to use this

The conversation reached a useful conclusion and the notes under `## Notes` are worth keeping next to the source document under a meaningful name.

## Prerequisites

- The thread you want to promote exists in `workspaceState`.
- The scratch file has non-empty content under its `## Notes` heading.

## Steps

1. Open the Command Palette → **Threads: Promote Thread**.
2. Pick the thread from the quick-pick list (same shape as the discard picker).
3. The new note is created immediately — the title and slug are derived locally from the notes, with no network round-trip.

## What happens

In order:

1. The body under `## Notes` is extracted from the scratch file.
2. A title and slug are derived locally from that body: the title is the first markdown heading, else the first non-empty line (cleaned of inline markup and capped to 8 words); the slug is that title lowercased and sanitized to `[a-z0-9-]`.
3. A new file `<slug>.md` is written next to the source document. Its content is `# <title>` followed by the verbatim notes body. The `# Inquiry`, `## Source`, and `## Selected excerpt` sections are dropped.
4. In the source document, the link **target** that pointed to the old `scratch-<ts>.md` is rewritten to point to `<slug>.md`. The link **text** (your original selected passage) is **not** changed — it still reads as the surrounding prose intends.
5. The old scratch file is deleted.
6. The `ThreadMeta` record is removed from `workspaceState`.

## Example

Before promotion, `docs/example-text-1.md` contains:

```markdown
2. Ontology (The Reality): [Pragmatism](./scratch-2026-05-03T14-23-45-678Z.md) / Socio-Technical Reality.
```

The scratch file's `## Notes` section contains a several-paragraph analysis. After **Threads: Promote Thread** runs:

- A new file `docs/why-pragmatism-fits-design-science.md` exists, opening with `# Why pragmatism fits design science` and containing those notes.
- The source line is now:
  ```markdown
  2. Ontology (The Reality): [Pragmatism](./why-pragmatism-fits-design-science.md) / Socio-Technical Reality.
  ```
  Note that `Pragmatism` is preserved as the link text.
- `scratch-2026-05-03T14-23-45-678Z.md` is gone.
- The thread is no longer in the discard picker.

## Failure modes and what to do

| Symptom                                              | What it means                                                          | Fix                                                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `scratch file has no content under "## Notes"`       | You haven't written notes yet.                                         | Add notes (or have Claude do so) and re-run.                                                                 |
| `could not derive a title from the notes`            | The notes are only whitespace or symbols, so no title could be formed. | Add a heading or a line of prose under `## Notes` and re-run.                                                |
| `"<slug>.md" already exists in the source directory` | The derived slug collides with an existing file.                       | Rename the existing file, or edit the notes' first heading/line so a different slug is derived, then re-run. |
| Warning: `link in <source> could not be retargeted`  | The exact `](./<scratch>.md)` substring isn't in the source anymore.   | Promotion still completed; fix the source link by hand or with `git diff`.                                   |

## What promotion does NOT do

- It does **not** offer rollback. Use `git restore` if you want to undo it.
- It does **not** kill the terminal that was running `claude` for this thread.
- It does **not** edit any file other than the scratch file, the source document, and the new `<slug>.md`.

## Related

- [Spawn a thread](./spawn-a-thread.md) — the other end of the lifecycle.
- [Discard a thread](./discard-a-thread.md) — for threads that turned out to be dead ends.
- [Reference: VSCode commands](../reference/vscode-commands.md#threadspromotethread) — exact contract of the command.
