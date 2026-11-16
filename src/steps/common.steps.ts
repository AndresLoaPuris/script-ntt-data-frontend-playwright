import { Given } from '@cucumber/cucumber';
import { testData } from '../data/TestDataRepository.ts';
import type { SauceDemoWorld } from '../support/world.ts';

Given('el caso de prueba {string}', async function (this: SauceDemoWorld, id: string) {
  this.testCase = await testData.findTestCase(id);
});

Given('el cliente inició sesión', async function (this: SauceDemoWorld) {
  const username = this.testCase.text('usuario');
  await this.pages.login.open();
  await this.pages.login.loginAs(username, await testData.passwordOf(username));
});
