# Claude Threads for Markdown

Spawn Claude Code conversations anchored to selections in your markdown documents — without permanently scarring the prose.

<!-- Replace with a real recording before tagging v0.1.0. -->

![Demo: spawn → converse → promote](images/demo.gif)

## The problem

You're reading a dense markdown document and hit a passage you want to ask Claude about. Two bad options:

- **Inline a permanent link.** The link survives in the prose forever, even when the question turns out to be a dead end.
- **Ask Claude in a separate window.** The trail back to the passage evaporates.

You want a third path: a side-thread anchored to the exact selection, easy to either discard cleanly or promote into a permanent note when the conversation produces something worth keeping.

## The solution

Claude Threads turns any markdown selection into a one-command conversation:

1. Highlight the passage. Right-click → **Threads: Spawn from Selection**, type your inquiry.
2. The selection becomes a markdown link to a sibling `scratch-<timestamp>.md`. A terminal opens with `claude` already loaded with the inquiry, source location, and scratch path as context.
3. When the thread runs to its conclusion, run one of:
   - **Threads: Discard Thread** — link reverts, scratch file deletes. Nothing in the document changes; the trail closes silently.
   - **Threads: Promote Thread** — a title and slug are derived locally from your `## Notes` body, the scratch file becomes a named permanent note, and the link's target retargets in place. The link text stays exactly as you selected it.

Three commands. The document keeps reading naturally throughout.

## Install

Marketplace publishing is deferred to a later release. For now, install the `.vsix` from GitHub Releases:

```sh
# Download claude-threads-<version>.vsix from
#   https://github.com/lauriliivamagi/claude-threads/releases
code --install-extension claude-threads-<version>.vsix
```

Or build from source:

```sh
pnpm install
pnpm build:bundle      # produces dist/extension.js
# Press F5 in VSCode to launch the Extension Development Host
```

## Requirements

- VSCode 1.85+
- The [Claude Code](https://claude.com/claude-code) CLI on your `PATH`. The extension runs `claude` (interactive) when you spawn a thread. Promote needs no `claude` call — its title and slug are derived locally.

## Documentation

Three entry points, organised by [Diataxis](https://diataxis.fr/):

| If you want to…                              | Read                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| Run it for the first time                    | [docs/tutorials/getting-started.md](docs/tutorials/getting-started.md) |
| Look up a command, file, or schema           | [docs/reference/](docs/reference/)                                     |
| Understand why the system is shaped this way | [docs/explanation/](docs/explanation/)                                 |

The design spec lives at [specs/claude-threads.md](specs/claude-threads.md).

## Acknowledgements

Built in collaboration with Claude Code (Anthropic). Most of the implementation, documentation, and design discussion happened as a pair-programming session.

## License

[MIT](LICENSE).
