import type { Dialog, Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  heading(name: string) {
    return this.page.getByRole('heading', { name, exact: true });
  }

  async addToCart(): Promise<Dialog> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.page.getByRole('link', { name: 'Add to cart', exact: true }).click();
    return dialogPromise;
  }
}
