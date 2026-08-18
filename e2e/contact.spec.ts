import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("submits successfully", async ({ page }) => {
    await page.goto("/contact");

    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.fill("#subject", "Test Subject");
    await page.fill("#message", "This is a test message for the contact form.");

    await page.click('button[type="submit"]');

    await expect(page.getByRole("heading", { name: "Message sent!" })).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Home page", () => {
  test("loads and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("Admin login", () => {
  test("shows login form", async ({ page }) => {
    await page.goto("/portal");
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
  });

  test("logs in with valid credentials", async ({ page }) => {
    await page.goto("/portal");
    await page.fill('input[name="username"], input[type="text"]', "admin");
    await page.fill('input[name="password"], input[type="password"]', "testpassword123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/portal\/(admin|seo)/, { timeout: 15000 });
  });
});
