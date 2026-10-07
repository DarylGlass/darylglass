/**
 * Writes the rendered page back to dist/index.html so production
 * serves real HTML (headings, copy, and schema) without waiting for JS.
 *
 * Skip with SKIP_PRERENDER=1.
 */
import { createServer } from 'node:http'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium as playwrightChromium } from 'playwright-core'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distIndex = path.join(rootDir, 'dist', 'index.html')
const skip = process.env.SKIP_PRERENDER === '1' || process.env.SKIP_PRERENDER === 'true'
const required = [
  'Daryl Glass',
  'Freelance Web Engineer',
  'Front-End Development',
  'Get in Touch',
  'application/ld+json',
]

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close((error) => (error ? reject(error) : resolve(port)))
    })
    server.on('error', reject)
  })
}

async function launchBrowser() {
  const attempts = []
  const macChrome =
    process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : null

  if (macChrome) {
    attempts.push(() =>
      playwrightChromium.launch({ executablePath: macChrome, headless: true }),
    )
  }

  for (const executablePath of [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]) {
    attempts.push(() =>
      playwrightChromium.launch({ executablePath, headless: true }),
    )
  }

  for (const channel of ['chrome', 'chromium', 'msedge']) {
    attempts.push(() => playwrightChromium.launch({ channel, headless: true }))
  }

  if (process.platform === 'linux') {
    attempts.push(async () => {
      process.env.AWS_LAMBDA_JS_RUNTIME ||= 'nodejs22.x'
      const chromium = (await import('@sparticuz/chromium')).default
      return playwrightChromium.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    })
  }

  attempts.push(() => playwrightChromium.launch({ headless: true }))

  let lastError
  for (const attempt of attempts) {
    try {
      return await attempt()
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to launch a browser for prerender.')
}

async function closePreviewServer(previewServer) {
  if (!previewServer) return
  try {
    if (typeof previewServer.close === 'function') {
      await previewServer.close()
      return
    }
  } catch {
    /* ignore */
  }
  const httpServer = previewServer.httpServer
  if (httpServer && typeof httpServer.close === 'function') {
    await new Promise((resolve) => httpServer.close(() => resolve()))
  }
}

async function prerender() {
  if (skip) {
    console.log('[prerender] Skipped (SKIP_PRERENDER is set).')
    return
  }

  let previewServer
  let browser

  try {
    const port = await getFreePort()
    previewServer = await preview({
      root: rootDir,
      preview: { host: '127.0.0.1', port, strictPort: true },
    })

    browser = await launchBrowser()
    const page = await browser.newPage()
    await page.goto(`http://127.0.0.1:${port}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    })
    await page.waitForSelector('#experience h2', { timeout: 30_000 })

    const html = await page.content()
    const missing = required.filter((snippet) => !html.includes(snippet))
    if (missing.length) {
      throw new Error(`Prerendered HTML is missing: ${missing.join(', ')}`)
    }

    await writeFile(distIndex, `${html}\n`, 'utf8')
    console.log(`[prerender] Wrote ${distIndex} (${Buffer.byteLength(html)} bytes)`)
  } finally {
    try {
      await browser?.close()
    } catch {
      /* ignore */
    }
    await closePreviewServer(previewServer)
  }
}

prerender().catch((error) => {
  console.error('[prerender] Failed:', error?.message || error)
  process.exitCode = 1
})
