import { z } from 'zod';

// PDF Format options
export type PDFFormat = 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid';

// Request validation schema
export const GeneratePDFRequestSchema = z.object({
  html: z.string().min(1, 'HTML content is required'),
  filename: z.string().optional().default('document.pdf'),
  format: z.enum(['A4', 'A3', 'Letter', 'Legal', 'Tabloid']).optional().default('A4'),
  margins: z.object({
    top: z.string().optional().default('20mm'),
    right: z.string().optional().default('20mm'),
    bottom: z.string().optional().default('20mm'),
    left: z.string().optional().default('20mm'),
  }).optional().default({
    top: '20mm',
    right: '20mm',
    bottom: '20mm',
    left: '20mm',
  }),
  landscape: z.boolean().optional().default(false),
  printBackground: z.boolean().optional().default(true),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

export type GeneratePDFRequest = z.infer<typeof GeneratePDFRequestSchema>;

// Response types
export interface GeneratePDFResponse {
  success: boolean;
  filename: string;
  pdfBase64: string;
  size: number;
  metadata: {
    format: PDFFormat;
    landscape: boolean;
    printBackground: boolean;
    [key: string]: any;
  };
  generatedAt: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

// Puppeteer options
export interface PuppeteerOptions {
  headless: boolean;
  args: string[];
  executablePath: string;
  defaultViewport: {
    width: number;
    height: number;
  };
}
