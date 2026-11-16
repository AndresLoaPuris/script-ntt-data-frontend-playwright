import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly pageTitle: Locator;
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    this.pageTitle = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
