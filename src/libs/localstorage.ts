import { WebContents } from 'electron'

interface Storage {
  get(key: string): Promise<any>
  set(key: string, data: any): void
  clear(): void
  remove(key: string): void
}
type MethodDict = 'get' | 'set' | 'remove' | 'clear'

function getDataArg(data: any) {
  return data ? `, '${JSON.stringify(data)}'` : ''
}
function getJS(storage: string, method: MethodDict, key?: string, data?: any) {
  let template: string

  if (method === 'clear') {
    template = `window.${storage}.clear()`
  } else {
    template = `window.${storage}.${method}Item('${key}'${getDataArg(data)})`

    if (method === 'get') {
      template = `(() => {
        var r = ${template}
        try {
          return JSON.parse(r) 
        } catch(e) { return r }
      })()`
    }
  }

  return template
}

type StorageType = 'local' | 'session'
/**
 * usage:
 * const storage = new Localstorage(mainWin.webContents)
    storage.set('quan', {cc: 1}).then(async () => {
    const r = await storage.get('quan')
    setTimeout(() => storage.clear(), 10000)
  })
 */
class Localstorage implements Storage {
  private contents: WebContents
  private readonly storageName: string

  constructor(webContents: WebContents, type: StorageType = 'local') {
    this.contents = webContents
    this.storageName = `${type}Storage`
  }

  /**
   * 从webview的localStorage中获取key对应的值，是json.parse后的对象
   * @param key
   */
  async get(key: string) {
    return await this.contents.executeJavaScript(getJS(this.storageName, 'get', key))
  }

  /**
   * 向webview中的localStorage存储数据
   * @param key
   * @param data 对象，会自动被JSON序列化为字符串
   */
  async set(key: string, data: any) {
    await this.contents.executeJavaScript(getJS(this.storageName, 'set', key, data))
  }

  /**
   * 删除webview中的localStorage对应的key值
   * @param key
   */
  async remove(key: string) {
    await this.contents.executeJavaScript(getJS(this.storageName, 'remove', key))
  }

  /**
   * 清空webview中的localStorage
   */
  async clear() {
    await this.contents.executeJavaScript(getJS(this.storageName, 'clear'))
  }
}

export default Localstorage
