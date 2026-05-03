import { describe, expect, it } from "vitest";
import { shellQuote, truncate, validateSelectionForLink } from "./utils";

describe("truncate", () => {
  it("returns the input unchanged when under the limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns the input unchanged when at the limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates with an ellipsis when over the limit", () => {
    expect(truncate("hello world", 6)).toBe("hello…");
  });
});

describe("shellQuote", () => {
  // The current process platform determines the quoting flavor; the tests
  // run in node, so process.platform is fixed for the duration of the run.
  // We assert the invariants that hold on either platform: the result is
  // single-quoted, and a literal apostrophe inside cannot terminate the quote.
  it("wraps a simple string in single quotes", () => {
    expect(shellQuote("hello")).toBe("'hello'");
  });

  it("escapes embedded single quotes so the result is one shell argv", () => {
    const quoted = shellQuote("it's a thing");
    expect(quoted.startsWith("'")).toBe(true);
    expect(quoted.endsWith("'")).toBe(true);
    // Whichever escape style is in use, no naked `'` should appear with text
    // after it that isn't an immediate continuation of the quoted string.
    if (process.platform === "win32") {
      expect(quoted).toBe("'it''s a thing'");
    } else {
      expect(quoted).toBe(`'it'\\''s a thing'`);
    }
  });

  it("preserves whitespace and special chars inside the quotes", () => {
    const out = shellQuote('a "b" $c `d` \\e');
    expect(out).toContain('a "b" $c `d` \\e');
  });
});

describe("validateSelectionForLink", () => {
  it("accepts a simple single-line selection", () => {
    expect(validateSelectionForLink("a normal phrase")).toBeNull();
  });

  it("accepts multi-line text within a single paragraph", () => {
    expect(validateSelectionForLink("line one\nline two")).toBeNull();
  });

  it("rejects a selection containing a closing bracket", () => {
    const reason = validateSelectionForLink("see [foo] here");
    expect(reason).toMatch(/closing bracket/);
  });

  it("rejects a selection that spans a blank line", () => {
    const reason = validateSelectionForLink("para 1\n\npara 2");
    expect(reason).toMatch(/blank line/);
  });

  it("treats a blank line with only whitespace as a paragraph break", () => {
    expect(validateSelectionForLink("para 1\n   \npara 2")).toMatch(/blank line/);
  });
});
