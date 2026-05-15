import 'server-only';
import chromium from '@sparticuz/chromium';
import puppeteer, { type Browser } from 'puppeteer-core';
import { existsSync } from 'fs';

const LOCAL_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

async function resolveExecutablePath(): Promise<string> {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  // Production / serverless: use the bundled chromium
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return chromium.executablePath();
  }
  // Local dev: fall back to system Chrome if available
  for (const path of LOCAL_CHROME_PATHS) {
    if (existsSync(path)) return path;
  }
  // Last resort: try chromium pack (may not work on macOS without setup)
  return chromium.executablePath();
}

let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = (async () => {
      const executablePath = await resolveExecutablePath();
      const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
      return puppeteer.launch({
        args: isServerless
          ? chromium.args
          : ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath,
        headless: true,
        defaultViewport: { width: 794, height: 1123 }, // A4 @ 96dpi
      });
    })().catch((err) => {
      browserPromise = null;
      throw err;
    });
  }
  return browserPromise;
}

/**
 * Generate a real, text-selectable PDF (A4) from the given HTML document.
 *
 * The HTML must be a complete document — typically the output of
 * `renderTemplateToHtml`. Fonts are loaded via @import in the HTML; we
 * wait for them to be ready before printing.
 */
export async function generatePdfBuffer(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'load', timeout: 30_000 });
    // Wait for webfonts to be fully loaded so we get real glyphs in the PDF
    await page.evaluate(() => document.fonts.ready);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}
