import { app, BrowserWindow, Menu, Tray } from 'electron'

import env from '../libs/env'

// import getMainWindow from './login-window'
import getMainWindow from './main-window'
import initTray from './init/tray'

function initApp() {
  // 单例运行该程序
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()

    return
  }

  let tray: Tray

  app.on('second-instance', () => {
    const activeWindow = BrowserWindow.getAllWindows()[0]

    if (activeWindow) {
      activeWindow.restore()

      activeWindow.focus()
    }
  })

  app.on('window-all-closed', () => {
    console.log('trigger event: window-all-closed')
    // 只有主窗口关闭时，才退出
    // 登录窗口退出并打开主窗口时会触发该事件，所以不能这样使用
    // if (process.platform !== 'darwin') {
    //   app.quit()
    // }
  })

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await getMainWindow()
    }
  })

  if (!env.isDev) {
    Menu.setApplicationMenu(null)
  }

  app.whenReady().then(async () => {
    await getMainWindow()

    tray = initTray()
  })
}

initApp()

// from https://github.com/electron-react-boilerplate/electron-react-boilerplate/blob/master/src/main.dev.ts
// const RESOURCES_PATH = app.isPackaged
//   ? path.join(process.resourcesPath, 'assets')
//   : path.join(__dirname, '../assets');
//
// const getAssetPath = (...paths: string[]): string => {
//   return path.join(RESOURCES_PATH, ...paths);
// };
