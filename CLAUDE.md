# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router, React 19, TypeScript, and Tailwind CSS 4. The project follows Next.js conventions for file-based routing and component organization.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Tech Stack
- **Framework**: Next.js 16.0.5 with App Router
- **React**: v19.2.0
- **TypeScript**: v5
- **Styling**: Tailwind CSS v4 with PostCSS
- **Linting**: ESLint with Next.js configuration
- **PDF Generation**: Puppeteer Core with @sparticuz/chromium
- **Validation**: Zod for type-safe schema validation

### Project Structure
- `/app` - Next.js App Router directory containing pages and layouts
  - `layout.tsx` - Root layout with Geist fonts (sans and mono)
  - `page.tsx` - API documentation homepage
  - `api/pdf/route.ts` - PDF generation API endpoint
  - `globals.css` - Global styles with Tailwind directives
- `/lib` - Shared libraries and utilities
  - `pdf/` - PDF generation modules
    - `types.ts` - TypeScript types and Zod schemas
    - `puppeteer.ts` - Browser lifecycle management
    - `generator.ts` - Core PDF generation logic
  - `utils/` - Utility functions
    - `validation.ts` - Request validation helpers
- `/public` - Static assets
- TypeScript path alias: `@/*` maps to project root

### Key Configurations
- **TypeScript**: Strict mode enabled, JSX set to `react-jsx`, module resolution using `bundler`
- **ESLint**: Uses Next.js core web vitals and TypeScript presets
- **Fonts**: Geist and Geist Mono loaded via `next/font/google`

## PDF Generator API

### Overview
The app provides a generic PDF generation API that converts HTML to PDF using Puppeteer. Templates are managed externally (e.g., in N8N), not in this codebase.

### API Endpoint
- **URL**: `POST /api/pdf`
- **Authentication**: API key via `x-api-key` header (optional in development)
- **Input**: JSON with `html` (required), plus optional `filename`, `format`, `margins`, `landscape`, `printBackground`, `metadata`
- **Output**: JSON with `pdfBase64` (base64-encoded PDF), `filename`, `size`, `metadata`, `generatedAt`

### Environment Variables
- `API_KEY` - API key for authentication (set in Vercel dashboard for production)
- `IS_LOCAL` - Set to `true` for local development
- `CHROME_EXECUTABLE_PATH` - Optional custom Chrome path for local development

### Testing Locally
```bash
# Start dev server
npm run dev

# Test API (without API key in dev)
curl -X POST http://localhost:3000/api/pdf \
  -H "Content-Type: application/json" \
  -d '{"html": "<html><body><h1>Test</h1></body></html>"}'

# Decode base64 to PDF
curl ... | jq -r '.pdfBase64' | base64 -d > output.pdf
```

### Deployment Notes
- Vercel Hobby plan: 10s timeout limit (configured in vercel.json)
- Memory limit: 250MB (code pre-validates HTML size to stay under 200MB)
- Uses @sparticuz/chromium (actively maintained, replaces deprecated chrome-aws-lambda)
- Environment-aware browser launching (local Chrome vs serverless Chromium)

## Notes
- This project uses Next.js App Router (not Pages Router)
- Pages auto-update during development via Hot Module Replacement
- Images should use the `next/image` component for optimization
- API uses camelCase for JSON responses (TypeScript/JavaScript convention)
