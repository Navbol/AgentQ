import { expect, test } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';

test('completa la compra de una laptop desde el carrito', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await homePage.open();
  await expect(page).toHaveTitle('STORE');
  await expect(homePage.categoryLink('Laptops')).toBeVisible();

  const categoryResponse = await homePage.selectCategory('Laptops');
  expect(categoryResponse.status()).toBe(200);
  await expect(homePage.productLink('MacBook air')).toBeVisible({ timeout: 15000 });

  await homePage.openProduct('MacBook air');
  await expect(productPage.heading('MacBook air')).toBeVisible();

  const addToCartDialog = await productPage.addToCart();
  expect(addToCartDialog.message()).toBe('Product added');
  await addToCartDialog.accept();

  const cartResponse = await cartPage.open();
  expect(cartResponse.status()).toBe(200);
  await expect(cartPage.heading).toBeVisible();
  await expect(cartPage.productRow('MacBook air')).toContainText('700', { timeout: 15000 });
  await expect(cartPage.total).toHaveText('700');

  await cartPage.startOrder();
  const orderDialog = cartPage.orderDialog;
  await expect(orderDialog.getByRole('heading', { name: 'Place order' })).toBeVisible();
  await cartPage.fillOrderForm({
    name: 'Test Buyer',
    country: 'Testland',
    city: 'Test City',
    creditCard: '4111111111111111',
    month: '12',
    year: '2030',
  });
  await orderDialog.getByRole('button', { name: 'Purchase', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Thank you for your purchase!' })).toBeVisible();
  await expect(page.getByText(/Amount: 700 USD/)).toBeVisible();
  await expect(page.getByText(/Name: Test Buyer/)).toBeVisible();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
});