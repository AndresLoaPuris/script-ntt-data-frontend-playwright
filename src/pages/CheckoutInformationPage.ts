import type { Locator, Page } from '@playwright/test';

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutInformationPage {
  readonly errorMessage: Locator;
  readonly continueButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
  }

  async submit(details: ShippingDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.postalCodeInput.fill(details.postalCode);
    await this.continueButton.click();
  }
}
