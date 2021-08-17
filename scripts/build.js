const fs = require('fs')
const esbuild = require('esbuild')
const electron = require('electron-connect').server.create({ stopOnClose: true })

const { createServer, build: viteBuild } = require('vite')
const vue = require('@vitejs/plugin-vue')
const argv = require('optimist').argv

const debounce = require('./debounce')

const root = process.cwd()
const isPackaged = argv.package // 是否是打包程序
// 变量注入 主进程和渲染进程代码
const define = {
  'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
  'process.env.PACKAGED': isPackaged,
}
const viteCogfig = {
  plugins: [vue()],
  root: `${root}/src/renderer`,
  base: './',
  publicDir: false,
  build: {
    outDir: `${root}/dist/renderer`,
    emptyOutDir: true,
  },
  esbuild: {
    define,
  },
}

async function vite() {
  if (isPackaged) {
    return await viteBuild(viteCogfig)
  }

  const server = await createServer(viteCogfig)

  // vite config对象
  return await server.listen()
}

async function mainBuild(electronArgs) {
  await esbuild.build({
    entryPoints: [`${root}/src/main/index.ts`, `${root}/src/preload/index.ts`],
    outdir: `${root}/dist/`,
    bundle: true,
    minify: isPackaged,
    platform: 'node',
    external: ['electron'],
    define,
  })

  if (!isPackaged) {
    // fix for electron-updater get current version from package.json
    try {
      fs.linkSync(`${root}/package.json`, `${root}/dist/main/package.json`)
    } catch (e) {}

    electron.electronState === 'init'
      ? electron.start(electronArgs)
      : electron.restart(electronArgs)
  }
}

async function run() {
  const electronArgs = [`${root}/dist/main`]

  const { config } = await vite()

  if (!isPackaged) {
    const port = config.server.port

    electronArgs.push(`--port=${port}`)
  }

  const build = debounce(() => mainBuild(electronArgs))

  await build()

  !isPackaged &&
    fs.watch(
      `${root}/src/main`,
      {
        recursive: true,
      },
      (eventType, filename) => {
        build()
      }
    )
}

run().catch(e => {
  console.error(e)

  process.exit(1)
})
