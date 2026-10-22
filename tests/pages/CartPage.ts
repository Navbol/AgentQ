import type { Page, Response } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { name: 'Products', exact: true });
  }

  get total() {
    return this.page.getByRole('heading', { name: '700', exact: true });
  }

  get orderDialog() {
    return this.page.getByRole('dialog');
  }

  async open(): Promise<Response> {
    const cartResponse = this.page.waitForResponse((response) => {
      const request = response.request();
      return response.url().includes('/viewcart') && request.method() === 'POST';
    });
    await this.page.getByRole('link', { name: 'Cart', exact: true }).click();
    return cartResponse;
  }

  async startOrder(): Promise<void> {
    await this.page.getByRole('button', { name: 'Place Order', exact: true }).click();
  }

  async fillOrderForm(details: {
    name: string;
    country: string;
    city: string;
    creditCard: string;
    month: string;
    year: string;
  }): Promise<void> {
    const form = this.orderDialog;
    await form.getByRole('textbox', { name: /Name:/ }).fill(details.name);
    await form.getByRole('textbox', { name: 'Country:' }).fill(details.country);
    await form.getByRole('textbox', { name: 'City:' }).fill(details.city);
    await form.getByRole('textbox', { name: 'Credit card:' }).fill(details.creditCard);
    await form.getByRole('textbox', { name: 'Month:' }).fill(details.month);
    await form.getByRole('textbox', { name: 'Year:' }).fill(details.year);
  }

  productRow(name: string) {
    return this.page.getByRole('row').filter({ hasText: name });
  }
}
