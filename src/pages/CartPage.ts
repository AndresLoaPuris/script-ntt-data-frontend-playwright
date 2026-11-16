import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly productNames: Locator;
  private readonly checkoutButton: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.productNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async remove(productName: string): Promise<void> {
    await this.page
      .getByTestId('inventory-item')
      .filter({ has: this.page.getByText(productName, { exact: true }) })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
