import puppeteer, { Browser, Page } from 'puppeteer-core';
import { PuppeteerOptions } from './types';

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocal = process.env.IS_LOCAL === 'true';

/**
 * Get Chromium executable path based on environment
 * - Local development: Uses system Chrome
 * - Railway/Docker production: Uses system Chromium from Dockerfile
 */
function getExecutablePath(): string {
  // Check if PUPPETEER_EXECUTABLE_PATH is set (from Dockerfile)
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // Local development paths
  if (isDevelopment || isLocal) {
    if (process.env.CHROME_EXECUTABLE_PATH) {
      return process.env.CHROME_EXECUTABLE_PATH;
    }
    // Return macOS default
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }

  // Fallback to common Chromium locations in Docker
  return '/usr/bin/chromium';
}

/**
 * Get Puppeteer launch options optimized for environment
 */
function getLaunchOptions(): PuppeteerOptions {
  const executablePath = getExecutablePath();

  // Common args for all environments
  const commonArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--hide-scrollbars',
  ];

  // Production-specific args (Docker/Railway)
  const productionArgs = [
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-features=IsolateOrigins,site-per-process',
  ];

  const args = isDevelopment || isLocal ? commonArgs : [...commonArgs, ...productionArgs];

  return {
    headless: true,
    executablePath,
    args,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
  };
}

/**
 * Launch a Puppeteer browser instance
 * Handles environment-specific configuration
 */
export async function launchBrowser(): Promise<Browser> {
  const options = getLaunchOptions();

  try {
    const browser = await puppeteer.launch(options);
    return browser;
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw new Error(`Browser launch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a new page with optimal settings for PDF generation
 */
export async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  // Set longer timeout for complex HTML rendering
  page.setDefaultTimeout(30000);

  // Emulate screen media type (not print) for better CSS support
  await page.emulateMediaType('screen');

  return page;
}

/**
 * Safely close browser instance
 */
export async function closeBrowser(browser: Browser): Promise<void> {
  try {
    await browser.close();
  } catch (error) {
    console.error('Error closing browser:', error);
  }
}
