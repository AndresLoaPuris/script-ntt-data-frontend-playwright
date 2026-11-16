import os from 'node:os';
import { chromium, firefox, webkit } from '@playwright/test';
import { generate } from 'multiple-cucumber-html-reporter';
import { config, type BrowserName } from '../src/support/config.ts';

const REPORT_TITLE = 'Sauce Demo · Pruebas E2E';
const REPORT_SUBTITLE = 'Playwright + Cucumber';

const browserTypes = { chromium, firefox, webkit };

const reporterBrowserNames: Record<BrowserName, string> = {
  chromium: 'chrome',
  firefox: 'firefox',
  webkit: 'safari',
};

async function browserVersion(): Promise<string> {
  const browser = await browserTypes[config.browser].launch();
  const version = browser.version();
  await browser.close();
  return version;
}

await generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  reportName: REPORT_TITLE,
  pageTitle: REPORT_SUBTITLE,
  language: 'es',
  displayDuration: true,
  displayReportTime: true,
  humanReadableDuration: true,
  externalizeMedia: true,
  metadata: {
    browser: { name: reporterBrowserNames[config.browser], version: await browserVersion() },
    device: config.headless ? 'Headless' : 'Con interfaz',
    platform: { name: os.platform(), version: os.release() },
  },
  customData: {
    projectName: 'Sauce Demo',
    environment: config.baseUrl,
    nodeVersion: process.version,
    ciPipeline: process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local',
    buildNumber: process.env.GITHUB_RUN_NUMBER,
  },
});

console.log('Reporte generado en reports/html/index.html');
