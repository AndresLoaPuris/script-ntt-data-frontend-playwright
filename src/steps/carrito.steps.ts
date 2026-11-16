import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { SauceDemoWorld } from '../support/world.ts';

async function expectCartBadgeCount(world: SauceDemoWorld, count: number): Promise<void> {
  const badge = world.pages.header.cartBadge;
  if (count === 0) {
    await expect(badge).toBeHidden();
  } else {
    await expect(badge).toHaveText(String(count));
  }
}

When('agrega los productos al carrito', async function (this: SauceDemoWorld) {
  for (const name of this.testCase.list('productos')) {
    const price = await this.pages.inventory.priceOf(name);
    await this.pages.inventory.addToCart(name);
    this.addedProducts.push({ name, price });
  }
});

When('abre el carrito', async function (this: SauceDemoWorld) {
  await this.pages.header.openCart();
});

When('quita los productos indicados', async function (this: SauceDemoWorld) {
  for (const name of this.testCase.list('productosQuitar')) {
    await this.pages.cart.remove(name);
  }
});

Then('el ícono del carrito muestra la cantidad de productos agregados', async function (this: SauceDemoWorld) {
  await expectCartBadgeCount(this, this.addedProducts.length);
});

Then('cada producto agregado puede quitarse desde la página de productos', async function (this: SauceDemoWorld) {
  for (const { name } of this.addedProducts) {
    await expect(this.pages.inventory.removeButtonOf(name)).toBeVisible();
  }
});

Then('el carrito muestra los productos agregados', async function (this: SauceDemoWorld) {
  await expect(this.pages.cart.productNames).toHaveText(this.addedProducts.map((product) => product.name));
});

Then('el carrito muestra solo los productos restantes', async function (this: SauceDemoWorld) {
  const removed = this.testCase.list('productosQuitar');
  const remaining = this.addedProducts.map((product) => product.name).filter((name) => !removed.includes(name));
  await expect(this.pages.cart.productNames).toHaveText(remaining);
  await expectCartBadgeCount(this, remaining.length);
});
