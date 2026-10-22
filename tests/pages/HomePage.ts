import type { Page, Response } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('https://www.demoblaze.com/');
  }

  categoryLink(name: string) {
    return this.page.getByRole('link', { name, exact: true });
  }

  productLink(name: string) {
    return this.page.getByRole('link', { name, exact: true });
  }

  async selectCategory(name: string): Promise<Response> {
    const categoryResponse = this.page.waitForResponse((response) => {
      const request = response.request();
      return response.url().includes('/bycat') && request.method() === 'POST';
    });

    await this.categoryLink(name).click();
    return categoryResponse;
  }

  async openProduct(name: string): Promise<void> {
    await this.productLink(name).click();
  }
}
