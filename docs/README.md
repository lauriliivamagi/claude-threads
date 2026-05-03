---
type: reference
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

# `claude-threads` Documentation

A VSCode extension that spawns Claude Code conversations anchored to selections in markdown documents. Each conversation is a single `scratch-<timestamp>.md` file written next to the source, with a markdown link wrapping the selected text. Thread metadata lives in VSCode's `workspaceState`.

For the design spec, see [`specs/claude-threads.md`](../specs/claude-threads.md). For the design choices and their tradeoffs, see [explanation/design-rationale.md](./explanation/design-rationale.md).

## Reading order

This documentation follows the [Diataxis](https://diataxis.fr/) framework. Pick the corner that matches what you're trying to do:

| If you want to…                                | Read…                                                          |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Get the extension running for the first time   | [tutorials/getting-started.md](./tutorials/getting-started.md) |
| Do a specific task                             | [how-to-guides/](./how-to-guides/)                             |
| Look up a command, file, or schema             | [reference/](./reference/)                                     |
| Understand _why_ the system is shaped this way | [explanation/](./explanation/)                                 |

## Tutorials

- [Getting Started: Your First Thread](./tutorials/getting-started.md) — install, build, and spawn one thread end-to-end.

## How-to guides

- [Spawn a thread from a markdown selection](./how-to-guides/spawn-a-thread.md)
- [Discard a thread (roll back the creation artifacts)](./how-to-guides/discard-a-thread.md)
- [Promote a thread to a permanent note](./how-to-guides/promote-a-thread.md)

## Reference

- [VSCode commands](./reference/vscode-commands.md) — the two contributed commands and their contracts.
- [Scratch file format](./reference/scratch-file-format.md) — filename pattern and content layout.
- [`workspaceState` schema](./reference/workspace-state-schema.md) — the `ThreadMeta` records the extension persists.

## Explanation

- [Design choices](./explanation/design-rationale.md) — what the design optimizes for and what it deliberately doesn't try to do.
- [The sequential agents assumption](./explanation/sequential-agents-assumption.md) — the operating assumption you must respect.

## Example content

Two markdown files in this directory exist as **subjects** the extension can be tried out on, not as documentation about the extension itself:

- [`example-text-1.md`](./example-text-1.md) — a layered Design-Science-Research walkthrough used in the getting-started tutorial.
- [`compatible-ontologies-for-dsr.md`](./compatible-ontologies-for-dsr.md) — a side analysis linked from the example.
