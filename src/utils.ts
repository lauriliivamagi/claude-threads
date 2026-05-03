export function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/**
 * Quote a string so a shell will pass it as a single argv to a command.
 *
 * Platform-aware: Windows assumes PowerShell (the default VSCode terminal),
 * other platforms assume a POSIX shell (bash/zsh/fish). Users on Windows with
 * `cmd.exe` configured as their default shell will need to switch to
 * PowerShell or a POSIX shell — `cmd.exe` has no portable single-argv quoting.
 */
export function shellQuote(s: string): string {
  if (process.platform === "win32") {
    // PowerShell single-quote: literal text, embedded ' is escaped as ''.
    return `'${s.replace(/'/g, "''")}'`;
  }
  // POSIX: close, escape ', reopen.
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

/**
 * Returns null if `text` is a viable link-text payload, or a user-facing
 * error message describing why it isn't.
 *
 * Reject conditions: a closing bracket would terminate the markdown link
 * mid-text, and a blank line is invalid inside CommonMark link text.
 */
export function validateSelectionForLink(text: string): string | null {
  if (text.includes("]")) {
    return "Selection contains a closing bracket ']', which would break the markdown link. Pick a different range.";
  }
  if (/\n[ \t]*\n/.test(text)) {
    return "Selection spans a blank line. Pick a range inside a single paragraph.";
  }
  return null;
}
