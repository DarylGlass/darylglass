import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { processContact } from './server/contact.js'
import { llmsTxt, robotsTxt, seoTags, sitemapXml } from './src/seo/meta.js'

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function contactDevApi(env) {
  return {
    name: 'contact-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, message: 'Method not allowed' }))
          return
        }

        try {
          const raw = await readRequestBody(req)
          const input = raw ? JSON.parse(raw) : {}
          const result = await processContact(input, env)
          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.body))
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, message: 'Could not read that message.' }))
        }
      })
    },
  }
}

function seoPlugin(env) {
  const files = {
    '/robots.txt': { type: 'text/plain; charset=utf-8', body: robotsTxt(env) },
    '/sitemap.xml': { type: 'application/xml; charset=utf-8', body: sitemapXml(env) },
    '/llms.txt': { type: 'text/plain; charset=utf-8', body: llmsTxt(env) },
  }

  return {
    name: 'site-seo',
    transformIndexHtml(html) {
      return html.replace('<!--seo-->', seoTags(env))
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0]
        const file = files[pathname]
        if (!file) {
          next()
          return
        }
        res.setHeader('Content-Type', file.type)
        res.end(file.body)
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: files['/robots.txt'].body })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: files['/sitemap.xml'].body })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: files['/llms.txt'].body })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }

  return {
    plugins: [contactDevApi(env), seoPlugin(env), react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
    },
  }
})
