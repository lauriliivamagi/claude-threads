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

# Discard a Thread (Roll Back the Creation Artifacts)

Discarding undoes the two visible artifacts the extension created when the thread was spawned: the link in the source markdown and the scratch file. It does **not** revert any other edits the agent may have made — those are your normal `git` business.

## When to use this

- The thread was a dead end and you don't want the link cluttering the source.
- You spawned the thread by accident.
- You're cleaning up after a session and want to keep only the threads worth saving.

## Prerequisites

- At least one thread has been spawned in this workspace. (Threads survive VSCode reloads.)
- You can identify the thread by either its inquiry text, its scratch filename, or the source path.

## Steps

1. Open the Command Palette → **Threads: Discard Thread**.
2. The picker lists every recorded thread. Each row shows:
   - **Label**: the inquiry (truncated to ~80 chars)
   - **Description**: the scratch filename
   - **Detail**: the source path

   Pick the one you want.

3. Confirm the modal.

## What happens

In order:

1. The source document is opened (in memory; you don't have to have it visible).
2. The extension searches for the literal substring `[<selectedText>](./<scratchFilename>)`. If found, it replaces it with `<selectedText>`. The document is then saved.
3. `workspace.fs.delete` removes the scratch file.
4. The `ThreadMeta` record is dropped from `workspaceState`.

## When the link or file is missing

The discard still completes; the metadata is purged regardless. You'll see a warning toast naming what was missing. This typically happens when:

- You manually edited the source and broke the link.
- You moved or renamed the scratch file.
- You spawned in one workspace and tried to discard in another.

If the warning bothers you, fix the underlying inconsistency by hand and call discard again on a fresh thread.

## Things you should also check

- `git diff` of the source file. The link should be gone. If you've added inline edits Claude made, those remain — review and commit (or revert) them as you would any other edit.
- The file system. The `scratch-*.md` should be deleted. Confirm if needed.

## What discard does NOT do

- It does **not** kill the terminal that was running `claude` for this thread. Close it manually or let it stop on its own.
- It does **not** revert edits Claude made to other files. Use `git restore` for that.
- It does **not** remove the thread's terminal scrollback. There is no way to recover the conversation once the terminal is closed (unless Claude wrote summaries into the scratch file before deletion).

## Related

- [Spawn a thread](./spawn-a-thread.md) — for context.
- [Explanation: design rationale](../explanation/design-rationale.md) — why discard is creation-only and not full-history rollback.
