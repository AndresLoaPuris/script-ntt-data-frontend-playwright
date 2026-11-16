import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { SauceDemoWorld } from '../support/world.ts';

const CATALOG_URL = /\/inventory\.html$/;
const CATALOG_TITLE = 'Products';

Given('el cliente está en la página de inicio de sesión', async function (this: SauceDemoWorld) {
  await this.pages.login.open();
});

When('inicia sesión con sus credenciales', async function (this: SauceDemoWorld) {
  await this.pages.login.loginAs(this.testCase.text('usuario'), this.testCase.text('password'));
});

Then('ve el catálogo de productos', async function (this: SauceDemoWorld) {
  await expect(this.page).toHaveURL(CATALOG_URL);
  await expect(this.pages.header.pageTitle).toHaveText(CATALOG_TITLE);
});

Then('ve el mensaje de error de inicio de sesión', async function (this: SauceDemoWorld) {
  await expect(this.pages.login.errorMessage).toHaveText(this.testCase.text('mensajeEsperado'));
});

Then('permanece en la página de inicio de sesión', async function (this: SauceDemoWorld) {
  await expect(this.pages.login.loginButton).toBeVisible();
});
