import { app, BrowserWindow } from 'electron'

import '../../typings/index.d'

type WIN_MAP = {
  [key: string]: number
}

const windowMap: WIN_MAP = {}

global.registerWindow = (tag: string, windowId: number) => {
  windowMap[tag] = windowId
}

global.getWindow = (tag: string): BrowserWindow | null => {
  const id = windowMap[tag]

  if (id === undefined) {
    return null
  }

  return BrowserWindow.fromId(id)
}

global.getFocusedWindow = () => {
  return BrowserWindow.getFocusedWindow()
}

global.quit = () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

export default global
