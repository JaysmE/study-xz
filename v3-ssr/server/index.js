// vue3 ssr
const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaMount = require('koa-mount')
const KoaStatic = require('koa-static')
const path = require('path')
const { renderToString } = require('@vue/server-renderer')
const fs = require('fs')
const manifest = require('../dist/server/ssr-manifest.json')
const appPath = path.join(__dirname, '../dist/server', manifest['app.js'])
const createApp = require(appPath).default

const resolve = (...args) => {
  return path.resolve(__dirname, ...args)
}

const serve = new Koa()
const router = new KoaRouter()
router.get('/', async (ctx) => {
  let html = ''
  const data = await fs.readFileSync(resolve('../dist/client/index.html'))
  html = data.toString()

  const { app } = createApp()
  const htmlContent = await renderToString(app)
  html = html.replace(`<div id="app">`, `<div id="app">${ htmlContent }`)
  console.log(html)
  ctx.body = html

})

serve.use(router.routes()).use(router.allowedMethods())
// 开放目录
serve.use(KoaMount('/dist', KoaStatic(resolve('../dist'))))
serve.use(KoaMount('/public', KoaStatic(resolve('../public'))))
serve.use(KoaMount('/img', KoaStatic(resolve('../dist/client/img'))))
serve.use(KoaMount('/js', KoaStatic(resolve('../dist/client/js'))))
serve.use(KoaMount('/css', KoaStatic(resolve('../dist/client/css'))))

const port = process.env.PORT || 3000
serve.listen(port, () => {
  console.log('app listen on 3000')
})
