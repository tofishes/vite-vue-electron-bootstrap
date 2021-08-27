import { screen } from 'electron'

import CommonWindow from './common-window'
import { WINDOW_TAG } from '../libs/constants'
import _global from './global'
// import initUpdater from './init/updater'

function initWindow() {
  let mainWin = _global.getWindow(WINDOW_TAG.MAIN)!

  if (mainWin) {
    mainWin.focus()
    return mainWin
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  mainWin = CommonWindow('/home', {
    tag: WINDOW_TAG.MAIN,
    width: width * 0.8,
    height: height * 0.8,
  })
  // 在webContents完成page loaded之前就要调用updater,
  // 因为updater注册了ipc事件
  // initUpdater(mainWin)

  // 减少闪烁，防止显示窗口而无内容
  mainWin.once('ready-to-show', async () => {
    mainWin.show()
  })

  mainWin.on('closed', () => {
    _global.quit()
  })

  return mainWin
}

export default initWindow
