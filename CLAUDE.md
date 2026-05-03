# CLAUDE.md

`claude-threads` (display name: **Claude Threads for Markdown**). VSCode extension that spawns Claude Code conversations anchored to selections in markdown documents. Single-package TypeScript project. Thread metadata is persisted in `context.workspaceState`.

## Layout

```text
src/
├── extension.ts             # activation, command registration
├── state.ts                 # ThreadMeta workspaceState wrapper
├── scratchFile.ts           # pure scratch-file content renderer
├── linkInsertion.ts         # link build / find-and-remove helpers
└── commands/
    ├── spawnFromSelection.ts
    ├── discardThread.ts
    └── promoteThread.ts
docs/                        # Diataxis docs (tutorials/how-to/reference/explanation)
specs/claude-threads.md      # design spec
```

## Commands

```bash
pnpm install         # bootstrap
pnpm check           # tsc --noEmit
pnpm test            # vitest run (unit tests for pure modules)
pnpm build           # tsc -p tsconfig.build.json (emits to dist/)
pnpm build:bundle    # esbuild bundle (single dist/extension.js, used by vsce package)
pnpm lint            # eslint .
pnpm fmt:check       # prettier --check
pnpm package         # vsce package → claude-threads-<version>.vsix
```

Press `F5` in VSCode to launch the extension dev host.

## Contributed commands

| ID                           | Title                         |
| ---------------------------- | ----------------------------- |
| `threads.spawnFromSelection` | Threads: Spawn from Selection |
| `threads.discardThread`      | Threads: Discard Thread       |
| `threads.promoteThread`      | Threads: Promote Thread       |

See [docs/reference/vscode-commands.md](docs/reference/vscode-commands.md) for full contracts.

## Known gotchas

- VSCode extensions must be CommonJS — the host loads them via `require()`. Keep `"type": "commonjs"` and `"module": "CommonJS"` in tsconfig.
- The `claude` CLI must be on `PATH`. `spawnFromSelection` opens a terminal that runs `claude '<prompt>'`. `promoteThread` runs `claude -p '<prompt>'` non-interactively to derive a title and slug.
