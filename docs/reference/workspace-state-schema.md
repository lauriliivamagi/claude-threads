---
type: reference
domain: clear
audience: practitioner
stability: structural
authority:
  provenance: institutional
  verifiability: testable
  evidence: strong
  currency: dated
epistemic-layer: framework
---

# `workspaceState` Schema

The extension persists per-thread metadata into VSCode's `Memento` API under the workspace-scoped storage. The schema lives in [`packages/vscode/src/state.ts`](../../packages/vscode/src/state.ts).

## Storage

- **API**: [`vscode.ExtensionContext.workspaceState`](https://code.visualstudio.com/api/references/vscode-api#Memento) — a JSON-serializable key/value store scoped to the current workspace.
- **Key**: `threads.records`
- **Value**: `ThreadMeta[]` — array of records, in insertion order.

This survives VSCode reloads but is not visible to other workspaces.

## `ThreadMeta`

```ts
interface ThreadMeta {
  id: string; // crypto.randomUUID()
  createdAt: string; // ISO 8601 timestamp at spawn time
  inquiry: string; // verbatim user input from the spawn input box
  scratchPath: string; // workspace-relative POSIX path to the scratch file
  sourcePath: string; // workspace-relative POSIX path to the source markdown
  selectedText: string; // verbatim text the user had selected at spawn time
  scratchFilename: string; // basename of scratchPath (used for substring search at discard time)
  startLine: number; // 1-based line of selection.start
  endLine: number; // 1-based line of selection.end (inclusive)
}
```

### Field semantics

| Field             | Used by      | Notes                                                                           |
| ----------------- | ------------ | ------------------------------------------------------------------------------- |
| `id`              | discard      | Stable identity for the record. Never reused.                                   |
| `createdAt`       | discard UI   | Surfaced in the quick-pick if needed; not load-bearing for rollback.            |
| `inquiry`         | discard UI   | Used as the quick-pick label (truncated to ~80 chars).                          |
| `scratchPath`     | discard      | Resolved against `workspaceFolders[0].uri` to delete the scratch file.          |
| `sourcePath`      | discard      | Resolved against `workspaceFolders[0].uri` to open the source for link removal. |
| `selectedText`    | discard      | Substring-matched inside the source to locate the inserted link.                |
| `scratchFilename` | discard      | Combined with `selectedText` to build the exact link text to find.              |
| `startLine`       | spawn prompt | Embedded in the Claude prompt and in the scratch file's `## Source` section.    |
| `endLine`         | spawn prompt | As above; collapsed into a single line when `startLine === endLine`.            |

## Public API (extension-internal)

From [`state.ts`](../../packages/vscode/src/state.ts):

```ts
function listThreads(memento: Memento): ThreadMeta[];
function addThread(memento: Memento, thread: ThreadMeta): Promise<void>;
function removeThread(memento: Memento, id: string): Promise<void>;
function getThread(memento: Memento, id: string): ThreadMeta | undefined;
```

`listThreads` is total (defaults to `[]` when the key has never been written). `addThread` and `removeThread` rewrite the entire array.

## Lifecycle

- **Created** by `threads.spawnFromSelection` after the scratch file has been written and the link successfully inserted.
- **Read** by `threads.discardThread` to populate the quick-pick.
- **Removed** by `threads.discardThread` after rollback completes (or partially completes).

There is no migration. If you change the schema, increment the storage key (e.g. `threads.records.v2`) and migrate explicitly.

## Inspecting state directly

VSCode does not expose `workspaceState` to users. To inspect during development, log it from `extension.ts`:

```ts
console.log(context.workspaceState.get("threads.records"));
```

Or call `Threads: Discard Thread` and read the picker — every recorded thread shows up there.
