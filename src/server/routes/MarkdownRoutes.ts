import express, { Application, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Enable syntax highlighting for fenced code blocks in Markdown.
marked.use(
    markedHighlight({
        langPrefix: 'hljs language-', // adds "hljs" + "language-<lang>" classes
        highlight(code: string, lang: string) {
            try {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                // Fallback: auto-detect language
                return hljs.highlightAuto(code).value;
            } catch {
                return code; // No highlight on error
            }
        },
    })
);

/** Register Markdown-powered routes on the given Express app. */
export function registerMarkdownRoutes(app: Application, markdownDir?: string) {
    const rootDir = markdownDir ?? path.resolve(process.cwd(), 'markdown');

    // Serve static assets (images, files referenced from markdown) under /md-assets/*
    app.use('/md-assets', express.static(rootDir));

    // Serve a highlight.js CSS theme (GitHub) under /md-assets/hljs.css
    // NOTE: require.resolve works in CommonJS. If you switch to ESM-only, use createRequire().
    // This avoids using a CDN and keeps the app self-contained.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hljsCssPath: string = require.resolve('highlight.js/styles/github.min.css');
    app.get('/md-assets/hljs.css', (_req: Request, res: Response) => {
        res.sendFile(hljsCssPath);
    });

    /** Build a minimal HTML page with styles + highlight.css link. */
    const renderHtmlPage = (title: string, contentHtml: string): string => {
        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title}</title>
  <base href="/md-assets/">
  <link rel="stylesheet" href="/md-assets/hljs.css">
  <style>
    :root { color-scheme: light dark; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem auto; max-width: 820px; padding: 0 1rem; line-height: 1.6; }
    article :is(h1,h2,h3) { margin-top: 2rem; }
    pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    pre { overflow: auto; padding: 1rem; border-radius: 0.5rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid currentColor; padding: 0.5rem; }
    a { text-decoration: underline; }
    .list { margin: 1rem 0 2rem; }
    .muted { opacity: .8; font-size: .95rem; }
  </style>
</head>
<body>
  <article class="markdown-body">${contentHtml}</article>
</body>
</html>`;
    };

    // --- Routes ---

    /** GET / -> render markdown/index.md if it exists, else redirect to /docs */
    app.get('/', async (_req: Request, res: Response) => {
        try {
            const indexPath = path.join(rootDir, 'index.md');
            const md = await fs.readFile(indexPath, 'utf8').catch(() => null);
            if (!md) return res.redirect('/docs');
            const html = marked.parse(md) as string;
            res.type('html').send(renderHtmlPage('Documentation', html));
        } catch {
            res.status(500).json({ error: 'Failed to render index.md' });
        }
    });

    /** GET /docs -> list all .md files in /markdown with links */
    app.get('/docs', async (_req: Request, res: Response) => {
        try {
            const items = await fs.readdir(rootDir, { withFileTypes: true }).catch(() => []);
            const files = items
                .filter((it) => it.isFile() && it.name.toLowerCase().endsWith('.md'))
                .map((it) => it.name.replace(/\.md$/i, ''))
                .sort();

            const listHtml = files.length
                ? `<div class="list"><ul>${files.map(f => `<li><a href="/docs/${encodeURIComponent(f)}">${f}</a></li>`).join('')}</ul></div>`
                : `<p>No markdown files found in <code>/markdown</code>.</p>`;

            res.type('html').send(renderHtmlPage('Docs', listHtml));
        } catch {
            res.status(500).json({ error: 'Failed to list docs' });
        }
    });

    /** GET /docs/:name -> render markdown/<name>.md (sanitized filename) */
    app.get('/docs/:name', async (req: Request, res: Response) => {
        try {
            // Sanitize filename to prevent path traversal
            const safe = String(req.params.name).replace(/[^a-zA-Z0-9-_]/g, '');
            const filePath = path.join(rootDir, `${safe}.md`);

            const md = await fs.readFile(filePath, 'utf8').catch(() => null);
            if (!md) return res.status(404).type('text').send('Markdown file not found');

            const html = marked.parse(md) as string;
            res.type('html').send(renderHtmlPage(safe, html));
        } catch {
            res.status(500).json({ error: 'Failed to render markdown file' });
        }
    });
}
