import type { Page } from '@playwright/test';

export class ContactPage {
  private readonly dialog;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog');
  }

  async open(): Promise<void> {
    await this.page.getByRole('link', { name: 'Contact', exact: true }).click();
  }

  get heading() {
    return this.dialog.getByRole('heading', { name: 'New message' });
  }

  async sendMessage(email: string, name: string, message: string): Promise<string> {
    const textboxes = this.dialog.getByRole('textbox');
    await textboxes.nth(0).fill(email);
    await textboxes.nth(1).fill(name);
    await this.dialog.getByRole('textbox', { name: 'Message:' }).fill(message);

    const confirmation = new Promise<string>((resolve, reject) => {
      this.page.once('dialog', async (dialog) => {
        try {
          const message = dialog.message();
          await dialog.accept();
          resolve(message);
        } catch (error) {
          reject(error);
        }
      });
    });
    await this.dialog.getByRole('button', { name: 'Send message' }).click();
    return confirmation;
  }
}
