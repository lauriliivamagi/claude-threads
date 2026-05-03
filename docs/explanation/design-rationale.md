---
type: explanation
domain: complex
audience: decision-maker
stability: structural
authority:
  provenance: institutional
  verifiability: asserted
  evidence: moderate
  currency: dated
epistemic-layer: heuristic
---

# Design Choices

The Threads extension makes a small set of opinionated choices that show up as concrete behaviors in the rest of the docs. This page states those choices bluntly so you can decide whether the extension is a good fit for your workflow.

## What the design optimizes for

- **Visible co-location.** Every thread leaves two artifacts in the working tree: a markdown link inside the source document and a sibling scratch file. The trail between them is readable in the files themselves — not hidden inside extension state.
- **Cheap creation, cheap destruction.** Spawning a thread is one command and writes two files. Discarding is the inverse and leaves no residue.
- **One way to reach Claude.** The conversation runs in a normal Claude Code terminal. The extension prepares the prompt and opens the terminal; everything afterwards is the standard CLI.
- **The user owns the prose.** Promotion changes the link's target but never its text — the link text was selected from the surrounding paragraph and must keep reading naturally.

## What the design does not provide

These are explicit non-features. They are non-features because the workflow assumes you are coordinating a single Claude session at a time.

- **No concurrent-agent isolation.** Two threads touching overlapping files will collide. See [sequential-agents-assumption.md](./sequential-agents-assumption.md).
- **No deep rollback.** Discarding undoes the link and deletes the scratch file. Anything the agent edited elsewhere stays put — `git restore` is the recovery tool, not the extension.
- **No cross-thread hierarchy.** Threads are a flat list. Cross-references between threads can be hand-authored as plain markdown links.
- **No cross-machine sync.** Thread metadata lives in VSCode's workspace state; it doesn't follow you to another machine or another clone of the same repo.

## When the extension is the right tool

You're reading or writing dense markdown and want to side-thread questions about specific passages without permanently scarring the document. The thread runs to a conclusion, and you either discard it or promote it into a permanent sibling note named after its content.

## When you have outgrown it

If your workflow shifts to multiple humans working in the same workspace, long-running automated agents, or hierarchical decompositions with parent–child semantics, the flat single-user model will start to bite. At that point a thicker system (with locking, isolation, and a real database) is the right next step.

## See also

- [sequential-agents-assumption.md](./sequential-agents-assumption.md) — the load-bearing assumption that makes the design viable.
- [reference/vscode-commands.md](../reference/vscode-commands.md) — the concrete contract of the three commands.
- [`specs/claude-threads.md`](../../specs/claude-threads.md) — the design spec.
