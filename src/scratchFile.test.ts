import { describe, expect, it } from "vitest";
import { renderScratchFile } from "./scratchFile";

describe("renderScratchFile", () => {
  it("renders single-line range without a dash", () => {
    const out = renderScratchFile({
      inquiry: "Why is this passage important?",
      sourceRelativePath: "docs/notes.md",
      startLine: 12,
      endLine: 12,
      selectedText: "the load-bearing assumption",
      backLinkRelative: "../docs/notes.md",
    });

    expect(out).toContain("[docs/notes.md:12](../docs/notes.md)");
    expect(out).not.toContain("12-12");
  });

  it("renders a multi-line range as start-end", () => {
    const out = renderScratchFile({
      inquiry: "What does this mean?",
      sourceRelativePath: "a.md",
      startLine: 5,
      endLine: 9,
      selectedText: "first\nsecond",
      backLinkRelative: "./a.md",
    });

    expect(out).toContain("[a.md:5-9](./a.md)");
  });

  it("blockquotes each line of the selection", () => {
    const out = renderScratchFile({
      inquiry: "x",
      sourceRelativePath: "a.md",
      startLine: 1,
      endLine: 3,
      selectedText: "alpha\nbeta\ngamma",
      backLinkRelative: "./a.md",
    });

    expect(out).toContain("> alpha\n> beta\n> gamma");
  });

  it("ends with an empty Notes section so the agent can append", () => {
    const out = renderScratchFile({
      inquiry: "x",
      sourceRelativePath: "a.md",
      startLine: 1,
      endLine: 1,
      selectedText: "y",
      backLinkRelative: "./a.md",
    });

    expect(out.endsWith("## Notes\n\n")).toBe(true);
  });

  it("places the inquiry, source, excerpt, and notes sections in a stable order", () => {
    const out = renderScratchFile({
      inquiry: "Q",
      sourceRelativePath: "a.md",
      startLine: 1,
      endLine: 1,
      selectedText: "S",
      backLinkRelative: "./a.md",
    });

    const inquiryIdx = out.indexOf("# Inquiry");
    const sourceIdx = out.indexOf("## Source");
    const excerptIdx = out.indexOf("## Selected excerpt");
    const notesIdx = out.indexOf("## Notes");

    expect(inquiryIdx).toBeGreaterThanOrEqual(0);
    expect(sourceIdx).toBeGreaterThan(inquiryIdx);
    expect(excerptIdx).toBeGreaterThan(sourceIdx);
    expect(notesIdx).toBeGreaterThan(excerptIdx);
  });
});
