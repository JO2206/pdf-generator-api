import { Browser, PDFOptions } from 'puppeteer-core';
import { launchBrowser, createPage, closeBrowser } from './puppeteer';
import { GeneratePDFRequest, GeneratePDFResponse } from './types';

/**
 * Build Puppeteer PDF options from request parameters
 */
function buildPDFOptions(request: GeneratePDFRequest): PDFOptions {
  const { format, margins, landscape, printBackground } = request;

  return {
    format: format || 'A4',
    margin: margins || {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm',
    },
    landscape: landscape || false,
    printBackground: printBackground !== false,
    preferCSSPageSize: false, // Use format parameter instead
  };
}

/**
 * Calculate estimated memory usage for HTML content
 * Helps prevent Vercel memory limit issues
 */
export function estimateMemoryUsage(html: string): number {
  // Rough estimate: HTML size * 10 (includes rendering overhead)
  const htmlSize = Buffer.byteLength(html, 'utf8');
  return htmlSize * 10;
}

/**
 * Validate HTML size is within acceptable limits
 */
export function validateHTMLSize(html: string): void {
  const estimatedMemory = estimateMemoryUsage(html);
  const MAX_MEMORY = 200 * 1024 * 1024; // 200MB (safe margin under 250MB limit)

  if (estimatedMemory > MAX_MEMORY) {
    throw new Error(
      `HTML content too large. Estimated memory: ${(estimatedMemory / 1024 / 1024).toFixed(2)}MB, Max: ${MAX_MEMORY / 1024 / 1024}MB`
    );
  }
}

/**
 * Generate PDF from HTML content
 * Main entry point for PDF generation
 */
export async function generatePDF(
  request: GeneratePDFRequest
): Promise<GeneratePDFResponse> {
  let browser: Browser | null = null;

  try {
    // Launch browser
    browser = await launchBrowser();

    // Create new page
    const page = await createPage(browser);

    // Set HTML content
    await page.setContent(request.html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000,
    });

    // Generate PDF
    const pdfOptions = buildPDFOptions(request);
    const pdfBuffer = await page.pdf(pdfOptions);

    // Convert to base64 - ensure it's a string, not a Buffer
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    // Build response
    const response: GeneratePDFResponse = {
      success: true,
      filename: request.filename || 'document.pdf',
      pdfBase64,
      size: pdfBuffer.length,
      metadata: {
        ...request.metadata,
        format: request.format || 'A4',
        landscape: request.landscape || false,
        printBackground: request.printBackground !== false,
      },
      generatedAt: new Date().toISOString(),
    };

    return response;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(
      `PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    // Always close browser to prevent memory leaks
    if (browser) {
      await closeBrowser(browser);
    }
  }
}
