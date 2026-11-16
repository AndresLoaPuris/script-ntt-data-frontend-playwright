import type { Page } from '@playwright/test';
import { HeaderComponent } from './components/HeaderComponent.ts';
import { LoginPage } from './LoginPage.ts';
import { InventoryPage } from './InventoryPage.ts';
import { CartPage } from './CartPage.ts';
import { CheckoutInformationPage } from './CheckoutInformationPage.ts';
import { CheckoutOverviewPage } from './CheckoutOverviewPage.ts';
import { CheckoutCompletePage } from './CheckoutCompletePage.ts';

export class SauceDemoPages {
  readonly header: HeaderComponent;
  readonly login: LoginPage;
  readonly inventory: InventoryPage;
  readonly cart: CartPage;
  readonly checkoutInformation: CheckoutInformationPage;
  readonly checkoutOverview: CheckoutOverviewPage;
  readonly checkoutComplete: CheckoutCompletePage;

  constructor(page: Page) {
    this.header = new HeaderComponent(page);
    this.login = new LoginPage(page);
    this.inventory = new InventoryPage(page);
    this.cart = new CartPage(page);
    this.checkoutInformation = new CheckoutInformationPage(page);
    this.checkoutOverview = new CheckoutOverviewPage(page);
    this.checkoutComplete = new CheckoutCompletePage(page);
  }
}
