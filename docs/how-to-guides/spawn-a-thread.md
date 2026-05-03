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

# Spawn a Thread from a Markdown Selection

This guide assumes you know what threads are and that the extension is already installed. If not, read [tutorials/getting-started.md](../tutorials/getting-started.md) first.

## When to use this

You're reading or writing a markdown document and want to ask Claude about a specific passage without leaving a permanent trace of the question in the document itself.

## Prerequisites

- The Threads extension is loaded (extension dev host or installed VSIX).
- The active editor is a `.md` file inside a workspace folder.
- You have something selected.

## Steps

1. Highlight the term, sentence, or paragraph you want to inquire about.
2. Run the command, by either:
   - Right-click the selection → **Threads: Spawn from Selection**, or
   - Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **Threads: Spawn from Selection**.
3. Type your inquiry into the input box and press Enter. The inquiry can be any free-form text; one or two sentences works well.

## What you get

- **In the source file**: the selected text is replaced with `[<selectedText>](./scratch-<ISO>.md)`. The link target lives in the same directory.
- **In the source file's directory**: a new `scratch-<ISO-timestamp>.md` is written and opened in a new editor tab. It contains your inquiry, a back-link to the source, the selected excerpt, and an empty `## Notes` section.
- **In the terminal**: a new terminal scoped to the workspace folder runs `claude '<prompt>'`. The prompt names the scratch file, the source location with line range, and your inquiry text.
- **In `workspaceState`**: a `ThreadMeta` record so the thread can later be discarded. (See [reference/workspace-state-schema.md](../reference/workspace-state-schema.md).)

## Variations

### Selecting across multiple lines

The selection can span multiple lines. The link wraps the entire selected text, including newlines, which is valid markdown. The scratch file's `## Source` section will show a range like `docs/example-text-1.md:11-14`.

### Spawning a second thread on the same passage

Allowed. Each spawn produces a fresh `scratch-<timestamp>.md` (timestamps include milliseconds). The link wraps whatever was selected this time — that may already include a previous thread's link if your selection included it.

### Cancelling mid-spawn

If you press `Esc` at the inquiry input box, nothing is written. The selection in the source document is untouched.

## Things to check after spawning

- `git status` should show two changes: a modification to the source file (the link insertion) and a new untracked `scratch-...md`.
- The terminal Claude is running in is named `thread:<truncated inquiry>` so you can find it in the Terminal panel.

## Related

- [Discard a thread](./discard-a-thread.md) — when you're done.
- [Reference: scratch file format](../reference/scratch-file-format.md) — exact layout of the file that gets created.
- [Explanation: sequential agents assumption](../explanation/sequential-agents-assumption.md) — what the system does **not** protect you from.
