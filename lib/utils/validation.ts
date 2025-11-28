import { ZodError } from 'zod';
import { GeneratePDFRequestSchema } from '@/lib/pdf/types';
import { ErrorResponse } from '@/lib/pdf/types';

/**
 * Validate and parse request body
 * Returns validated data or throws formatted error
 */
export function validatePDFRequest(body: unknown) {
  try {
    return GeneratePDFRequestSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${details}`);
    }
    throw error;
  }
}

/**
 * Format error response
 */
export function formatErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }

  return {
    success: false,
    error: 'An unexpected error occurred',
  };
}
