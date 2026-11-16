const SUPPORTED_BROWSERS = ['chromium', 'firefox', 'webkit'] as const;

export type BrowserName = (typeof SUPPORTED_BROWSERS)[number];

function browserFromEnvironment(): BrowserName {
  const browser = process.env.BROWSER ?? 'chromium';
  if (!SUPPORTED_BROWSERS.includes(browser as BrowserName)) {
    throw new Error(`Navegador no soportado: ${browser}. Usa: ${SUPPORTED_BROWSERS.join(', ')}`);
  }
  return browser as BrowserName;
}

export const config = {
  baseUrl: 'https://www.saucedemo.com',
  browser: browserFromEnvironment(),
  headless: process.env.HEADLESS !== 'false',
  testIdAttribute: 'data-test',
  actionTimeoutMs: 10_000,
  stepTimeoutMs: 60_000,
};
