import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { PuppeteerOptions } from './types';

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocal = process.env.IS_LOCAL === 'true';

/**
 * Get Chromium executable path based on environment
 * - Local development: Uses puppeteer's bundled Chromium
 * - Vercel production: Uses @sparticuz/chromium
 */
async function getExecutablePath(): Promise<string> {
  if (isDevelopment || isLocal) {
    // For local development, use custom path if set, otherwise use common Chrome locations
    if (process.env.CHROME_EXECUTABLE_PATH) {
      return process.env.CHROME_EXECUTABLE_PATH;
    }

    // Return macOS default (will work on macOS, users on other platforms should set CHROME_EXECUTABLE_PATH)
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }

  // For Vercel/serverless, use @sparticuz/chromium
  return await chromium.executablePath();
}

/**
 * Get Puppeteer launch options optimized for environment
 */
async function getLaunchOptions(): Promise<PuppeteerOptions> {
  const executablePath = await getExecutablePath();

  if (isDevelopment || isLocal) {
    return {
      headless: true,
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      defaultViewport: {
        width: 1280,
        height: 720,
      },
    };
  }

  // Vercel/serverless optimized settings
  return {
    headless: true,
    executablePath,
    args: [
      ...chromium.args,
      '--hide-scrollbars',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
    defaultViewport: chromium.defaultViewport,
  };
}

/**
 * Launch a Puppeteer browser instance
 * Handles environment-specific configuration
 */
export async function launchBrowser(): Promise<Browser> {
  const options = await getLaunchOptions();

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
