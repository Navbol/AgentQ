import { expect, test } from '@playwright/test';
import { ContactPage } from './pages/ContactPage';

test('envía un mensaje desde Contact y confirma el envío', async ({ page }) => {
  const contactPage = new ContactPage(page);

  await page.goto('https://www.demoblaze.com/');
  await expect(page).toHaveTitle('STORE');

  await contactPage.open();
  await expect(contactPage.heading).toBeVisible();

  const confirmation = await contactPage.sendMessage(
    'buyer@example.test',
    'Test Buyer',
    'Consulta de prueba sobre un producto.',
  );
  expect(confirmation).toBe('Thanks for the message!!');
});
