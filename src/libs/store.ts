import fs from 'fs'
import os from 'os'

const dataDir = `${os.tmpdir()}/quan-desktop`

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, {
    recursive: true
  })
}

const get = (key: string) =>
  new Promise<any>(resolve => {
    fs.readFile(`${dataDir}/${key}.json`, (e, data) => {
      resolve(e ? undefined : JSON.parse(data.toString()))
    })
  })

const set = (key: string, data: any) => {
  return fs.writeFile(`${dataDir}/${key}.json`, JSON.stringify(data), e => {})
}

const clear = () =>
  new Promise<boolean>(resolve => {
    fs.rm(
      dataDir,
      {
        recursive: true
      },
      e => resolve(true)
    )
  })

export default { get, set, clear }
