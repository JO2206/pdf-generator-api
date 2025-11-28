export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            PDF Generator API
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Convert HTML to PDF using Next.js 16 and Puppeteer
          </p>
        </div>

        {/* API Info Card */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-xl p-8 mb-8 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Quick Start
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-zinc-800 dark:text-zinc-200">
              Endpoint
            </h3>
            <code className="block bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-lg text-sm">
              POST /api/pdf
            </code>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-zinc-800 dark:text-zinc-200">
              Example Request
            </h3>
            <pre className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-lg text-sm overflow-x-auto">
{`{
  "html": "<html><body><h1>Hello World</h1></body></html>",
  "filename": "document.pdf",
  "format": "A4",
  "printBackground": true
}`}
            </pre>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-zinc-800 dark:text-zinc-200">
              cURL Example
            </h3>
            <pre className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-lg text-xs overflow-x-auto">
{`curl -X POST http://localhost:3000/api/pdf \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key" \\
  -d '{"html": "<html><body><h1>Hello</h1></body></html>"}'`}
            </pre>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
              Supported Formats
            </h3>
            <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
              <li>A4, A3, Letter, Legal, Tabloid</li>
              <li>Portrait & Landscape</li>
              <li>Custom margins</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
              Features
            </h3>
            <ul className="text-zinc-600 dark:text-zinc-400 space-y-1">
              <li>Base64 PDF output</li>
              <li>Background graphics support</li>
              <li>Custom metadata</li>
            </ul>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="text-center">
          <a
            href="/api/pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            View Full API Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
