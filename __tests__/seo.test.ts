import { describe, it, expect } from "vitest";
import { createPageMetadata } from "@/lib/seo";

describe("seo", () => {
  it("creates page metadata with title and path", () => {
    const meta = createPageMetadata({
      title: "About",
      description: "About page",
      path: "/about",
    });
    expect(meta.title).toBe("About");
    expect(meta.description).toBe("About page");
    expect(meta.alternates?.canonical).toContain("/about");
  });
});
