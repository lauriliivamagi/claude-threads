import { describe, expect, it } from "vitest";
import { buildLinkText, findLinkByTarget, findLinkTargetSpans } from "./linkInsertion";

describe("buildLinkText", () => {
  it("wraps the selection in a markdown link with a relative target", () => {
    expect(buildLinkText("the passage", "scratch-2026.md")).toBe(
      "[the passage](./scratch-2026.md)"
    );
  });

  it("preserves multi-line selection text verbatim", () => {
    expect(buildLinkText("alpha\nbeta", "s.md")).toBe("[alpha\nbeta](./s.md)");
  });
});

describe("findLinkByTarget", () => {
  it("returns null when the target is absent", () => {
    expect(findLinkByTarget("plain text", "scratch-1.md")).toBeNull();
  });

  it("locates a simple link", () => {
    const doc = "before [my passage](./scratch-1.md) after";
    const found = findLinkByTarget(doc, "scratch-1.md");
    expect(found).toEqual({
      start: doc.indexOf("["),
      end: doc.indexOf(")") + 1,
      linkText: "my passage",
    });
  });

  it("walks back past balanced brackets in the link text", () => {
    const doc = "x [outer [inner] still outer](./s.md) y";
    const found = findLinkByTarget(doc, "s.md");
    expect(found?.linkText).toBe("outer [inner] still outer");
    expect(doc.slice(found!.start, found!.end)).toBe("[outer [inner] still outer](./s.md)");
  });

  it("does not match a link to a different target", () => {
    expect(findLinkByTarget("a [t](./other.md) b", "scratch-1.md")).toBeNull();
  });
});

describe("findLinkTargetSpans", () => {
  it("returns an empty list when no occurrences", () => {
    expect(findLinkTargetSpans("nothing", "s.md")).toEqual([]);
  });

  it("returns one span per occurrence of the target", () => {
    const doc = "[a](./s.md) and [b](./s.md)";
    const spans = findLinkTargetSpans(doc, "s.md");
    expect(spans).toHaveLength(2);
    expect(doc.slice(spans[0].start, spans[0].end)).toBe("](./s.md)");
    expect(doc.slice(spans[1].start, spans[1].end)).toBe("](./s.md)");
  });

  it("does not match a different filename", () => {
    expect(findLinkTargetSpans("[a](./other.md)", "s.md")).toEqual([]);
  });
});
