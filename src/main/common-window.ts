import path from 'path'

import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

import config from '../libs/config'
import getEntry from '../libs/get-entry'
import { WINDOW_TAG } from '../libs/constants'

import _global from './global'

const defaultOpts = {
  tag: WINDOW_TAG.MAIN,
  show: false,
  title: config.title,
  icon: config.icon,
  useContentSize: true,
  webPreferences: {
    contextIsolation: true,
    partition: config.persist.main, // 共享session
    preload: path.join(__dirname, '../preload/index.js'),
  },
  backgroundColor: '#ffffff',
}

type TAG = keyof Record<WINDOW_TAG, 1>
type Options = {
  // 窗口标签，可以根据标签找到对应的BrowserWindow对象
  tag: TAG
} & BrowserWindowConstructorOptions

/**
 * 创建通用主进程window，默认是不显示状态，高宽度自适应内容
 * @param route 要载入的路由
 * @param options BrowserWindow类的options
 */
function getWindow(route: string, options: Options) {
  const window = new BrowserWindow(Object.assign({}, defaultOpts, options))

  _global.registerWindow(options.tag, window.id)

  window.loadURL(getEntry(route)).catch((e: any) => console.log(e))

  return window
}

export default getWindow
