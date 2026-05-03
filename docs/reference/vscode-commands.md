---
type: reference
domain: clear
audience: practitioner
stability: structural
authority:
  provenance: institutional
  verifiability: executable
  evidence: strong
  currency: live
epistemic-layer: practice
---

<!-- markdownlint-disable MD024 -->

# VSCode Commands Reference

The Threads extension contributes three commands. All live under the **Threads:** category in the Command Palette.

| Command ID                   | Title                         | Surfaces                                                              | Handler                                                                          |
| ---------------------------- | ----------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `threads.spawnFromSelection` | Threads: Spawn from Selection | Command Palette; editor context menu (markdown editor with selection) | [`spawnFromSelection`](../../packages/vscode/src/commands/spawnFromSelection.ts) |
| `threads.discardThread`      | Threads: Discard Thread       | Command Palette                                                       | [`discardThread`](../../packages/vscode/src/commands/discardThread.ts)           |
| `threads.promoteThread`      | Threads: Promote Thread       | Command Palette                                                       | [`promoteThread`](../../packages/vscode/src/commands/promoteThread.ts)           |

## `threads.spawnFromSelection`

### Preconditions

- An active text editor exists.
- Its `languageId` is `markdown`.
- The selection is non-empty.

If any precondition fails, the command shows an information toast explaining what's missing and exits.

### Inputs

- The active editor's selection range and its text content.
- An `InputBox` value typed by the user — the inquiry.

### Side effects

1. Saves the source document if dirty (so line numbers in the prompt match disk).
2. Writes `<source dir>/scratch-<ISO timestamp>.md` with the rendered scratch content.
3. Applies a `WorkspaceEdit` that replaces the selection with `[<selectedText>](./<scratchFilename>)` and saves the source document.
4. Pushes a `ThreadMeta` record onto `workspaceState["threads.records"]`.
5. Opens the scratch file in a new editor tab (`preview: false`).
6. Creates a new VSCode terminal scoped to the workspace folder, runs `claude '<prompt>'`.

### Outputs

- Information toast: `Threads: spawned thread (<scratchFilename>).`

### Failure modes

| Failure                                   | Behavior                                                           |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Source not in any workspace folder        | Error toast; no files written, no record stored.                   |
| `workspace.fs.writeFile` of scratch fails | Error toast; no record stored.                                     |
| `workspace.applyEdit` returns false       | Error toast; the just-created scratch file is best-effort deleted. |

## `threads.discardThread`

### Preconditions

None beyond the extension being loaded. If `workspaceState` has zero records, an info toast is shown and the command exits.

### Inputs

- A `QuickPick` selection of one `ThreadMeta` record.
- A modal `WarningMessage` confirmation.

### Side effects

1. Opens the source document via `workspace.openTextDocument`.
2. Substring-searches for `[<selectedText>](./<scratchFilename>)`. On a hit, applies a `WorkspaceEdit` that replaces the substring with `<selectedText>` and saves.
3. `workspace.fs.delete` of the scratch file (best-effort).
4. Removes the `ThreadMeta` from `workspaceState["threads.records"]`.

### Outputs

- On full success: information toast `Threads: discarded.`
- On partial success: warning toast listing what could not be reverted (link not found / scratch file missing). The record is still purged.

## `threads.promoteThread`

Finalizes a thread: turns the scratch file into a permanent note named after its content, retargets the source link, and forgets the thread.

### Preconditions

None beyond the extension being loaded. If `workspaceState` has zero records, an info toast is shown and the command exits.

### Inputs

- A `QuickPick` selection of one `ThreadMeta` record.
- The body under the scratch file's `## Notes` heading (must be non-empty).

### Side effects

1. Reads the scratch file and extracts everything under `## Notes`.
2. Invokes `claude -p '<prompt>'` (non-interactive) with the notes body. Expects a JSON response of the shape `{title, slug}`. Output is parsed leniently (markdown fences and surrounding prose tolerated). The slug is then sanitized to `[a-z0-9-]`, max 50 chars.
3. Writes `<sourceDir>/<slug>.md` containing `# <title>` followed by the notes body.
4. In the source document, replaces every occurrence of `](./<oldScratchFilename>)` with `](./<slug>.md)`. Saves. The link **text** (the user's original selected passage) is left unchanged — promotion is a target rewrite, not a prose edit.
5. `workspace.fs.delete` of the old scratch file (best-effort).
6. Removes the `ThreadMeta` from `workspaceState["threads.records"]`.

### Outputs

- On full success: information toast `Threads: promoted to <slug>.md ("<title>").`
- If the link in the source could not be retargeted: warning toast naming the source path. Promotion still completed (new file written, old file deleted, record purged).

### Failure modes

| Failure                                      | Behavior                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| `## Notes` body is empty                     | Error toast; nothing changes.                                                  |
| `claude` not on PATH                         | Error toast; nothing changes.                                                  |
| `claude -p` returns unparseable text         | Error toast (with first 200 chars of output); nothing changes.                 |
| `<slug>.md` already exists in `<sourceDir>/` | Error toast; nothing changes. User can rename the conflict by hand and re-run. |

### Notes

- Promotion is **one-way**. After it completes, the workspaceState record is gone — `threads.discardThread` cannot revert it. Use `git restore` or undo the file changes manually if you need to back out.
- Because the link target swap matches the literal substring `](./<oldScratchFilename>)`, the link text the user selected is preserved verbatim, even if the user has hand-edited it since spawn.

## Activation

The extension activates on `onLanguage:markdown`. All three commands are registered eagerly at activation, so they are present in the Command Palette as soon as any markdown file is opened in the workspace.

## Configuration

The extension contributes no `configuration` properties.

## Source files

- Manifest: [`packages/vscode/package.json`](../../packages/vscode/package.json)
- Activation: [`packages/vscode/src/extension.ts`](../../packages/vscode/src/extension.ts)
- Commands: [`packages/vscode/src/commands/`](../../packages/vscode/src/commands/)
