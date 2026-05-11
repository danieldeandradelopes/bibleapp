import { expect, test } from "@playwright/test";

test("redirects root to today screen", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(page.getByText("Hoje")).toBeVisible();
});
