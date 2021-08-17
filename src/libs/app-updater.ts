import fs from 'fs'
import os from 'os'
import path from 'path'
import EventEmitter from 'events'
import crypto from 'crypto'
import { spawn } from 'child_process'

import axios, { AxiosResponse, AxiosTransformer } from 'axios'
import { app } from 'electron'

import { VersionInfo } from '../types'

import { gt } from './semver'
import { CHANNEL_UPDATE, ERRORS } from './constants'

function fileHash(filename: string) {
  const hash = crypto.createHash('sha512')
  const input = fs.createReadStream(filename)

  return new Promise((resolve, reject) => {
    input.on('readable', () => {
      // Only one element is going to be produced by the
      // hash stream.
      const data = input.read()

      if (data) {
        hash.update(data)
      } else {
        resolve(hash.digest('base64'))
      }
    })

    input.on('error', reject)
  })
}

async function _spawn(exe: string, args: string[]) {
  return new Promise((resolve, reject) => {
    try {
      const process = spawn(exe, args, {
        detached: true,
        stdio: 'ignore'
      })

      process.on('error', error => {
        reject(error)
      })

      process.unref()

      if (process.pid !== undefined) {
        resolve(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export class AppUpdater extends EventEmitter {
  private readonly tempDir: string
  private readonly currentVersion: string
  private installer: string | undefined
  private feedUrl: string | undefined
  private handler: AxiosTransformer | undefined
  private downloadUrl: string | undefined
  private versionInfo: VersionInfo | undefined
  private verification: boolean | undefined

  constructor() {
    super()

    this.tempDir = `${os.tmpdir()}/${app.getName()}-updater`

    this.currentVersion = app.getVersion()

    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, {
        recursive: true
      })
    }
  }

  setVertify(vertify: boolean) {
    this.verification = vertify
  }

  setFeedURL(url: string, handler?: AxiosTransformer) {
    this.feedUrl = url

    this.handler = handler
  }

  getInstaller(url: string): string {
    const filename = path.basename(url)

    return path.join(this.tempDir, filename)
  }

  async checkForUpdates(): Promise<void> {
    if (!this.feedUrl) {
      throw new Error('Has not set a feedUrl')
    }

    let info

    try {
      const rsp = await axios.get<any, AxiosResponse<VersionInfo>>(this.feedUrl, {
        transformResponse: this.handler
      })

      info = rsp.data
    } catch (e) {
      this.emit(CHANNEL_UPDATE.UNABLE)

      return
    }

    this.versionInfo = info

    if (gt(info.version, this.currentVersion)) {
      this.installer = this.getInstaller(info.url)

      if (fs.existsSync(this.installer)) {
        this.emit(CHANNEL_UPDATE.DOWNLOADED, info)

        return
      }

      this.emit(CHANNEL_UPDATE.ABLE, info)

      this.downloadUrl = info.url

      return
    }

    this.emit(CHANNEL_UPDATE.UNABLE)
  }

  downloadUpdate() {
    if (!this.downloadUrl) {
      throw new Error('no available download url, can you checkForUpdate first?')
    }

    this.download(this.downloadUrl!).then()
  }

  async download(url: string) {
    const installer = this.getInstaller(url)

    if (fs.existsSync(installer)) {
      return this.emit(CHANNEL_UPDATE.DOWNLOADED)
    }

    const { data, headers } = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
    const totalLength = ~~headers['content-length']
    let receivedLength = 0

    const writer = fs.createWriteStream(installer)

    data.on('data', (chunk: Buffer) => {
      receivedLength += chunk.length

      const percent = ~~((receivedLength / totalLength) * 100).toFixed(0)

      this.emit(CHANNEL_UPDATE.PROGRESS, {
        total: totalLength,
        received: receivedLength,
        percent
      })
    }).on('end', async () => {
      if (!this.verification) {
        return this.emit(CHANNEL_UPDATE.DOWNLOADED)
      }

      try {
        const hash = await fileHash(installer!)

        if (hash === this.versionInfo?.hash) {
          this.emit(CHANNEL_UPDATE.DOWNLOADED)
        } else {
          throw new Error(ERRORS.INVALID_INSTALLER)
        }
      } catch (e) {
        this.emit(CHANNEL_UPDATE.ERROR, e)
      }
    }).on('error', () => this.emit(CHANNEL_UPDATE.ERROR, new Error(ERRORS.DOWNLOAD_FAILURE)))

    data.pipe(writer)
  }

  quitAndInstall(isSilent?: boolean, isForceRunAfter?: boolean) {
    if (this.installer) {
      const args = ['--updated']

      if (isSilent) {
        args.push('/S')
      }

      if (isForceRunAfter) {
        args.push('--force-run')
      }

      _spawn(this.installer, args)
        .catch(e => {
          this.emit(CHANNEL_UPDATE.ERROR, e)
        })
        .then(app.quit)
    }
  }
}

const autoUpdater = new AppUpdater()

export default autoUpdater
