import { expect, test } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';

test('agrega una laptop al carrito y la muestra en la lista', async ({ page }, testInfo) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const eventLog: string[] = [];
  const log = (event: string) => {
    eventLog.push(`${new Date().toISOString()} ${event}`);
  };

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      log(`CONSOLE ${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => log(`PAGE ERROR: ${error.message}`));
  page.on('request', (request) => {
    if (
      request.resourceType() === 'document' ||
      request.url().includes('/entries') ||
      request.url().includes('/bycat') ||
      request.method() !== 'GET'
    ) {
      log(`REQUEST ${request.method()} ${request.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    log(`REQUEST FAILED ${request.method()} ${request.url()}: ${request.failure()?.errorText ?? 'unknown error'}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      log(`HTTP ${response.status()} ${response.url()}`);
    }
  });
  page.on('dialog', (dialog) => log(`DIALOG ${dialog.type()}: ${dialog.message()}`));

  try {
    await test.step('1. Abrir la tienda y validar que cargó', async () => {
      const browserVersion = page.context().browser()?.version();
      expect(browserVersion).toMatch(/^\d+\./);
      log(`BROWSER Google Chrome ${browserVersion}`);
      log('START abrir tienda');
      await homePage.open();
      await expect(page).toHaveTitle('STORE');
      await expect(homePage.categoryLink('Laptops')).toBeVisible();
      await expect(homePage.productLink('Samsung galaxy s6')).toBeVisible({ timeout: 15000 });
      log(`PASS tienda cargada: ${page.url()} | título=${await page.title()}`);
    });

    await test.step('2. Abrir Laptops y validar los productos', async () => {
      log('START seleccionar categoría Laptops');
      const categoryResponse = await homePage.selectCategory('Laptops');
      expect(categoryResponse.status()).toBe(200);
      log(`PASS respuesta de categoría: HTTP ${categoryResponse.status()}`);
      for (const laptopName of ['Sony vaio i5', 'Sony vaio i7', 'MacBook air']) {
        await expect(homePage.productLink(laptopName)).toBeVisible({ timeout: 15000 });
        log(`PASS producto visible: ${laptopName}`);
      }
    });

    await test.step('3. Abrir MacBook air y validar sus detalles', async () => {
      log('START abrir producto MacBook air');
      await homePage.openProduct('MacBook air');
      await expect(productPage.heading('MacBook air')).toBeVisible();
      log(`PASS detalles del producto visibles: ${page.url()}`);
    });

    await test.step('4. Agregar el producto y aceptar la confirmación', async () => {
      log('START agregar producto al carrito');
      const dialog = await productPage.addToCart();
      expect(dialog.message()).toBe('Product added');
      await dialog.accept();
      log('PASS alerta Product added aceptada');
    });

    await test.step('5. Abrir el carrito y validar producto y precio', async () => {
      log('START abrir carrito');
      const cartResponse = await cartPage.open();
      expect(cartResponse.status()).toBe(200);
      await expect(cartPage.heading).toBeVisible();
      const productRow = cartPage.productRow('MacBook air');
      await expect(productRow).toBeVisible({ timeout: 15000 });
      await expect(productRow).toContainText('700');
      log('PASS carrito contiene MacBook air | precio=700');
    });
  } finally {
    const logText = eventLog.length > 0 ? eventLog.join('\n') : 'Sin eventos del navegador.';
    console.log(`\nBrowser event log:\n${logText}`);
    await testInfo.attach('browser-event-log.txt', {
      body: logText,
      contentType: 'text/plain',
    });
  }
});