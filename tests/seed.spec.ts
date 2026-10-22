import { test } from '@playwright/test';

test('seed test', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');
});