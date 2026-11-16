import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../support/product.ts';

export class InventoryPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async priceOf(productName: string): Promise<number> {
    const price = await this.item(productName).getByTestId('inventory-item-price').textContent();
    return parsePrice(price ?? '');
  }

  async addToCart(productName: string): Promise<void> {
    await this.item(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  removeButtonOf(productName: string): Locator {
    return this.item(productName).getByRole('button', { name: 'Remove' });
  }

  private item(productName: string): Locator {
    return this.page
      .getByTestId('inventory-item')
      .filter({ has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }) });
  }
}
