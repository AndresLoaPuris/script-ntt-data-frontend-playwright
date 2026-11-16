import type { Locator, Page } from '@playwright/test';
import { parsePrice, type Product } from '../support/product.ts';

export interface OrderSummary {
  products: Product[];
  itemTotal: number;
  tax: number;
  total: number;
}

export class CheckoutOverviewPage {
  private readonly items: Locator;
  private readonly itemTotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemTotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  async summary(): Promise<OrderSummary> {
    await this.totalLabel.waitFor();
    const products: Product[] = [];
    for (const item of await this.items.all()) {
      products.push({
        name: await item.getByTestId('inventory-item-name').innerText(),
        price: parsePrice(await item.getByTestId('inventory-item-price').innerText()),
      });
    }
    return {
      products,
      itemTotal: parsePrice(await this.itemTotalLabel.innerText()),
      tax: parsePrice(await this.taxLabel.innerText()),
      total: parsePrice(await this.totalLabel.innerText()),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
