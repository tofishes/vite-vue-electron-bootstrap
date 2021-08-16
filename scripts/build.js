const { createServer, build: viteBuild } = require('vite')
const vue = require('@vitejs/plugin-vue')
const argv = require('optimist').argv

const root = process.cwd()
const isPackaged = argv.package // 是否是打包程序
// 变量注入 主进程和渲染进程代码
const define = {
  'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
  'process.env.PACKAGED': isPackaged
}
const viteCogfig = {
  plugins: [vue()],
  root: `${root}/src/renderer`,
  base: './',
  publicDir: false,
  build: {
    outDir: `${root}/dist/renderer`,
    emptyOutDir: true
  },
  esbuild: {
    define
  }
}

async function vite() {
  if (isPackaged) {
    return await viteBuild(viteCogfig)
  }

  const server = await createServer(viteCogfig)

  // vite config对象
  return await server.listen()
}

async function run() {
  const { config } = await vite()
}

run().catch(e => {
  console.error(e)

  process.exit(1)
})