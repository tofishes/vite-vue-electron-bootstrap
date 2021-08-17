type Maps = {
  [index: string]: any
}
interface CommanderDef {
  init(userArgv?: string[]): void
  // 注册参数名
  registerParam(paramName: string): void
  // 获取命令行参数值
  param(name: string): any
}

class Commander implements CommanderDef {
  private readonly paramMap: Maps
  private readonly params: Maps

  constructor(...args: string[]) {
    this.paramMap = {}

    this.params = {}

    args.map(item => this.registerParam(item))

    this.init()
  }

  init(userArgv?: string[]) {
    const argvs = (userArgv ?? process.argv).slice(1)
    const argKey = Object.keys(this.registerParam)

    argvs.map(item => {
      const key = argKey.find(ak => item.startsWith(ak))

      if (key) {
        this.params[key] = item.replace(key, '')
      }
    })
  }

  registerParam(name: string) {
    this.paramMap[`--${name}=`] = name
  }

  param(name: string) {
    return this.params[name]
  }
}

export default Commander
