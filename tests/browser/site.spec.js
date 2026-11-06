const { test, expect } = require("@playwright/test");
for (const width of [390, 1440])
  test(`navigation and route content ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const opener = page.getByRole("button", { name: "open menu" });
    await opener.click();
    const menu = page.getByRole("dialog", { name: "Website menu" });
    await expect(menu).toBeVisible();
    await menu
      .getByRole("button", { name: "Food, Drinks & Dining", exact: true })
      .click();
    await expect(
      menu.getByRole("link", { name: "Yujo Izakaya", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).not.toBeVisible();
    await expect(opener).toBeFocused();
    await page.screenshot({ path: `/tmp/nyan-home-after-${width}.png` });
    await page.goto("/events", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "Our Events" }),
    ).toBeVisible();
    await page
      .getByRole("searchbox", { name: "Search events" })
      .fill("no-such-event-123");
    await expect(page.getByRole("status")).toHaveText("No events found");
    await page.getByRole("searchbox").fill("");
    const details = page.getByRole("link", { name: "Details" }).first();
    await details.click();
    await expect(page.locator("main h1")).toBeVisible();
    await page.goto("/rental-interest", { waitUntil: "domcontentloaded" });
    await page.locator(".rental-inquiry > summary").click();
    await expect(page.getByLabel("Business name")).toBeVisible();
    await page.screenshot({ path: `/tmp/nyan-rental-after-${width}.png` });
    expect(errors).toEqual([]);
  });
test("invalid webhook cannot trigger revalidation", async ({ request }) => {
  const response = await request.post("/api/revalidate", {
    data: { type: "siteNavigation" },
  });
  expect([401, 503]).toContain(response.status());
});

test("form prevents duplicate submission and preserves successful partial delivery message", async ({
  page,
}) => {
  let sends = 0;
  await page.route("**/api/contact", async (route) => {
    sends++;
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({
      json: {
        message:
          "Your interest was received. The confirmation email could not be sent.",
      },
    });
  });
  await page.goto("/events");
  await page.getByRole("link", { name: "Details" }).first().click();
  await page.getByText("Register interest", { exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByLabel("Phone number").fill("+256 123456789");
  await page.getByRole("button", { name: "Submit interest" }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText(
    "Your interest was received",
  );
  expect(sends).toBe(1);
});
test("contact rejects malformed requests without sending mail", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: { type: "rental", name: {} },
  });
  expect(response.status()).toBe(400);
  expect((await response.json()).errors.email).toBeTruthy();
  const method = await request.get("/api/contact");
  expect(method.status()).toBe(405);
});

test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(www\.youtube\.com|cloud\.umami\.is)\//,
    (route) => route.abort(),
  );
});
