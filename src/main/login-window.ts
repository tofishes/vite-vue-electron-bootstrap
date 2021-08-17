import CommonWindow from './common-window'
import store from '../libs/store'
import { WINDOW_TAG } from '../libs/constants'

async function initWindow() {
  const window = CommonWindow('/login', {
    tag: WINDOW_TAG.LOGIN,
    maximizable: false,
    resizable: false,
    frame: false,
    width: 500
  })

  // 减少闪烁，防止显示窗口而无内容
  window.once('ready-to-show', () => {
    window.show()
  })

  return window
}

export default initWindow
