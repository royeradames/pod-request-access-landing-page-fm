import { expect, test, type Page } from "@playwright/test";

const platforms = ["Spotify", "Apple Podcasts", "Google Podcasts", "Pocket Casts"];
const box = async (page: Page, selector: string) => (await page.locator(selector).first().boundingBox())!;
const near = (actual: number, expected: number, tolerance = 2) => expect(Math.abs(actual - expected), `${actual} vs ${expected}`).toBeLessThanOrEqual(tolerance);

test("renders the supplied copy, landmarks and platform logos", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Pod request access landing page | Royer Adames");
  await expect(page.getByRole("banner").getByRole("img", { name: "Pod" })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText("Challenge by Frontend Mentor. Built by Royer Adames.");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Publish your podcasts everywhere.");
  await expect(page.getByText("Upload your audio to Pod with a single click.")).toBeVisible();
  const list = page.getByRole("region", { name: "Podcast platforms" }).getByRole("listitem");
  await expect(list).toHaveCount(4);
  for (const name of platforms) {
    const logo = page.getByRole("img", { name, exact: true });
    await expect(logo).toBeVisible();
    expect(await logo.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await expect(page.getByText("Demo only: nothing is sent.")).toBeVisible();
});

test("declares one site name in the logo, og:site_name and WebSite JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".brand img")).toHaveAttribute("alt", "Pod");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Pod");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Request early access to Pod/);
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: "Pod", url: "https://pod-request-access-landing-page-fm.royeradames.com" });
});

test("uses the Figma type scale and colours", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveCSS("font-size", "48px");
  await expect(heading).toHaveCSS("font-weight", "300");
  await expect(heading).toHaveCSS("text-transform", "uppercase");
  await expect(page.locator(".headline-accent")).toHaveCSS("color", "rgb(84, 230, 175)");
  await expect(page.locator(".headline-plain")).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(page.locator(".lede")).toHaveCSS("font-size", "18px");
  await expect(page.locator(".lede")).toHaveCSS("color", "rgb(194, 203, 229)");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(18, 23, 37)");
  await expect(page.locator(".request-row")).toHaveCSS("background-color", "rgb(44, 52, 75)");
  await expect(page.locator(".request-button")).toHaveCSS("background-color", "rgb(84, 230, 175)");
  expect(await heading.evaluate(() => document.fonts.check('300 48px "Chivo"') || [...document.fonts].some(font => font.family.includes("Chivo") && font.status === "loaded"))).toBe(true);
});

test("follows the Figma desktop frame at 1440", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  const logo = await box(page, ".brand img");
  near(logo.x, 160); near(logo.y, 153); near(logo.width, 135); near(logo.height, 56);
  const panel = await box(page, ".panel");
  near(panel.x, 160); near(panel.y, 313); near(panel.width, 736); near(panel.height, 494, 4);
  const heading = await box(page, "h1");
  near(heading.y, 401);
  const visual = await box(page, ".visual");
  near(visual.x, 544); near(visual.y, 153); near(visual.x + visual.width, 1440); near(visual.height, 654, 4);
  const row = await box(page, ".request-row");
  near(row.width, 448); near(row.height, 52);
  const button = await box(page, ".request-button");
  near(button.width, 172); near(button.height, 44);
  const dots = await box(page, ".dots");
  near(dots.x + dots.width, 1440); near(dots.y, 755, 4);
  const logos = await box(page, ".platforms ul");
  expect(logos.y).toBeGreaterThan(row.y + row.height);
});

test("follows the Figma tablet frame at 768", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const logo = await box(page, ".brand img");
  near(logo.x, 44); near(logo.y, 156);
  const visual = await box(page, ".visual");
  near(visual.x, 308); near(visual.y, 0); near(visual.width, 460); near(visual.height, 868);
  const panel = await box(page, ".panel");
  near(panel.x, 44); near(panel.y, 316); near(panel.width, 592);
  near(panel.y + panel.height, 868, 6);
  await expect(page.locator(".host")).toHaveCSS("opacity", "1");
});

test("follows the Figma mobile frame at 375", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const logo = await box(page, ".brand img");
  near(logo.x, 120);
  const input = await box(page, ".request-input");
  near(input.x, 36); near(input.width, 303); near(input.height, 44);
  const button = await box(page, ".request-button");
  near(button.width, 303); near(button.height, 44);
  expect(button.y).toBeGreaterThan(input.y + input.height);
  const logos = await box(page, ".platforms ul");
  expect(logos.y + logos.height).toBeLessThan(input.y);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("text-align", "center");
  await expect(page.locator(".host")).toHaveCSS("opacity", "0.1");
  await expect(page.locator(".dots")).toBeHidden();
});

test("fits narrow and wide layouts with the family text and target floors", async ({ page }) => {
  for (const width of [320, 375, 400, 600, 768, 1024, 1100, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`).toBe(true);
    const smallText = await page.locator("h1, p, input, button, footer, footer a").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    for (const control of await page.locator("a, button, input").all()) {
      const controlBox = await control.boundingBox();
      expect(controlBox?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("an empty submit shows the add-email error and moves focus to the field", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  const input = page.getByLabel("Email address");
  const button = page.getByRole("button", { name: "Request Access" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Oops! Please add your email")).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", "email-error demo-note");
  await expect(page.locator(".request-row")).toHaveCSS("box-shadow", "rgb(251, 62, 62) 0px 0px 0px 2px inset");
  await expect(page.locator(".request-error")).toHaveCSS("color", "rgb(251, 62, 62)");
});

test("a malformed email shows the check-email error, clears once fixed, and mobile marks the field", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const input = page.getByLabel("Email address");
  await input.fill("john#mail.com");
  await page.getByRole("button", { name: "Request Access" }).click();
  await expect(page.getByText("Oops! Please check your email")).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveCSS("border-top-color", "rgb(251, 62, 62)");
  const error = await box(page, ".request-error");
  const button = await box(page, ".request-button");
  expect(error.y).toBeGreaterThan(button.y + button.height);
  await input.fill("john@mail.com");
  await expect(page.locator(".request-error")).toHaveCount(0);
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
});

test("a valid email shows a busy, focusable button, then confirms without sending anything", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
  await page.goto("/");
  const input = page.getByLabel("Email address");
  await input.fill("  john@mail.com ");
  await input.press("Enter");
  const busy = page.getByRole("button", { name: "Requesting…" });
  await expect(busy).toHaveAttribute("aria-busy", "true");
  await expect(busy).toBeEnabled();
  await busy.focus();
  await expect(busy).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Thanks! john@mail.com is on the demo list. Nothing was sent.");
  await expect(page.getByRole("button", { name: "Request Access" })).not.toHaveAttribute("aria-busy", "true");
  await expect(input).toHaveValue("");
  await expect(page.locator(".request-error")).toHaveCount(0);
  expect(writes).toEqual([]);
});

test("keyboard order and hover follow the design states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const input = page.getByLabel("Email address");
  await expect(input).toBeFocused();
  await expect(page.locator(".request-row")).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  const button = page.getByRole("button", { name: "Request Access" });
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Frontend Mentor" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Royer Adames" })).toBeFocused();
  await button.hover();
  await expect(button).toHaveCSS("background-color", "rgb(170, 243, 215)");
});
