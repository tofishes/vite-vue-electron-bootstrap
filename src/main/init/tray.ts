import path from 'path'

import { BrowserWindow, Tray, Menu } from 'electron'

import config from '../../libs/config'
import _global from '../global'

function toggleWindow(show?: boolean) {
  const win = BrowserWindow.getAllWindows()[0]
  const isHidden = show ?? !win?.isVisible()

  if (win) {
    isHidden ? win.show() : win.hide()
  }
}

function init() {
  const trayIco = path.join(__dirname, '../../resources/logo-suite.ico')
  const { title } = config
  const tray = new Tray(trayIco)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `打开${title}`,
      click() {
        toggleWindow(true)
      }
    },
    {
      label: `退出${title}`,
      click() {
        _global.quit()
      }
    }
  ])

  tray.setToolTip(title)
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    toggleWindow()
  })

  return tray
}

export default init
