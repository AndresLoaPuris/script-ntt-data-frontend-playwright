import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { SauceDemoWorld } from '../support/world.ts';

const CENTS_PRECISION = 2;

async function enterShippingDetails(world: SauceDemoWorld): Promise<void> {
  await world.pages.header.openCart();
  await world.pages.cart.checkout();
  await world.pages.checkoutInformation.submit({
    firstName: world.testCase.text('nombre'),
    lastName: world.testCase.text('apellido'),
    postalCode: world.testCase.text('codigoPostal'),
  });
}

When('ingresa sus datos de envío', async function (this: SauceDemoWorld) {
  await enterShippingDetails(this);
});

When('completa la compra con sus datos de envío', async function (this: SauceDemoWorld) {
  await enterShippingDetails(this);
  await this.pages.checkoutOverview.finish();
});

Then('el resumen muestra los productos agregados con sus precios', async function (this: SauceDemoWorld) {
  const summary = await this.pages.checkoutOverview.summary();
  expect(summary.products).toEqual(this.addedProducts);
});

Then('el total es la suma de los precios más el impuesto', async function (this: SauceDemoWorld) {
  const summary = await this.pages.checkoutOverview.summary();
  const pricesSum = this.addedProducts.reduce((sum, product) => sum + product.price, 0);
  expect(summary.itemTotal).toBeCloseTo(pricesSum, CENTS_PRECISION);
  expect(summary.total).toBeCloseTo(summary.itemTotal + summary.tax, CENTS_PRECISION);
});

Then('ve la confirmación del pedido', async function (this: SauceDemoWorld) {
  await expect(this.pages.checkoutComplete.confirmationHeader).toHaveText(this.testCase.text('mensajeEsperado'));
});

Then('ve el mensaje de error en los datos de envío', async function (this: SauceDemoWorld) {
  await expect(this.pages.checkoutInformation.errorMessage).toHaveText(this.testCase.text('mensajeEsperado'));
});

Then('permanece en el formulario de datos de envío', async function (this: SauceDemoWorld) {
  await expect(this.pages.checkoutInformation.continueButton).toBeVisible();
});
