import { describe, it, expect } from "vitest";
import { getByPath, setByPath, isValidContentPath } from "@/lib/content-path";

describe("content-path", () => {
  it("gets nested values by dot path", () => {
    const obj = { hero: { title: "Hello" } };
    expect(getByPath(obj, "hero.title")).toBe("Hello");
  });

  it("sets nested values by dot path", () => {
    const obj: Record<string, unknown> = { hero: { title: "Hello" } };
    setByPath(obj, "hero.title", "World");
    expect(getByPath(obj, "hero.title")).toBe("World");
  });

  it("sets array index values", () => {
    const obj: Record<string, unknown> = { portfolio: [{ image: "a.jpg" }] };
    setByPath(obj, "portfolio.0.image", "b.jpg");
    expect(getByPath(obj, "portfolio.0.image")).toBe("b.jpg");
  });

  it("validates content paths", () => {
    expect(isValidContentPath("hero.title")).toBe(true);
    expect(isValidContentPath("invalid.path")).toBe(false);
    expect(isValidContentPath("")).toBe(false);
  });
});
