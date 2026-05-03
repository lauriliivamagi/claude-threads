---
type: tutorial
domain: clear
audience: practitioner
stability: tactical
authority:
  provenance: institutional
  verifiability: executable
  evidence: moderate
  currency: dated
epistemic-layer: practice
---

# Getting Started: Your First Thread

This tutorial walks you from a fresh clone to a Claude conversation anchored to a passage in a markdown document. By the end you will have one scratch file in your working tree, one markdown link inserted into the source document, and one terminal running `claude` with the prompt pre-populated.

You will learn by doing. Don't worry about understanding why each step works — that's covered in the [explanation docs](../explanation/design-rationale.md).

## What you need

- Node.js 20 or newer.
- pnpm 10.6 or newer.
- A working `claude` CLI on your `PATH` (from Anthropic's Claude Code).
- VSCode 1.85 or newer.

## 1. Install dependencies

From the repository root:

```sh
pnpm install
```

## 2. Build the extension

```sh
pnpm --filter @template/vscode build
```

This compiles `packages/vscode/src/` to `packages/vscode/dist/`. There is no other build needed for the threads workflow.

## 3. Open the repo in VSCode

```sh
code .
```

## 4. Launch the extension dev host

In VSCode, press `F5` (or run **Run → Start Debugging**). A second VSCode window opens — this is the **Extension Development Host**, with the Threads extension loaded.

## 5. Open the example markdown

In the dev host, open `docs/example-text-1.md`. Scroll until you see a passage you find interesting — for example, the paragraph defining "Pragmatism" near the top of the document.

## 6. Spawn your first thread

1. Select a phrase you want to ask about — say, the word `Pragmatism`.
2. Right-click the selection → **Threads: Spawn from Selection**. (Or open the Command Palette with `Ctrl+Shift+P` and type the same command.)
3. An input box appears. Type your inquiry, e.g. `What does the author mean by "Pragmatism" here?` and press Enter.

Three things happen at once:

- The selected text in `example-text-1.md` is replaced with `[Pragmatism](./scratch-2026-05-03T12-34-56-789Z.md)`. The original word is now the link text.
- A new file `docs/scratch-<timestamp>.md` is created and opens in a new editor tab. It contains your inquiry, a back-link to the source, and the selected excerpt.
- A terminal opens at the workspace root and runs `claude '<prompt>'`. Claude starts processing your inquiry against the scratch file.

## 7. Continue the conversation

Type follow-up questions in the terminal as you would in any normal Claude Code session. Edits Claude makes to the scratch file (or anywhere else) appear immediately in the editor.

## 8. End the thread

A thread ends one of two ways. Pick the one that matches what you got out of the conversation.

### 8a. Discard — the conversation was a dead end

Use this when the thread didn't produce anything worth keeping.

1. Open the Command Palette → **Threads: Discard Thread**.
2. Pick the thread from the quick-pick list. (Records survive VSCode reloads, so this works tomorrow too.)
3. Confirm the modal.

The link in `example-text-1.md` reverts to plain `Pragmatism`. The scratch file is deleted. The thread is forgotten.

### 8b. Promote — the notes are worth keeping as a permanent doc

Use this when the `## Notes` section of your scratch file contains something you'd like to keep next to the source under a meaningful filename.

1. Open the Command Palette → **Threads: Promote Thread**.
2. Pick the same thread from the quick-pick list.
3. Wait a few seconds for the notification "Threads: deriving title and slug from notes…" — the extension is asking `claude -p` once for a title and slug derived from your `## Notes` body.

When it finishes:

- A new file like `docs/why-pragmatism-fits-design-science.md` exists in the source's directory, opening with `# <title>` and containing only the notes (no inquiry, no excerpt).
- The link in `example-text-1.md` now reads `[Pragmatism](./why-pragmatism-fits-design-science.md)` — the link **target** has been retargeted to the new file, but the link **text** (`Pragmatism`) is unchanged so the prose still reads naturally.
- The original `scratch-<timestamp>.md` is gone.
- The thread is no longer in the discard picker. Promotion is one-way; if you want it back, use `git restore`.

## What you've learned

You now have the full lifecycle: **spawn → converse → discard or promote**. The [how-to guides](../how-to-guides/) cover variations (multi-line selections, partial rollback, promotion edge cases); the [reference docs](../reference/) document every command and file format.

## Next steps

- Read [how-to-guides/spawn-a-thread.md](../how-to-guides/spawn-a-thread.md) for variations on step 6.
- Read [how-to-guides/promote-a-thread.md](../how-to-guides/promote-a-thread.md) for the full contract of step 8b.
- Read [explanation/design-rationale.md](../explanation/design-rationale.md) to understand the tradeoffs the design accepts.
