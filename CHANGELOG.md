# Changelog

All notable changes to this extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- `Threads: Promote Thread` now derives the title and slug locally from the `## Notes` body (first markdown heading, else first non-empty line) instead of calling `claude -p`. The `claude -p` path was metered and not covered by the Claude subscription; promotion no longer makes any `claude` call.

## [0.1.0] - 2026-05-03

### Added

- Initial public release of `claude-threads` (Claude Threads for Markdown).
- `Threads: Spawn from Selection` command — wraps a markdown selection in a link to a sibling `scratch-<timestamp>.md`, opens `claude` in a terminal with the prepared prompt.
- `Threads: Discard Thread` command — undoes the link insertion and deletes the scratch file.
- `Threads: Promote Thread` command — turns a thread's `## Notes` into a permanent `<slug>.md` named after its content; retargets the source link without altering the link text. Uses `claude -p` for title and slug derivation.
- Diataxis-classified documentation under `docs/` (tutorial, how-to guides, reference, explanation).
