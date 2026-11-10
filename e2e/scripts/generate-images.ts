// Generates the images of the site with the browser of Playwright (npm run images in e2e/):
//   - site/public/images/screenshot.webp: the screenshot of c0de, scaled to 1280 pixels,
//   - site/public/og-image.png: the preview image for links to the site (1200 x 630).
// The screenshot comes from the imported c0de repository, so run the import first.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const site = fileURLToPath(new URL('../../site/', import.meta.url))
const cache = join(site, '.cache', 'sources')
const c0de = readdirSync(cache).find((f) => f.startsWith('joernott_minecraft-c0de@'))
if (!c0de)
  throw new Error('the c0de repository is not in site/.cache/sources: run the import first')

const dataUrl = (file: string, type: string) =>
  `data:${type};base64,${readFileSync(file).toString('base64')}`

const browser = await chromium.launch()
const page = await browser.newPage()

// The screenshot, scaled and encoded in the browser.
const webp = await page.evaluate(
  async (src) => {
    const image = new Image()
    image.src = src
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = 1280
    canvas.height = Math.round((image.height * 1280) / image.width)
    canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/webp', 0.82)
  },
  dataUrl(join(cache, c0de, 'docs', 'images', 'screenshot.png'), 'image/png'),
)
writeFileSync(
  join(site, 'public', 'images', 'screenshot.webp'),
  Buffer.from(webp.split(',')[1]!, 'base64'),
)

// The preview image: the logo on the paper of the binder, with the green cover on the left.
await page.setViewportSize({ width: 1200, height: 630 })
await page.setContent(`
  <body style="margin:0;width:1200px;height:630px;display:flex;font-family:sans-serif;background:#d6cfbf">
    <div style="width:90px;background:linear-gradient(to right,#1f4a32,#2a5a3f)"></div>
    <div style="flex:1;margin:40px 60px 40px 0;background:#fffef8;display:flex;align-items:center;gap:60px;padding:0 70px;box-shadow:0 4px 18px rgb(0 0 0/.25);border-left:2px solid rgb(214 92 92/.35)">
      <img src="${dataUrl(join(site, 'public', 'logo.svg'), 'image/svg+xml')}" style="width:260px;height:260px;border-radius:12px">
      <div style="color:#1d232a">
        <div style="font-size:120px;font-weight:700;line-height:1">c0de</div>
        <div style="font-size:38px;margin-top:24px;line-height:1.3">The programming language<br>made of blocks in Minecraft</div>
        <div style="font-size:28px;margin-top:28px;color:#59626d">c0de.at</div>
      </div>
    </div>
  </body>`)
await page.screenshot({ path: join(site, 'public', 'og-image.png') })
await browser.close()
console.log('images: site/public/images/screenshot.webp, site/public/og-image.png')
