# Spec: Claude Threads for Markdown

A VSCode extension that lets a user spawn a Claude Code conversation ("thread") anchored to a selection in a markdown document. Spawning creates a single scratch file next to the source and replaces the selected text with a markdown link to it. The conversation itself runs in a normal Claude Code terminal alongside.

## Why This Exists

When reading dense documents, the user wants to ask Claude about a specific passage without losing the trail back to the original. Each thread leaves two visible artifacts (a link in the source, a sibling scratch file) and a small in-extension record so the thread can be discarded or promoted later.

## Design Decisions

- **One file per thread.** A `scratch-<ISO-timestamp>.md` in the source file's directory.
- **Wrap the selection.** The selected text is replaced with `[<selectedText>](./scratch-<ts>.md)`. The original prose is reachable by reading the link text; discarding restores the original.
- **Persistence via `workspaceState`.** Each thread gets a `ThreadMeta` record (id, inquiry, paths, line range, selected text, scratch filename). Survives reload.
- **Sequential agents.** It is the user's responsibility not to run two agents that step on each other's edits.
- **Discard = undo creation.** Discarding a thread removes the link from the source, deletes the scratch file, and forgets the record. It does _not_ try to revert any other files the agent touched — that's normal `git` territory.

## Command Surface

| Command                         | Purpose                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Threads: Spawn from Selection` | Prompt for an inquiry, create the scratch file, wrap the selection, save metadata, open `claude` in a new terminal. |
| `Threads: Discard Thread`       | Pick a thread, confirm, undo creation artifacts.                                                                    |
| `Threads: Promote Thread`       | Pick a thread, derive a title and slug from its `## Notes` body, rename the scratch file, retarget the source link. |

`Spawn from Selection` is also surfaced in the editor context menu when the active doc is markdown and there's a selection.

## Scratch File Layout

```markdown
# Inquiry

<the user's inquiry text>

## Source

[<source path>:<startLine>-<endLine>](<relative path back to source>)

## Selected excerpt

> <selected text, blockquoted line by line>

## Notes
```

The agent is expected to read this file as its starting context and append its analysis under `## Notes` (or wherever it makes sense).

## `workspaceState` Schema

Stored under key `threads.records` as an array of:

```ts
interface ThreadMeta {
  id: string; // uuid
  createdAt: string; // ISO
  inquiry: string;
  scratchPath: string; // workspace-relative
  sourcePath: string; // workspace-relative
  selectedText: string; // verbatim, used for rollback substring search
  scratchFilename: string; // bare filename used inside the link
  startLine: number; // 1-based
  endLine: number; // 1-based, inclusive
}
```

## Claude Launch

When a thread is spawned, the extension opens a terminal in the workspace folder and runs:

```sh
claude '<prompt>'
```

The prompt names the scratch file (relative to the workspace root), the source location with line range, and repeats the user's inquiry. The user types into the same terminal afterwards.

`Threads: Promote Thread` makes no `claude` call. It derives the new file's title and slug locally from the `## Notes` body (first markdown heading, else first non-empty line).

## Discard Semantics

`Threads: Discard Thread` does, in order:

1. Open the source document and look for the literal substring `[<selectedText>](./<scratchFilename>)`. If found, replace it with `<selectedText>`; save.
2. `workspace.fs.delete` the scratch file (best-effort; missing file is OK).
3. Remove the `ThreadMeta` from `workspaceState`.

If either of the first two steps fails (link edited away, scratch file moved or deleted), the discard surfaces a warning toast but still purges the metadata so the picker stays clean.

## Promote Semantics

`Threads: Promote Thread` does, in order:

1. Read the scratch file and extract the body under `## Notes`. Abort if empty.
2. Derive `{title, slug}` locally from the notes body. The title is the first markdown heading, else the first non-empty line, cleaned of inline markup and capped to 8 words; the slug is that title lowercased and sanitized to `[a-z0-9-]`, max 50 chars. Abort if no usable title can be derived (e.g. the notes are only whitespace or symbols).
3. Write `<sourceDir>/<slug>.md` containing `# <title>` followed by the notes body. Abort if a file with that name already exists.
4. Replace every occurrence of `](./<oldScratchFilename>)` in the source document with `](./<slug>.md)`. The link text is left untouched.
5. Delete the old scratch file.
6. Remove the `ThreadMeta` from `workspaceState`. Promotion is one-way.

## Out of Scope

- Cross-thread parent/child or DAG relationships.
- Concurrent-agent isolation.
- Cross-machine or cross-clone sync of thread state.
- Rich UI surfaces beyond the command palette and editor context menu.
