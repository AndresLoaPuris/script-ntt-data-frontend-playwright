import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async loginAs(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
