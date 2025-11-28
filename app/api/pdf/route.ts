import { NextRequest, NextResponse } from 'next/server';
import { generatePDF, validateHTMLSize } from '@/lib/pdf/generator';
import { validatePDFRequest, formatErrorResponse } from '@/lib/utils/validation';

// Force dynamic rendering (disable static optimization)
export const dynamic = 'force-dynamic';

// Set function timeout based on Vercel plan
// Hobby: 10s, Pro: up to 300s
export const maxDuration = 10;

/**
 * Validate API key from request headers
 */
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.API_KEY;

  // Allow requests without API_KEY in development for easier testing
  if (!validApiKey && process.env.NODE_ENV === 'development') {
    return true;
  }

  return apiKey === validApiKey;
}

/**
 * POST /api/pdf
 * Generate PDF from HTML content
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request
    const validatedRequest = validatePDFRequest(body);

    // Validate HTML size
    validateHTMLSize(validatedRequest.html);

    // Generate PDF
    const result = await generatePDF(validatedRequest);

    // Return success response
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    const errorResponse = formatErrorResponse(error);

    // Determine status code
    const status = error instanceof Error && error.message.includes('Validation')
      ? 400
      : 500;

    return NextResponse.json(errorResponse, { status });
  }
}

/**
 * GET /api/pdf
 * API documentation and status
 */
export async function GET() {
  return NextResponse.json({
    name: 'PDF Generator API',
    version: '1.0.0',
    status: 'operational',
    endpoint: '/api/pdf',
    methods: ['POST', 'GET'],
    documentation: {
      method: 'POST',
      contentType: 'application/json',
      authentication: {
        header: 'x-api-key',
        description: 'Required in production, optional in development',
      },
      requiredFields: ['html'],
      optionalFields: {
        filename: 'string (default: document.pdf)',
        format: 'A4 | A3 | Letter | Legal | Tabloid (default: A4)',
        margins: {
          top: 'string (default: 10mm)',
          right: 'string (default: 10mm)',
          bottom: 'string (default: 10mm)',
          left: 'string (default: 10mm)',
        },
        landscape: 'boolean (default: false)',
        printBackground: 'boolean (default: true)',
        metadata: 'object (default: {})',
      },
      response: {
        success: 'boolean',
        filename: 'string',
        pdfBase64: 'string (base64 encoded PDF)',
        size: 'number (bytes)',
        metadata: 'object',
        generatedAt: 'string (ISO 8601)',
      },
      limits: {
        maxDuration: `${maxDuration}s`,
        maxMemory: '200MB (estimated HTML size)',
      },
    },
    example: {
      request: {
        html: '<html><body><h1>Hello World</h1></body></html>',
        filename: 'hello.pdf',
        format: 'A4',
        printBackground: true,
      },
      curl: `curl -X POST https://your-domain.vercel.app/api/pdf \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key" \\
  -d '{"html": "<html><body><h1>Hello World</h1></body></html>", "filename": "hello.pdf"}'`,
    },
  }, { status: 200 });
}
