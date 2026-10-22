import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.page.getByLabel('Usuario').fill(username);
    await this.page.getByLabel('Contraseña').fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Iniciar sesión' }).click();
  }
}
