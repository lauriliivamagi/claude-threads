import { describe, expect, it } from "vitest";
import { deriveTitle, deriveTitleSlug, slugify } from "./titleSlug";

describe("deriveTitle", () => {
  it("uses the first ATX heading in the notes", () => {
    expect(deriveTitle("## Load-bearing assumptions\n\nThe author relies on...")).toBe(
      "Load-bearing assumptions"
    );
  });

  it("prefers a heading even when a plain paragraph comes first", () => {
    expect(deriveTitle("Intro paragraph here.\n\n## Real Title\n\nbody")).toBe("Real Title");
  });

  it("strips closing-hash markers from a closed ATX heading", () => {
    expect(deriveTitle("### Three findings ###")).toBe("Three findings");
  });

  it("falls back to the first non-empty line when there is no heading", () => {
    expect(deriveTitle("\n\n  The author relies on three assumptions\nMore text")).toBe(
      "The author relies on three assumptions"
    );
  });

  it("strips a leading list marker from the fallback line", () => {
    expect(deriveTitle("- First bullet point about X")).toBe("First bullet point about X");
  });

  it("strips a leading blockquote marker and skips empty quote lines", () => {
    expect(deriveTitle("> \n> Quoted insight worth keeping")).toBe("Quoted insight worth keeping");
  });

  it("unwraps inline links to their text", () => {
    expect(deriveTitle("## See [the proof](./proof.md) closely")).toBe("See the proof closely");
  });

  it("removes inline emphasis and code markers", () => {
    expect(deriveTitle("## The **bold** `claim` is _weak_")).toBe("The bold claim is weak");
  });

  it("caps the title at eight words", () => {
    expect(deriveTitle("# one two three four five six seven eight nine ten")).toBe(
      "one two three four five six seven eight"
    );
  });

  it("strips trailing sentence punctuation", () => {
    expect(deriveTitle("A short summary line.")).toBe("A short summary line");
  });

  it("returns null when the notes are only whitespace", () => {
    expect(deriveTitle("   \n\n  \t  ")).toBeNull();
  });
});

describe("slugify", () => {
  it("lowercases and kebab-cases the title", () => {
    expect(slugify("Load-bearing Assumptions")).toBe("load-bearing-assumptions");
  });

  it("drops characters outside [a-z0-9-]", () => {
    expect(slugify("Why? Because X & Y!")).toBe("why-because-x-y");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("  ...trailing junk...  ")).toBe("trailing-junk");
  });

  it("caps the slug at fifty characters without a trailing dash", () => {
    const slug = slugify("a ".repeat(40).trim());
    expect(slug.length).toBeLessThanOrEqual(50);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("returns an empty string for symbols-only input", () => {
    expect(slugify("??? --- !!!")).toBe("");
  });
});

describe("deriveTitleSlug", () => {
  it("returns the derived title and its slug", () => {
    expect(deriveTitleSlug("## Real Title\n\nbody")).toEqual({
      title: "Real Title",
      slug: "real-title",
    });
  });

  it("returns null when no title can be derived", () => {
    expect(deriveTitleSlug("   \n\n   ")).toBeNull();
  });

  it("returns null when the title sanitizes to an empty slug", () => {
    expect(deriveTitleSlug("# ??? ---")).toBeNull();
  });
});
