import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import type { SauceDemoPages } from '../pages/SauceDemoPages.ts';
import type { TestCase } from '../data/TestCase.ts';
import type { Product } from './product.ts';

export class SauceDemoWorld extends World {
  context!: BrowserContext;
  page!: Page;
  pages!: SauceDemoPages;
  testCase!: TestCase;
  addedProducts: Product[] = [];
}

setWorldConstructor(SauceDemoWorld);
