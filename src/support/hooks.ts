import { After, AfterAll, Before, BeforeAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, selectors, webkit, type Browser } from '@playwright/test';
import { config } from './config.ts';
import { SauceDemoPages } from '../pages/SauceDemoPages.ts';
import type { SauceDemoWorld } from './world.ts';

const browserTypes = { chromium, firefox, webkit };

let browser: Browser;

setDefaultTimeout(config.stepTimeoutMs);

BeforeAll(async function () {
  selectors.setTestIdAttribute(config.testIdAttribute);
  browser = await browserTypes[config.browser].launch({ headless: config.headless });
});

Before(async function (this: SauceDemoWorld) {
  this.context = await browser.newContext({ baseURL: config.baseUrl });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.actionTimeoutMs);
  this.pages = new SauceDemoPages(this.page);
});

After(async function (this: SauceDemoWorld, { result }) {
  if (result?.status === Status.FAILED) {
    this.attach(await this.page.screenshot({ fullPage: true }), 'image/png');
  }
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
});
