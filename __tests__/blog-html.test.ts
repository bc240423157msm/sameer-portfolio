import { describe, it, expect } from "vitest";
import {
  isHtmlContent,
  plainTextToHtml,
  sanitizeBlogHtml,
  countWordsFromHtml,
  readingTimeMinutes,
} from "@/lib/blog-html";
import { metaDescriptionStatus, checkFocusKeyword } from "@/lib/blog-seo";

describe("blog-html", () => {
  it("detects HTML content", () => {
    expect(isHtmlContent("<p>Hello</p>")).toBe(true);
    expect(isHtmlContent("Plain text only")).toBe(false);
  });

  it("converts plain text paragraphs to HTML", () => {
    const html = plainTextToHtml("First para.\n\nSecond para.");
    expect(html).toContain("<p>First para.</p>");
    expect(html).toContain("<p>Second para.</p>");
  });

  it("sanitizes dangerous tags", () => {
    const result = sanitizeBlogHtml('<p>Safe</p><script>alert("x")</script>');
    expect(result).toContain("Safe");
    expect(result).not.toContain("script");
  });

  it("counts words and estimates reading time", () => {
    const html = "<p>" + "word ".repeat(200) + "</p>";
    expect(countWordsFromHtml(html)).toBe(200);
    expect(readingTimeMinutes(html)).toBe(1);
  });
});

describe("blog-seo", () => {
  it("rates meta description length", () => {
    expect(metaDescriptionStatus("x".repeat(150)).status).toBe("ideal");
    expect(metaDescriptionStatus("short").status).toBe("short");
    expect(metaDescriptionStatus("x".repeat(200)).status).toBe("long");
  });

  it("checks focus keyword placement", () => {
    const result = checkFocusKeyword("nextjs", {
      title: "Building with Next.js",
      excerpt: "A guide to Next.js SEO",
      contentHtml: "<p>Intro about Next.js</p><h2>Why Next.js rocks</h2>",
    });
    expect(result?.inTitle).toBe(true);
    expect(result?.inH2).toBe(true);
  });
});
