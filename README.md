# PDF Generator API

A generic PDF generation API built with Next.js 16, TypeScript, and Puppeteer. Converts HTML to PDF via serverless functions, designed for integration with workflow tools like N8N.

## Features

- **Generic HTML to PDF conversion** - No templates stored in the app
- **Base64 output** - Easy integration with APIs
- **Customizable options** - Format, margins, landscape, backgrounds
- **API key authentication** - Secure your endpoint
- **TypeScript** - Full type safety
- **Serverless ready** - Optimized for Vercel deployment

## Tech Stack

- **Next.js 16** with App Router
- **Puppeteer Core** + **@sparticuz/chromium** (2025 best practice)
- **Zod** for schema validation
- **TypeScript 5** with strict mode

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local if needed
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/api/pdf \
     -H "Content-Type: application/json" \
     -d '{"html": "<html><body><h1>Hello PDF!</h1></body></html>"}'
   ```

### API Documentation

Visit `http://localhost:3000` for interactive API documentation.

Or call `GET /api/pdf` for JSON schema.

## API Reference

### Endpoint

```
POST /api/pdf
```

### Authentication

Include API key in header (optional in development):
```
x-api-key: your-api-key
```

### Request Body

```typescript
{
  html: string;              // Required - HTML content to convert
  filename?: string;         // Optional - Default: "document.pdf"
  format?: string;           // Optional - A4, A3, Letter, Legal, Tabloid
  margins?: {                // Optional - Default: 20mm all sides
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  landscape?: boolean;       // Optional - Default: false
  printBackground?: boolean; // Optional - Default: true
  metadata?: object;         // Optional - Custom metadata
}
```

### Response

```typescript
{
  success: boolean;
  filename: string;
  pdfBase64: string;     // Base64-encoded PDF
  size: number;          // PDF size in bytes
  metadata: object;
  generatedAt: string;   // ISO 8601 timestamp
}
```

### Example

```bash
curl -X POST http://localhost:3000/api/pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "html": "<html><body><h1>Invoice #123</h1></body></html>",
    "filename": "invoice-123.pdf",
    "format": "A4"
  }' > response.json

# Decode base64 to PDF
cat response.json | jq -r '.pdfBase64' | base64 -d > output.pdf
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial PDF generator API"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **Add environment variable:** `API_KEY` (set a secure key)
4. Deploy

### 3. Configure for Production

The `vercel.json` file is already configured with:
- 10s timeout (Hobby plan)
- 1024MB memory
- Optimized for @sparticuz/chromium

**To increase timeout** (requires Pro plan):
Edit `vercel.json` and change `maxDuration` to desired value (up to 300s).

### 4. Test Production

```bash
curl -X POST https://your-app.vercel.app/api/pdf \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"html": "<html><body><h1>Test</h1></body></html>"}'
```

## N8N Integration

### Workflow Setup

1. **Webhook Node** (trigger)
2. **Code Node** (build HTML template)
3. **HTTP Request Node** (call PDF API)
4. **Respond to Webhook** (return PDF)

### Example Code Node

```javascript
// Build your HTML template
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; padding: 40px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>${$input.item.json.title}</h1>
  <p>${$input.item.json.content}</p>
</body>
</html>
`;

return {
  json: {
    html: html,
    filename: `document-${Date.now()}.pdf`,
    format: "A4",
    printBackground: true
  }
};
```

### Example HTTP Request Node

- **Method:** POST
- **URL:** `https://your-app.vercel.app/api/pdf`
- **Authentication:** Add header `x-api-key: YOUR_API_KEY`
- **Body Type:** JSON
- **Body:** `{{ $json }}`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | API authentication key | Production only |
| `IS_LOCAL` | Set to `true` for local development | Local only |
| `CHROME_EXECUTABLE_PATH` | Custom Chrome path | Optional |

## Troubleshooting

### Chrome not found (local development)

**Solution:** Install Google Chrome or set `CHROME_EXECUTABLE_PATH` in `.env.local`

```bash
# macOS
CHROME_EXECUTABLE_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome

# Linux
CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome

# Windows
CHROME_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

### Timeout on Vercel (Hobby plan)

**Solution:** Optimize HTML or upgrade to Pro plan for longer timeout

- Remove large inline images
- Minimize CSS/JavaScript
- Use external resources instead of inlining

### Memory errors

**Solution:** The API pre-validates HTML size (200MB limit)

If you hit this limit:
- Reduce HTML size
- Remove unnecessary content
- Split into multiple PDFs

### Fonts not rendering

**Solution:** Embed fonts as base64 or use web fonts

```html
<style>
  @font-face {
    font-family: 'CustomFont';
    src: url(data:font/woff2;base64,BASE64_HERE);
  }
</style>
```

## Project Structure

```
pdf-app/
├── app/
│   ├── api/pdf/route.ts       # API endpoint
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Documentation homepage
├── lib/
│   ├── pdf/
│   │   ├── types.ts           # TypeScript types & Zod schemas
│   │   ├── puppeteer.ts       # Browser management
│   │   └── generator.ts       # PDF generation logic
│   └── utils/
│       └── validation.ts      # Request validation
├── .env.local                 # Local environment variables
├── .env.example               # Environment template
├── vercel.json                # Vercel configuration
└── CLAUDE.md                  # Developer documentation
```

## Development Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## License

MIT

## Support

For issues or questions, visit the [GitHub repository](https://github.com/your-username/pdf-app).
