---
type: how-to
domain: clear
audience: practitioner
stability: structural
authority:
  provenance: institutional
  verifiability: auditable
  evidence: strong
  currency: dated
epistemic-layer: practice
---

# Manual test checklist (pre-release)

Run this before tagging any release. The unit tests under `pnpm test` cover the pure modules; this checklist exercises the VSCode-bound commands that aren't under automated coverage.

## Setup

1. Pristine workspace: `git stash` any local changes, or open a scratch folder containing one `.md` file (`/tmp/manual-test/notes.md` is fine).
2. From the repo root: `pnpm install && pnpm build:bundle`.
3. Press **F5** in VSCode to launch the Extension Development Host. The host opens a fresh window with the extension loaded.
4. In the dev host window, open the scratch folder and the `.md` file.
5. Confirm the [Claude Code](https://claude.com/claude-code) CLI is on `PATH` in the dev host's terminal: open a terminal in the dev host and run `claude --version`.

## Spawn from Selection

- [ ] Highlight a single-line phrase. Run **Threads: Spawn from Selection** from the editor context menu. Enter an inquiry.
- [ ] The selected text is replaced with `[<selectedText>](./scratch-<timestamp>.md)`.
- [ ] A new file `scratch-<timestamp>.md` exists next to the source. Open it: confirm `# Inquiry`, `## Source`, `## Selected excerpt` (blockquoted), and an empty `## Notes` section.
- [ ] A terminal opened with `claude '<prompt>'`. The prompt mentions the scratch path, the source location with line range, and the inquiry.
- [ ] Repeat with a multi-line selection that stays within one paragraph. Confirm the link wraps the whole selection and the source range shows `start-end`.
- [ ] Selection containing `]` is rejected with a clear error. Selection spanning a blank line is rejected.

## Discard Thread

- [ ] Run **Threads: Discard Thread**. Pick the thread spawned above. Confirm the prompt.
- [ ] The link in the source reverts to the original selected text.
- [ ] The `scratch-<timestamp>.md` file is gone.
- [ ] Running **Threads: Discard Thread** again shows no entries (or only other threads).
- [ ] **Robustness**: spawn a thread, manually edit the link in the source to break it (e.g. change the link text), then discard. The discard surfaces a warning toast but still purges the metadata.

## Promote Thread

- [ ] Spawn a fresh thread. In the scratch file, write a few sentences under `## Notes`.
- [ ] Run **Threads: Promote Thread**. Pick the thread.
- [ ] A new `<slug>.md` appears next to the source. Open it: confirm `# <Title>` followed by your notes body.
- [ ] In the source document, the link's target now points to `./<slug>.md`. The link text is **unchanged**.
- [ ] The original `scratch-<timestamp>.md` is gone.
- [ ] **Edge case**: promoting a thread with an empty `## Notes` section aborts with a clear message and changes nothing.
- [ ] **Edge case**: if a file with the derived slug already exists, promote aborts and changes nothing.

## Reload persistence

- [ ] Spawn one thread. Reload the dev host window (Cmd/Ctrl + R).
- [ ] **Threads: Discard Thread** still lists the thread. Discard works after reload.

## Clean up

- [ ] Close the dev host window. Delete the scratch folder.
