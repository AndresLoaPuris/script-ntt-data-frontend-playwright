import type { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.confirmationHeader = page.getByTestId('complete-header');
  }
}
