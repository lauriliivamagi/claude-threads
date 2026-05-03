---
type: explanation
domain: complex
audience: practitioner
stability: structural
authority:
  provenance: institutional
  verifiability: asserted
  evidence: moderate
  currency: dated
epistemic-layer: heuristic
---

# The Sequential Agents Assumption

The Threads extension assumes you run one Claude agent at a time. This page explains what that means in practice and what happens if you violate it.

## The assumption, stated plainly

> Only one Claude agent edits the working tree at a time. The user is responsible for enforcing this.

Concretely: when thread A's terminal is actively running `claude` and that conversation is editing files, you do not start thread B until A is done — or, if you do, you accept that the two agents may step on each other.

## Why the assumption exists

Per-thread filesystem isolation would require either an explicit lock or a separate working copy per thread. Both are heavier than the workflow needs in practice, so the extension does neither and treats the assumption as load-bearing instead.

## What the system does **not** do

- It does **not** lock the working tree while a thread's terminal is running.
- It does **not** block `Threads: Spawn from Selection` while another thread is active.
- It does **not** detect or warn about overlapping edits across threads.
- It does **not** snapshot files at thread-start to support whole-file rollback.

If any of these would be valuable to you, they need to be added explicitly. Don't expect them out of the box.

## What this means at the keyboard

A few practical rules of thumb:

- **Wait for the terminal to settle.** Treat the `claude` terminal like a workshop — you don't start a second job in the same workspace until the current job has stopped touching files.
- **Commit between threads.** A clean working tree at the start of each thread makes it trivial to undo whatever happens. `git stash` works too.
- **Use `git status`, not the picker, to know what's pending.** The discard picker only knows about _creation_ artifacts. It can't tell you whether thread A wrote a half-finished refactor across `src/`.
- **If two threads must run at once**, prefer letting them touch disjoint paths (e.g., one editing `docs/`, the other editing `tests/`). The system won't enforce this, but enforcing it yourself is much cheaper than untangling a collision.

## What goes wrong if you violate the assumption

The most common failure modes are:

- **Lost edits.** Agent A writes to a file; agent B reads a stale buffer, edits, and saves. A's changes are overwritten.
- **Inconsistent state across files.** A renames a function in `foo.ts`; B keeps using the old name in `bar.ts`. Neither sees the other's change.
- **Confused conversations.** Agent A's terminal shows files in a state that no longer matches disk because B has touched them.

None of these are catastrophic — `git diff` and `git restore` recover from all of them — but they are slower and less pleasant than just running threads one at a time.

## When you should formalize the assumption

If your workflow shifts toward multiple concurrent agents (multiple humans, long-running automated agents, CI integration), you've outgrown this design. Possible paths forward:

- Run agents in disjoint working copies — separate clones, or git worktrees — so the OS does the isolation for you.
- Add an explicit lockfile and have the spawn command refuse if a previous thread is still active.
- Move thread coordination into a separate orchestrator that knows about file ownership.

Until then, the assumption is load-bearing. Treat it as a promise you make to the system, not a feature it enforces.

## See also

- [design-rationale.md](./design-rationale.md) — the design choices this assumption supports.
- [how-to-guides/discard-a-thread.md](../how-to-guides/discard-a-thread.md) — the rollback that exists, and what it doesn't cover.
