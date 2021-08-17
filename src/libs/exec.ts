import { spawn, SpawnOptions } from 'child_process'
interface ExecArgs {
  commond: string
}
type STD = 'out' | 'in' | 'err'

function exec(commond: string) {
  const [cmd, ...args] = commond.split(' ')
  const options: SpawnOptions = {
    env: {
      FORCE_COLOR: 'true'
    }
  }
  const cp = spawn(cmd, args, options)
  cp?.stdout?.setEncoding('utf-8')

  return {
    on(type: string = 'out', callback: Function = () => {}) {
      // @ts-ignore
      cp[`std${type}`].on('data', callback)
    }
  }
}

export default exec
