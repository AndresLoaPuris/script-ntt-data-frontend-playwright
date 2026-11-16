import { After, AfterAll, AfterStep, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, selectors, webkit, type Browser } from '@playwright/test';
import { config } from './config.ts';
import { SauceDemoPages } from '../pages/SauceDemoPages.ts';
import type { SauceDemoWorld } from './world.ts';

const browserTypes = { chromium, firefox, webkit };
const BLANK_PAGE = 'about:blank';

let browser: Browser;

setDefaultTimeout(config.stepTimeoutMs);

BeforeAll(async function () {
  selectors.setTestIdAttribute(config.testIdAttribute);
  browser = await browserTypes[config.browser].launch({ headless: config.headless });
});

Before({ name: 'Abrir un contexto de navegador nuevo' }, async function (this: SauceDemoWorld) {
  this.context = await browser.newContext({ baseURL: config.baseUrl });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.actionTimeoutMs);
  this.pages = new SauceDemoPages(this.page);
});

AfterStep(async function (this: SauceDemoWorld, { pickleStep }) {
  if (this.page.url() === BLANK_PAGE) {
    return;
  }
  const screenshot = await this.page.screenshot({ fullPage: true });
  this.attach(screenshot, { mediaType: 'image/png', fileName: pickleStep.text });
});

After({ name: 'Cerrar el contexto del navegador' }, async function (this: SauceDemoWorld) {
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
});
